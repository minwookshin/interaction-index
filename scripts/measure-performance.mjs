import { gzipSync } from "node:zlib";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const clientDir = resolve(root, "dist/client");
const assetsDir = resolve(clientDir, "assets");
const indexHtml = await readFile(resolve(clientDir, "index.html"), "utf8");
const manifest = JSON.parse(await readFile(resolve(clientDir, ".vite/manifest.json"), "utf8"));
const files = await readdir(assetsDir);
const measured = [];

for (const file of files.filter((name) => name.endsWith(".js") || name.endsWith(".css"))) {
  const bytes = await readFile(resolve(assetsDir, file));
  measured.push({ file, bytes: bytes.byteLength, gzipBytes: gzipSync(bytes).byteLength });
}

const assetByPath = new Map(measured.map((item) => [`assets/${item.file}`, item]));
const initialJavaScript = new Set([...indexHtml.matchAll(/\/assets\/([^"']+\.js)/g)].map((match) => match[1]));
const initialStylesheets = new Set([...indexHtml.matchAll(/\/assets\/([^"']+\.css)/g)].map((match) => match[1]));
const initialJsGzipBytes = measured.filter((item) => initialJavaScript.has(item.file)).reduce((sum, item) => sum + item.gzipBytes, 0);
const totalJsGzipBytes = measured.filter((item) => item.file.endsWith(".js")).reduce((sum, item) => sum + item.gzipBytes, 0);
const initialCssGzipBytes = measured.filter((item) => initialStylesheets.has(item.file)).reduce((sum, item) => sum + item.gzipBytes, 0);
const totalCssGzipBytes = measured.filter((item) => item.file.endsWith(".css")).reduce((sum, item) => sum + item.gzipBytes, 0);
const latinFontFile = files.find((file) => /^inter-latin-wght-normal-.*\.woff2$/.test(file));
if (!latinFontFile) throw new Error("[performance] Inter Latin font asset is missing");
const latinFontBytes = (await readFile(resolve(assetsDir, latinFontFile))).byteLength;
const indexHtmlGzipBytes = gzipSync(Buffer.from(indexHtml)).byteLength;
const initialCriticalGzipBytes = initialJsGzipBytes + initialCssGzipBytes + latinFontBytes + indexHtmlGzipBytes;

function routeGraph(entryKeys) {
  const visited = new Set();
  const javascript = new Set();
  const stylesheets = new Set();
  const visit = (key) => {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = manifest[key];
    if (!entry) throw new Error(`[performance] manifest entry is missing: ${key}`);
    if (entry.file?.endsWith(".js")) javascript.add(entry.file);
    for (const stylesheet of entry.css ?? []) stylesheets.add(stylesheet);
    for (const dependency of entry.imports ?? []) visit(dependency);
  };
  for (const key of entryKeys) visit(key);
  const jsGzipBytes = [...javascript].reduce((sum, file) => sum + (assetByPath.get(file)?.gzipBytes ?? 0), 0);
  const cssGzipBytes = [...stylesheets].reduce((sum, file) => sum + (assetByPath.get(file)?.gzipBytes ?? 0), 0);
  return { jsGzipBytes, cssGzipBytes, javascript: [...javascript].sort(), stylesheets: [...stylesheets].sort() };
}

const appEntry = manifest["index.html"]?.dynamicImports?.find((key) => manifest[key]?.name === "App");
if (!appEntry) throw new Error("[performance] documentation application entry is missing");
const routes = {
  landing: routeGraph(["index.html"]),
  documentationShell: routeGraph([appEntry]),
  publicDocumentation: routeGraph([appEntry, "src/documentation/public-docs.tsx"]),
  productPilot: routeGraph([appEntry, "src/documentation/public-docs.tsx", "src/documentation/product-pilot.tsx"]),
  dataRecipes: routeGraph([appEntry, "src/documentation/public-docs.tsx", "src/documentation/data-recipes.tsx"]),
  analyticsRecipes: routeGraph([appEntry, "src/documentation/public-docs.tsx", "src/documentation/analytics-recipes.tsx"]),
  productPatterns: routeGraph([appEntry, "src/documentation/public-docs.tsx", "src/documentation/product-pattern-recipes.tsx"]),
  datePicker: routeGraph([appEntry, "src/documentation/date-picker-previews.tsx"]),
  tree: routeGraph([appEntry, "src/documentation/tree-previews.tsx"]),
  reorderableList: routeGraph([appEntry, "src/documentation/reorderable-list-previews.tsx"]),
};
const largestComponentRouteJsGzipBytes = Math.max(routes.datePicker.jsGzipBytes, routes.tree.jsGzipBytes, routes.reorderableList.jsGzipBytes);
const largestJavaScript = measured.filter((item) => item.file.endsWith(".js")).sort((a, b) => b.bytes - a.bytes)[0];

const report = {
  schemaVersion: 2,
  generatedBy: "scripts/measure-performance.mjs",
  generatedAt: new Date().toISOString(),
  budgets: {
    initialJsGzipBytes: 90000,
    initialCriticalGzipBytes: 140000,
    documentationShellJsGzipBytes: 360000,
    publicDocumentationJsGzipBytes: 370000,
    dataRecipesJsGzipBytes: 505000,
    analyticsRecipesJsGzipBytes: 515000,
    productPatternsJsGzipBytes: 500000,
    largestComponentRouteJsGzipBytes: 430000,
    largestJavaScriptRawBytes: 500000,
    largestJavaScriptGzipBytes: 115000,
    // This is the complete lazy graph for 45 Core components and 36 product
    // modules, not one route. Initial and per-route budgets remain the user-
    // visible guardrails; the aggregate caps independently loaded slices.
    totalJsGzipBytes: 800000,
    initialCssGzipBytes: 9000,
    totalCssGzipBytes: 65000,
  },
  totals: {
    initialJsGzipBytes,
    initialCriticalGzipBytes,
    totalJsGzipBytes,
    initialCssGzipBytes,
    totalCssGzipBytes,
    latinFontBytes,
    indexHtmlGzipBytes,
    largestComponentRouteJsGzipBytes,
    largestJavaScriptRawBytes: largestJavaScript.bytes,
    largestJavaScriptGzipBytes: largestJavaScript.gzipBytes,
  },
  routes,
  initialJavaScript: [...initialJavaScript].sort(),
  initialStylesheets: [...initialStylesheets].sort(),
  assets: measured.sort((a, b) => b.gzipBytes - a.gzipBytes),
};

await writeFile(resolve(root, "performance-report.json"), `${JSON.stringify(report, null, 2)}\n`);

const assertions = [
  [initialJsGzipBytes, report.budgets.initialJsGzipBytes, "initial JavaScript gzip"],
  [initialCriticalGzipBytes, report.budgets.initialCriticalGzipBytes, "initial critical transfer"],
  [routes.documentationShell.jsGzipBytes, report.budgets.documentationShellJsGzipBytes, "documentation shell JavaScript gzip"],
  [routes.publicDocumentation.jsGzipBytes, report.budgets.publicDocumentationJsGzipBytes, "public documentation JavaScript gzip"],
  [routes.dataRecipes.jsGzipBytes, report.budgets.dataRecipesJsGzipBytes, "whatiuse Data recipes JavaScript gzip"],
  [routes.analyticsRecipes.jsGzipBytes, report.budgets.analyticsRecipesJsGzipBytes, "whatiuse Analytics recipes JavaScript gzip"],
  [routes.productPatterns.jsGzipBytes, report.budgets.productPatternsJsGzipBytes, "whatiuse Product Patterns JavaScript gzip"],
  [largestComponentRouteJsGzipBytes, report.budgets.largestComponentRouteJsGzipBytes, "largest component route JavaScript gzip"],
  [largestJavaScript.bytes, report.budgets.largestJavaScriptRawBytes, "largest JavaScript chunk raw"],
  [largestJavaScript.gzipBytes, report.budgets.largestJavaScriptGzipBytes, "largest JavaScript chunk gzip"],
  [totalJsGzipBytes, report.budgets.totalJsGzipBytes, "total JavaScript gzip"],
  [initialCssGzipBytes, report.budgets.initialCssGzipBytes, "initial CSS gzip"],
  [totalCssGzipBytes, report.budgets.totalCssGzipBytes, "total CSS gzip"],
];
for (const [actual, budget, label] of assertions) {
  if (actual > budget) throw new Error(`[performance] ${label} budget exceeded: ${actual} > ${budget}`);
}

console.log(`[performance] initial JS ${initialJsGzipBytes}; critical transfer ${initialCriticalGzipBytes}; docs shell ${routes.documentationShell.jsGzipBytes}; heaviest component route ${largestComponentRouteJsGzipBytes} gzip bytes`);
console.log(`[performance] largest JS chunk ${largestJavaScript.bytes} raw / ${largestJavaScript.gzipBytes} gzip; total JS ${totalJsGzipBytes}; total CSS ${totalCssGzipBytes} gzip bytes`);
