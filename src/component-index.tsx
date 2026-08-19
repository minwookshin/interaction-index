import {
  Check,
  CodeSimple,
  Copy,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  getPublicLibraryItem,
  libraryCollections,
  publicLibraryItems,
  type ComponentId,
  type CollectionLibraryComponentId,
  type LibraryCollection,
  type PublicLibraryItem,
  type PublicLibraryItemId,
} from "./component-catalog";
import { ComponentCodeInspector } from "./component-code-inspector";
import { AsyncActionButton } from "./components/showcase/async-action-button";
import { Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, UndoStackProvider } from "./components/ui";
import type { Theme } from "./App";
import { copyText } from "./lib/copy-text";
import { getComponentInstallCommand } from "./lib/component-install-command";
import { PublicHeaderActions } from "./public-header-actions";
import "./styles.css";
import "./component-index.css";

const PrimaryPreviewFor = lazy(() => import("./App").then((module) => ({ default: module.PrimaryPreviewFor })));
const CollectionPreviewFor = lazy(() => import("./collection-preview").then((module) => ({ default: module.CollectionPreviewFor })));

type ComponentIndexPageProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

const spaciousPreviews = new Set<PublicLibraryItemId>([
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
  "data-table",
  "data-toolbar",
  "chart",
  "donut-chart",
  "heatmap",
]);

type PreviewStage = "compact" | "form" | "product";

const compactPreviews = new Set<PublicLibraryItemId>([
  "button",
  "icon-button",
  "checkbox",
  "switch",
  "segmented-control",
  "breadcrumbs",
  "pagination",
  "progress",
  "spinner",
  "skeleton",
  "badge",
  "avatar",
]);

const productPreviews = new Set<PublicLibraryItemId>([
  "tooltip",
  "popover",
  "menu",
  "context-menu",
  "dialog",
  "sheet",
  "alert-dialog",
  "toast",
  "table",
  "tree",
]);

const overlayPreviews = new Set<PublicLibraryItemId>([
  "select",
  "context-switcher",
  "combobox",
  "date-picker",
  "tooltip",
  "popover",
  "menu",
  "context-menu",
  "dialog",
  "sheet",
  "alert-dialog",
  "toast",
  "filter-builder",
  "data-toolbar",
  "saved-view-menu",
  "column-visibility-menu",
  "facet-filter",
  "data-sort-menu",
  "data-group-menu",
  "row-actions-menu",
  "date-range-filter",
  "data-export-menu",
]);

const flagshipPreviews = new Set<PublicLibraryItemId>([
  "button",
  "select",
  "combobox",
  "dialog",
  "toast",
  "data-table",
  "filter-builder",
  "chart",
]);

function previewStageFor(item: PublicLibraryItem): PreviewStage {
  if (item.collection !== "Core" || productPreviews.has(item.id)) return "product";
  return compactPreviews.has(item.id) ? "compact" : "form";
}

function inspectorIdFromHash(): PublicLibraryItemId | null {
  const [route, id] = window.location.hash.slice(1).split("/");
  if (route !== "components" || !id) return null;
  return getPublicLibraryItem(id)?.id ?? null;
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
}: {
  pageRef: RefObject<HTMLDivElement | null>;
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
    <motion.div
      className="whatiuse-wordmark whatiuse-wordmark--scroll-docked"
      aria-hidden="true"
      style={{ transform: reduceMotion ? "translate3d(0, 0, 0) scale(1)" : transform }}
    >
      <strong>whatiuse</strong>
    </motion.div>
  );
}

function AuthorIdentity() {
  return (
    <span className="component-index-author">
      <a
        className="component-index-author__link"
        href="https://www.minwookshin.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="@minwook — portfolio"
      >
        @minwook
      </a>
      <span className="component-index-author__portraits" aria-hidden="true">
        <img src="/assets/minwook-mario.jpeg" alt="" />
        <img src="/assets/minwook-ice-cream.jpeg" alt="" />
        <img src="/assets/minwook-portrait.jpeg" alt="" />
      </span>
    </span>
  );
}

function ComponentPreview({ item, eager }: { item: PublicLibraryItem; eager: boolean }) {
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
      data-component={item.id}
      data-collection={item.collection.toLocaleLowerCase()}
      data-stage={previewStageFor(item)}
      data-spacious={spaciousPreviews.has(item.id) || undefined}
      aria-label={`${item.name} interactive preview`}
    >
      {ready ? (
        <Suspense fallback={<span className="component-index-preview__loading">Loading preview</span>}>
          {item.collection === "Core"
            ? item.id === "button" ? <AsyncActionButton compact autoResetMs={1400} widthBehavior="morph" /> : <PrimaryPreviewFor id={item.id as ComponentId} />
            : <CollectionPreviewFor id={item.id as CollectionLibraryComponentId} />}
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
  component: PublicLibraryItem;
  eager: boolean;
  copied: boolean;
  onCopy: () => void;
  onOpenCode: () => void;
}) {
  return (
    <li
      className="component-index-row"
      data-component={component.id}
      data-stage={previewStageFor(component)}
      data-overlay={overlayPreviews.has(component.id) || undefined}
      data-flagship={flagshipPreviews.has(component.id) || undefined}
    >
      <div className="component-index-row__identity">
        <strong>{component.name}</strong>
      </div>
      <ComponentPreview item={component} eager={eager} />
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
}: ComponentIndexPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<LibraryCollection>("Core");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<PublicLibraryItemId | null>(null);
  const [inspectedId, setInspectedId] = useState<PublicLibraryItemId | null>(inspectorIdFromHash);
  const copyTimer = useRef<number | undefined>(undefined);
  const resetCollectionScroll = useRef(false);

  useEffect(() => {
    document.title = "whatiuse";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", "Browse, try, and install whatiuse components.");
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  useLayoutEffect(() => {
    if (!resetCollectionScroll.current) return;
    resetCollectionScroll.current = false;

    const page = pageRef.current;
    const catalog = catalogRef.current;
    const toolbar = page?.querySelector<HTMLElement>(".component-index-toolbar");
    if (!page || !catalog || !toolbar) return;

    const target = Math.max(0, page.scrollTop + catalog.getBoundingClientRect().top - toolbar.getBoundingClientRect().bottom);
    if (typeof page.scrollTo === "function") page.scrollTo({ top: target, behavior: "auto" });
    else page.scrollTop = target;
  }, [collection]);

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
    return publicLibraryItems.filter((component) => {
      const matchesCollection = component.collection === collection;
      const searchTokens = `${component.id} ${component.name} ${component.group ?? ""} ${component.description}`
        .toLocaleLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
      const matchesQuery = queryTokens.every((queryToken) => searchTokens.some((token) => token.startsWith(queryToken)));
      return matchesCollection && matchesQuery;
    });
  }, [collection, query]);

  const visibleGroups = useMemo(() => [{ group: collection, items: filteredComponents }], [collection, filteredComponents]);

  const selectCollection = (nextCollection: LibraryCollection) => {
    if (nextCollection === collection) return;
    resetCollectionScroll.current = true;
    setCollection(nextCollection);
    setQuery("");
  };

  const copyInstall = async (id: PublicLibraryItemId) => {
    const command = getComponentInstallCommand(id);
    if (!await copyText(command)) return;
    setCopiedId(id);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedId(null), 1400);
  };

  const openInspector = (id: PublicLibraryItemId) => {
    setInspectedId(id);
    window.history.pushState({ whatiuseInspector: true }, "", `#components/${id}`);
  };

  const closeInspector = () => {
    setInspectedId(null);
    if (window.history.state?.whatiuseInspector) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", "#components");
  };

  return (
    <TooltipProvider>
      <UndoStackProvider>
        <div ref={pageRef} className="component-index-page">
          <a className="whatiuse-skip-link" href="#component-index-content" onClick={(event) => {
            event.preventDefault();
            document.getElementById("component-index-content")?.focus({ preventScroll: true });
          }}>Skip to main content</a>

          <header className="landing-header component-index-header">
            <ScrollDockedWordmark pageRef={pageRef} />
            <PublicHeaderActions theme={theme} onThemeChange={onThemeChange} />
          </header>

          <main id="component-index-content" tabIndex={-1}>
            <section className="component-index-intro" aria-labelledby="component-index-title">
              <span className="component-index-intro__static-wordmark" aria-hidden="true">whatiuse</span>
              <div className="component-index-intro__descriptor">
                <h1 id="component-index-title">components i use.</h1>
                <AuthorIdentity />
              </div>
            </section>

            <div className="component-index-library-heading">
              <h2>Library</h2>
            </div>

            <div className="component-index-toolbar">
              <div className="component-index-collections" role="tablist" aria-label="Component collections">
                {libraryCollections.map((item) => <button key={item} type="button" role="tab" aria-selected={collection === item} onClick={() => selectCollection(item)}>{item}</button>)}
              </div>
              <div className="component-index-search">
                <MagnifyingGlass aria-hidden="true" />
                <label className="whatiuse-sr-only" htmlFor="component-index-search">Search components</label>
                <input id="component-index-search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search components" />
                {query && <button type="button" aria-label="Clear component search" onClick={() => setQuery("")}><X aria-hidden="true" /></button>}
              </div>
            </div>

            <p className="whatiuse-sr-only" role="status" aria-live="polite">{filteredComponents.length} components shown</p>

            <div ref={catalogRef} className="component-index-groups">
              {visibleGroups.map(({ group, items }) => (
                <section className="component-index-group" data-collection={collection.toLocaleLowerCase()} key={group} aria-label={`${group} components`}>
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
              {!visibleGroups.some(({ items }) => items.length) && <div className="component-index-empty"><strong>No components</strong><button type="button" onClick={() => setQuery("")}>Clear search</button></div>}
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
