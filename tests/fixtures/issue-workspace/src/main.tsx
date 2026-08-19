import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "whatiuse/styles.css";
import App from "./App";
import "./workspace.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
