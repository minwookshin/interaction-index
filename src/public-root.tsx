import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { LandingPage } from "./landing";
import type { Theme, ViewId } from "./App";
import "./landing.css";

const LazyDocumentationApp = lazy(() => import("./App").then((module) => ({ default: module.DocumentationApp })));

function initialRoute() {
  const [hash = ""] = window.location.hash.slice(1).split("/");
  if (!hash || hash === "introduction" || hash === "product" || hash === "home") return "home";
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
    }
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("teum-theme", theme);
  }, [theme]);

  useLayoutEffect(() => {
    if (view !== "home") return;
    document.title = "Teum — Interfaces that stay clear through change";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", "Accessible React and TypeScript components with interaction patterns.");
  }, [view]);

  const select = (next: ViewId | string) => {
    setView(next);
    window.history.replaceState(null, "", next === "home" ? `${window.location.pathname}${window.location.search}` : `#${next}`);
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
      setPendingSearchFocus(true);
      if (view === "home") select("installation");
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [view]);

  useEffect(() => {
    if (!pendingSearchFocus || view === "home") return;
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
    const onHashChange = () => setView(initialRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (view === "home") {
    return <LandingPage theme={theme} onThemeChange={setTheme} onOpenDocumentation={() => select("installation")} onOpenComponents={() => select("button")} onOpenPatterns={() => select("patterns")} />;
  }

  return (
    <Suspense fallback={<div className="teum-route-loading" role="status"><span>Loading documentation</span></div>}>
      <LazyDocumentationApp view={view} onSelect={select} onHome={() => select("home")} theme={theme} onThemeChange={setTheme} />
    </Suspense>
  );
}
