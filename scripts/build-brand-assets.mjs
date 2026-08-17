import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Command } from "@phosphor-icons/react";

const exec = promisify(execFile);
const publicDirectory = new URL("../public/", import.meta.url);
const source = renderToStaticMarkup(createElement(Command, {
  color: "#ffffff",
  size: 40,
  weight: "bold",
  "aria-hidden": "true",
}));
const iconBody = source.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#111113"/><g transform="translate(12 12)">${iconBody}</g></svg>\n`;

await mkdir(publicDirectory, { recursive: true });
await writeFile(new URL("favicon.svg", publicDirectory), favicon, "utf8");
await exec("magick", [fileURLToPath(new URL("favicon.svg", publicDirectory)), "-resize", "180x180", fileURLToPath(new URL("apple-touch-icon.png", publicDirectory))]);

const written = await readFile(new URL("favicon.svg", publicDirectory), "utf8");
if (!written.includes("<rect") || !written.includes("<path")) throw new Error("Generated Teum icon is incomplete");
console.log("[brand-assets] generated favicon.svg and apple-touch-icon.png from the Phosphor Command icon");
