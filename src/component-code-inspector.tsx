import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { getPublicLibraryItem, type PublicLibraryItemId } from "./component-catalog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui";
import { copyText } from "./lib/copy-text";
import { getComponentInstallCommand } from "./lib/component-install-command";

type ComponentCodeInspectorProps = {
  id: PublicLibraryItemId | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SourceFile = "react" | "css";
type CopyTarget = SourceFile | "install";

const reactSourceModules = import.meta.glob<string>("../registry/components/ui/*.tsx", {
  import: "default",
  query: "?raw",
});

const cssSourceModules = import.meta.glob<string>("../registry/styles/components/*.css", {
  import: "default",
  query: "?raw",
});

const emptySources: Record<SourceFile, string> = { react: "", css: "" };

async function loadComponentSources(id: PublicLibraryItemId) {
  const reactLoader = reactSourceModules[`../registry/components/ui/${id}.tsx`];
  const cssLoader = cssSourceModules[`../registry/styles/components/${id}.css`];

  if (!reactLoader || !cssLoader) throw new Error(`Missing registry source for ${id}`);

  const [react, css] = await Promise.all([reactLoader(), cssLoader()]);
  return { react, css } satisfies Record<SourceFile, string>;
}

export function ComponentCodeInspector({ id, open, onOpenChange }: ComponentCodeInspectorProps) {
  const [tab, setTab] = useState("source");
  const [sourceFile, setSourceFile] = useState<SourceFile>("react");
  const [sources, setSources] = useState<Record<SourceFile, string>>(emptySources);
  const [sourceStatus, setSourceStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);
  const component = getPublicLibraryItem(id);

  useEffect(() => {
    setTab("source");
    setSourceFile("react");
    setSources(emptySources);
    setSourceStatus("idle");
    setCopied(null);
  }, [id]);

  useEffect(() => {
    if (!open || !id) return;

    let active = true;
    setSourceStatus("loading");
    void loadComponentSources(id).then((nextSources) => {
      if (!active) return;
      setSources(nextSources);
      setSourceStatus("ready");
    }).catch(() => {
      if (active) setSourceStatus("error");
    });

    return () => {
      active = false;
    };
  }, [id, open]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  if (!id || !component) return null;

  const source = sources[sourceFile];
  const sourceLabel = sourceFile === "react" ? "React" : "CSS";
  const sourceFileName = `${id}.${sourceFile === "react" ? "tsx" : "css"}`;
  const install = getComponentInstallCommand(id);

  const copy = async (target: CopyTarget, value: string) => {
    if (!await copyText(value)) return;
    setCopied(target);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="component-code-inspector">
        <header className="component-code-inspector__header">
          <DialogTitle>{component.name}</DialogTitle>
        </header>

        <Tabs className="component-code-inspector__tabs" value={tab} onValueChange={setTab}>
          <TabsList aria-label={`${component.name} implementation`} activateOnFocus={false}>
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="install">Install</TabsTrigger>
          </TabsList>

          <div className="component-code-inspector__viewport">
            <TabsContent value="source" className="component-code-inspector__panel">
              <div className="component-code-inspector__filebar">
                <div className="component-code-inspector__file-switcher" role="group" aria-label={`${component.name} source files`}>
                  {(["react", "css"] as const).map((file) => (
                    <button
                      key={file}
                      type="button"
                      aria-pressed={sourceFile === file}
                      onClick={() => setSourceFile(file)}
                    >
                      {file === "react" ? "React" : "CSS"}
                    </button>
                  ))}
                </div>
                <span className="component-code-inspector__file-name">{sourceFileName}</span>
                <button
                  className="component-code-inspector__copy"
                  type="button"
                  title={copied === sourceFile ? "Copied" : `Copy ${sourceLabel} source`}
                  disabled={sourceStatus !== "ready"}
                  onClick={() => void copy(sourceFile, source)}
                  aria-label={copied === sourceFile ? `${component.name} ${sourceLabel} source copied` : `Copy ${component.name} ${sourceLabel} source`}
                >
                  {copied === sourceFile ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </button>
              </div>
              <pre
                id={`component-code-${id}-${sourceFile}`}
                role="region"
                aria-label={`${component.name} ${sourceLabel} source`}
                tabIndex={0}
              >
                <code>{sourceStatus === "loading" ? "Loading source..." : sourceStatus === "error" ? "Source unavailable." : source}</code>
              </pre>
            </TabsContent>

            <TabsContent value="install" className="component-code-inspector__panel component-code-inspector__panel--install">
              <div className="component-code-inspector__install-copy">
                <code>{install}</code>
                <button type="button" title={copied === "install" ? "Copied" : "Copy install command"} onClick={() => void copy("install", install)} aria-label={copied === "install" ? `${component.name} install command copied` : `Copy ${component.name} install command`}>
                  {copied === "install" ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <footer className="component-code-inspector__footer">
          <a href={component.docsHref}>Accessibility &amp; API</a>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
