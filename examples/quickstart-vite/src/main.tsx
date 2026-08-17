import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import "./index.css";

type Theme = "light" | "dark";

function Quickstart() {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };

  return (
    <main className="quickstart-shell">
      <p>Teum + Vite</p>
      <h1>One installed component.</h1>
      <div className="quickstart-actions">
        <Button variant="primary">Create issue</Button>
        <Button onClick={toggleTheme}>Use {theme === "light" ? "dark" : "light"} theme</Button>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Quickstart />
  </StrictMode>,
);
