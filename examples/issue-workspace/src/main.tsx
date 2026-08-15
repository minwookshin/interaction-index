import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "interaction-index/styles.css";
import App from "./App";
import "./workspace.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
