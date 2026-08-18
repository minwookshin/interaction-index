import {
  Check,
  CodeSimple,
  Copy,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import packageManifest from "../package.json";
import {
  components,
  libraryComponentGroups,
  libraryComponents,
  type ComponentId,
  type LibraryComponentGroup,
} from "./component-catalog";
import { ComponentCodeInspector } from "./component-code-inspector";
import { AsyncActionButton } from "./components/showcase/async-action-button";
import { Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, UndoStackProvider } from "./components/ui";
import type { Theme } from "./App";
import { copyText } from "./lib/copy-text";
import { PublicHeaderActions } from "./public-header-actions";
import "./styles.css";
import "./component-index.css";

const PrimaryPreviewFor = lazy(() => import("./App").then((module) => ({ default: module.PrimaryPreviewFor })));

type CatalogFilter = "All" | LibraryComponentGroup;

type ComponentIndexPageProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onHome: () => void;
};

const spaciousPreviews = new Set<ComponentId>([
  "field",
  "input-group",
  "toolbar",
  "text-field",
  "textarea",
  "date-picker",
  "tabs",
  "alert",
  "empty-state",
  "table",
  "tree",
]);

function inspectorIdFromHash(): ComponentId | null {
  const [route, id] = window.location.hash.slice(1).split("/");
  if (route !== "components" || !id) return null;
  return components.some((component) => component.id === id) ? id as ComponentId : null;
}

type WordmarkGeometry = {
  travel: number;
  scale: number;
  dockDistance: number;
};

function readWordmarkGeometry(): WordmarkGeometry {
  const compact = window.innerWidth <= 640;
  const headerHeight = window.innerWidth <= 820 ? 60 : 64;
  return {
    travel: Math.max(0, window.innerHeight / 2 - headerHeight / 2),
    scale: compact ? 3.7 : 4.8,
    dockDistance: Math.max(260, Math.min(480, window.innerHeight * .58)),
  };
}

function ScrollDockedWordmark({
  pageRef,
  onHome,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
  onHome: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [geometry, setGeometry] = useState(readWordmarkGeometry);
  const { scrollY } = useScroll({ container: pageRef });
  const softenedScrollY = useSpring(scrollY, {
    stiffness: 420,
    damping: 54,
    mass: .45,
  });
  const transform = useTransform(
    softenedScrollY,
    [0, geometry.dockDistance],
    [
      `translate3d(0, ${geometry.travel}px, 0) scale(${geometry.scale})`,
      "translate3d(0, 0px, 0) scale(1)",
    ],
    { clamp: true },
  );

  useLayoutEffect(() => {
    const updateGeometry = () => setGeometry(readWordmarkGeometry());
    updateGeometry();
    window.addEventListener("resize", updateGeometry);
    return () => window.removeEventListener("resize", updateGeometry);
  }, []);

  return (
    <motion.a
      className="whatiuse-wordmark whatiuse-wordmark--scroll-docked"
      href="/"
      aria-label="whatiuse home"
      style={{ transform: reduceMotion ? "translate3d(0, 0, 0) scale(1)" : transform }}
      onClick={(event) => {
        event.preventDefault();
        if (typeof pageRef.current?.scrollTo === "function") {
          pageRef.current.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        }
        onHome();
      }}
    >
      <strong>whatiuse</strong>
    </motion.a>
  );
}

function ComponentPreview({ id, eager }: { id: ComponentId; eager: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);

  useEffect(() => {
    if (ready) return;
    if (eager) {
      setReady(true);
      return;
    }
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: "360px 0px", threshold: 0.01 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [eager, ready]);

  return (
    <div
      ref={frameRef}
      className="component-index-preview"
      data-component={id}
      data-spacious={spaciousPreviews.has(id) || undefined}
      aria-label={`${libraryComponents.find((component) => component.id === id)?.name ?? id} interactive preview`}
    >
      {ready ? (
        <Suspense fallback={<span className="component-index-preview__loading">Loading preview</span>}>
          {id === "button" ? <AsyncActionButton compact autoResetMs={1400} /> : <PrimaryPreviewFor id={id} />}
        </Suspense>
      ) : <span className="component-index-preview__loading">Loading preview</span>}
    </div>
  );
}

function CatalogRow({
  component,
  eager,
  copied,
  onCopy,
  onOpenCode,
}: {
  component: (typeof libraryComponents)[number];
  eager: boolean;
  copied: boolean;
  onCopy: () => void;
  onOpenCode: () => void;
}) {
  return (
    <li className="component-index-row" data-component={component.id}>
      <div className="component-index-row__identity">
        <strong>{component.name}</strong>
      </div>
      <ComponentPreview id={component.id} eager={eager} />
      <div className="component-index-row__actions">
        <Tooltip>
          <TooltipTrigger render={<a href={`#components/${component.id}`} aria-label={`Open ${component.name} code`} onClick={(event) => { event.preventDefault(); onOpenCode(); }}><CodeSimple aria-hidden="true" /></a>} />
          <TooltipContent>View code</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<button type="button" aria-label={copied ? `${component.name} install command copied` : `Copy ${component.name} install command`} onClick={onCopy}>{copied ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}</button>} />
          <TooltipContent>{copied ? "Copied" : "Copy install"}</TooltipContent>
        </Tooltip>
      </div>
    </li>
  );
}

export function ComponentIndexPage({
  theme,
  onThemeChange,
  onHome,
}: ComponentIndexPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<CatalogFilter>("All");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<ComponentId | null>(null);
  const [inspectedId, setInspectedId] = useState<ComponentId | null>(inspectorIdFromHash);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = "whatiuse";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", "Browse, try, and install Teum components.");
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  useEffect(() => {
    const syncInspector = () => setInspectedId(inspectorIdFromHash());
    window.addEventListener("hashchange", syncInspector);
    window.addEventListener("popstate", syncInspector);
    return () => {
      window.removeEventListener("hashchange", syncInspector);
      window.removeEventListener("popstate", syncInspector);
    };
  }, []);

  const filteredComponents = useMemo(() => {
    const queryTokens = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return libraryComponents.filter((component) => {
      const matchesGroup = filter === "All" || component.group === filter;
      const searchTokens = `${component.id} ${component.name} ${component.group} ${component.description}`
        .toLocaleLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
      const matchesQuery = queryTokens.every((queryToken) => searchTokens.some((token) => token.startsWith(queryToken)));
      return matchesGroup && matchesQuery;
    });
  }, [filter, query]);

  const visibleGroups = useMemo(() => libraryComponentGroups
    .map((group) => ({ group, items: filteredComponents.filter((component) => component.group === group) }))
    .filter(({ items }) => items.length > 0), [filteredComponents]);

  const copyInstall = async (id: ComponentId) => {
    const command = `npx shadcn@${packageManifest.devDependencies.shadcn} add ${packageManifest.homepage}/r/v/${packageManifest.version}/${id}.json`;
    if (!await copyText(command)) return;
    setCopiedId(id);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedId(null), 1400);
  };

  const openInspector = (id: ComponentId) => {
    setInspectedId(id);
    window.history.pushState({ teumInspector: true }, "", `#components/${id}`);
  };

  const closeInspector = () => {
    setInspectedId(null);
    if (window.history.state?.teumInspector) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", "#components");
  };

  return (
    <TooltipProvider>
      <UndoStackProvider>
        <div ref={pageRef} className="component-index-page">
          <a className="teum-skip-link" href="#component-index-content" onClick={(event) => {
            event.preventDefault();
            document.getElementById("component-index-content")?.focus({ preventScroll: true });
          }}>Skip to main content</a>

          <header className="landing-header component-index-header">
            <ScrollDockedWordmark pageRef={pageRef} onHome={onHome} />
            <PublicHeaderActions theme={theme} onThemeChange={onThemeChange} />
          </header>

          <main id="component-index-content" tabIndex={-1}>
            <section className="component-index-intro" aria-labelledby="component-index-title">
              <span className="component-index-intro__static-wordmark" aria-hidden="true">whatiuse</span>
              <h1 id="component-index-title">Components for product interfaces.</h1>
            </section>

            <div className="component-index-library-heading">
              <h2>Library</h2>
              <p><strong>{libraryComponents.length}</strong> components</p>
            </div>

            <div className="component-index-toolbar">
              <div className="component-index-filters" role="group" aria-label="Filter components by group">
                {(["All", ...libraryComponentGroups] as const).map((group) => (
                  <button type="button" key={group} aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>
                ))}
              </div>
              <div className="component-index-search">
                <MagnifyingGlass aria-hidden="true" />
                <label className="teum-sr-only" htmlFor="component-index-search">Search components</label>
                <input id="component-index-search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search" />
                {query && <button type="button" aria-label="Clear component search" onClick={() => setQuery("")}><X aria-hidden="true" /></button>}
              </div>
            </div>

            <p className="teum-sr-only" role="status" aria-live="polite">{filteredComponents.length} components shown</p>

            <div className="component-index-groups">
              {visibleGroups.map(({ group, items }) => (
                <section className="component-index-group" key={group} aria-labelledby={`component-index-${group.toLocaleLowerCase().replaceAll(" ", "-")}`}>
                  <header>
                    <h2 id={`component-index-${group.toLocaleLowerCase().replaceAll(" ", "-")}`}>{group}</h2>
                    <span>{items.length}</span>
                  </header>
                  <ul aria-label={`${group} components`}>
                    {items.map((component) => (
                      <CatalogRow
                        key={component.id}
                        component={component}
                        eager={filteredComponents.indexOf(component) < 6}
                        copied={copiedId === component.id}
                        onCopy={() => void copyInstall(component.id)}
                        onOpenCode={() => openInspector(component.id)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
              {!visibleGroups.length && <div className="component-index-empty"><strong>No components</strong><button type="button" onClick={() => { setFilter("All"); setQuery(""); }}>Clear filters</button></div>}
            </div>

            <footer className="component-index-footer">
              <a href="https://www.minwookshin.com/" target="_blank" rel="noreferrer">made by minwook</a>
              <a href="#licensing">MIT license</a>
            </footer>
          </main>
        </div>
        <ComponentCodeInspector id={inspectedId} open={Boolean(inspectedId)} onOpenChange={(open) => { if (!open) closeInspector(); }} />
        <Toaster />
      </UndoStackProvider>
    </TooltipProvider>
  );
}
