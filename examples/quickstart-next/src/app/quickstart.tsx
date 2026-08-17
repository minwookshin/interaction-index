"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

export function Quickstart() {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };

  return (
    <main className="quickstart-shell">
      <p>Teum + Next.js</p>
      <h1>Source-owned from the start.</h1>
      <div className="quickstart-actions">
        <Button variant="primary">Create issue</Button>
        <Button onClick={toggleTheme}>Use {theme === "light" ? "dark" : "light"} theme</Button>
      </div>
    </main>
  );
}
