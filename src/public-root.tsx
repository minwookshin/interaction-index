import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import type { Theme, ViewId } from "./App";
import "./foundation.css";
import "./landing.css";

const LazyDocumentationApp = lazy(() => import("./App").then((module) => ({ default: module.DocumentationApp })));
const LazyComponentIndexPage = lazy(() => import("./component-index").then((module) => ({ default: module.ComponentIndexPage })));

function RouteFallback() {
  return <div className="teum-route-loading" role="status"><span>Loading</span></div>;
}

function initialRoute() {
  const [hash = ""] = window.location.hash.slice(1).split("/");
  if (!hash || hash === "introduction" || hash === "product" || hash === "home") return "components";
  if (hash === "interaction-button") return "button";
  return hash;
}

export default function PublicRoot() {
  const [view, setView] = useState(initialRoute);
  const [pendingSearchFocus, setPendingSearchFocus] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = window.localStorage.getItem("teum-theme") ?? window.localStorage.getItem("index-ui-theme");
    return storedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const keyboardNavigationKeys = new Set(["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Enter", " ", "Escape"]);
    const usePointerModality = () => { root.dataset.inputModality = "pointer"; };
    const useKeyboardModality = (event: KeyboardEvent) => {
      if (keyboardNavigationKeys.has(event.key)) root.dataset.inputModality = "keyboard";
    };
    root.dataset.inputModality = "pointer";
    window.addEventListener("pointerdown", usePointerModality, true);
    window.addEventListener("keydown", useKeyboardModality, true);
    return () => {
      window.removeEventListener("pointerdown", usePointerModality, true);
      window.removeEventListener("keydown", useKeyboardModality, true);
      delete root.dataset.inputModality;
    };
  }, []);

  useLayoutEffect(() => {
    const [hash = ""] = window.location.hash.slice(1).split("/");
    if (hash === "introduction" || hash === "product" || hash === "home") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    } else if (hash === "interaction-button") {
      window.history.replaceState(null, "", "#button");
    }
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("teum-theme", theme);
  }, [theme]);

  const select = (next: ViewId | string) => {
    const normalized = next === "home" ? "components" : next;
    setView(normalized);
    window.history.replaceState(null, "", normalized === "components" ? `${window.location.pathname}${window.location.search}` : `#${normalized}`);
  };

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      const input = document.querySelector<HTMLInputElement>('input[aria-label="Search documentation"]');
      if (input) {
        input.focus();
        return;
      }
      if (view === "components") return;
      setPendingSearchFocus(true);
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [view]);

  useEffect(() => {
    if (!pendingSearchFocus || view === "components") return;
    let frame = 0;
    const focusWhenReady = () => {
      const input = document.querySelector<HTMLInputElement>('input[aria-label="Search documentation"]');
      if (input) {
        input.focus();
        setPendingSearchFocus(false);
        return;
      }
      frame = window.requestAnimationFrame(focusWhenReady);
    };
    frame = window.requestAnimationFrame(focusWhenReady);
    return () => window.cancelAnimationFrame(frame);
  }, [pendingSearchFocus, view]);

  useEffect(() => {
    const onHashChange = () => {
      const [hash = ""] = window.location.hash.slice(1).split("/");
      const next = initialRoute();
      if (hash === "interaction-button") window.history.replaceState(null, "", "#button");
      setView(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (view === "components") {
    return <Suspense fallback={<RouteFallback />}>
      <LazyComponentIndexPage theme={theme} onThemeChange={setTheme} onHome={() => select("home")} />
    </Suspense>;
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <LazyDocumentationApp view={view} onSelect={select} onHome={() => select("home")} theme={theme} onThemeChange={setTheme} />
    </Suspense>
  );
}
