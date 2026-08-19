import { useEffect, useLayoutEffect, useState } from "react";
import { DocumentationApp, type Theme, type ViewId } from "./App";
import { ComponentIndexPage } from "./component-index";

function readView(): ViewId {
  const [route = ""] = window.location.hash.slice(1).split("/");
  if (!route || route === "introduction" || route === "product" || route === "home") return "components";
  if (route === "interaction-button") return "button";
  return route as ViewId;
}

/**
 * Synchronous route harness retained for unit tests. The production entry uses
 * PublicRoot so documentation and catalog routes remain lazy.
 */
export default function LegacyApp() {
  const [view, setView] = useState<ViewId>(readView);
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = window.localStorage.getItem("whatiuse-theme") ?? window.localStorage.getItem("index-ui-theme");
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
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("whatiuse-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => setView(readView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const select = (next: ViewId) => {
    const normalized: ViewId = next === "home" ? "components" : next;
    setView(normalized);
    window.history.replaceState(null, "", normalized === "components" ? `${window.location.pathname}${window.location.search}` : `#${normalized}`);
  };

  if (view === "components") {
    return <ComponentIndexPage theme={theme} onThemeChange={setTheme} />;
  }

  return <DocumentationApp view={view} onSelect={select} onHome={() => select("home")} theme={theme} onThemeChange={setTheme} />;
}
