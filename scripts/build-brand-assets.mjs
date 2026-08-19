import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Command } from "@phosphor-icons/react";
import { chromium } from "playwright";

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

const font = await readFile(new URL("../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", import.meta.url));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html>
    <html>
      <style>
        @font-face {
          font-family: Inter;
          src: url(data:font/woff2;base64,${font.toString("base64")}) format("woff2");
          font-style: normal;
          font-weight: 100 900;
        }
        * { box-sizing: border-box; }
        html, body { width: 1200px; height: 630px; margin: 0; }
        body {
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #fbfbfc;
          color: #111113;
          font-family: Inter, sans-serif;
          text-rendering: geometricPrecision;
        }
        h1 {
          margin: 0;
          font-size: 72px;
          font-weight: 650;
          letter-spacing: -0.045em;
          line-height: 1;
        }
        p {
          position: absolute;
          right: 0;
          bottom: 42px;
          left: 0;
          margin: 0;
          color: #56565c;
          font-size: 18px;
          font-weight: 450;
          letter-spacing: -0.012em;
          line-height: 1.4;
          text-align: center;
        }
      </style>
      <body>
        <h1>whatiuse</h1>
        <p>components i use.</p>
      </body>
    </html>`);
  await page.screenshot({
    path: fileURLToPath(new URL("social-preview.jpg", publicDirectory)),
    type: "jpeg",
    quality: 92,
  });
} finally {
  await browser.close();
}

const written = await readFile(new URL("favicon.svg", publicDirectory), "utf8");
if (!written.includes("<rect") || !written.includes("<path")) throw new Error("Generated whatiuse icon is incomplete");
console.log("[brand-assets] generated favicon.svg, apple-touch-icon.png, and social-preview.jpg");
