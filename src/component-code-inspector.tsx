import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import packageManifest from "../package.json";
import { components, type ComponentId } from "./component-catalog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui";
import { componentCode } from "./documentation/component-code";
import { copyText } from "./lib/copy-text";

type ComponentCodeInspectorProps = {
  id: ComponentId | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CopyTarget = "source" | "install";

export function ComponentCodeInspector({ id, open, onOpenChange }: ComponentCodeInspectorProps) {
  const [tab, setTab] = useState("source");
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);
  const component = components.find((item) => item.id === id);

  useEffect(() => {
    setTab("source");
    setCopied(null);
  }, [id]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  if (!id || !component) return null;

  const source = componentCode[id];
  const install = `npx shadcn@${packageManifest.devDependencies.shadcn} add ${packageManifest.homepage}/r/v/${packageManifest.version}/${id}.json`;

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
                <span>{id}.tsx</span>
                <button type="button" onClick={() => void copy("source", source)} aria-label={copied === "source" ? `${component.name} source copied` : `Copy ${component.name} source`}>
                  {copied === "source" ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  <span>{copied === "source" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre tabIndex={0}><code>{source}</code></pre>
            </TabsContent>

            <TabsContent value="install" className="component-code-inspector__panel component-code-inspector__panel--install">
              <div className="component-code-inspector__install-copy">
                <code>{install}</code>
                <button type="button" onClick={() => void copy("install", install)} aria-label={copied === "install" ? `${component.name} install command copied` : `Copy ${component.name} install command`}>
                  {copied === "install" ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  <span>{copied === "install" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <footer className="component-code-inspector__footer">
          <a href={`#${id}`}>Accessibility &amp; API</a>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
