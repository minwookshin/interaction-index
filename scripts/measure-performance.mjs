import { gzipSync } from "node:zlib";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const assetsDir = resolve(root, "dist/client/assets");
const indexHtml = await readFile(resolve(root, "dist/client/index.html"), "utf8");
const files = await readdir(assetsDir);
const measured = [];

for (const file of files.filter((name) => name.endsWith(".js") || name.endsWith(".css"))) {
  const bytes = await readFile(resolve(assetsDir, file));
  measured.push({ file, bytes: bytes.byteLength, gzipBytes: gzipSync(bytes).byteLength });
}

const initialJavaScript = new Set([...indexHtml.matchAll(/\/assets\/([^"']+\.js)/g)].map((match) => match[1]));
const initialJsGzipBytes = measured.filter((item) => initialJavaScript.has(item.file)).reduce((sum, item) => sum + item.gzipBytes, 0);
const totalJsGzipBytes = measured.filter((item) => item.file.endsWith(".js")).reduce((sum, item) => sum + item.gzipBytes, 0);
const cssGzipBytes = measured.filter((item) => item.file.endsWith(".css")).reduce((sum, item) => sum + item.gzipBytes, 0);
const report = {
  budgets: { initialJsGzipBytes: 350000, totalJsGzipBytes: 500000, cssGzipBytes: 40000 },
  totals: { initialJsGzipBytes, totalJsGzipBytes, cssGzipBytes },
  initialJavaScript: [...initialJavaScript].sort(),
  assets: measured.sort((a, b) => b.gzipBytes - a.gzipBytes),
};

await writeFile(resolve(root, "performance-report.json"), JSON.stringify(report, null, 2) + "\n");
if (initialJsGzipBytes > report.budgets.initialJsGzipBytes) throw new Error("[performance] initial JavaScript gzip budget exceeded: " + initialJsGzipBytes);
if (totalJsGzipBytes > report.budgets.totalJsGzipBytes) throw new Error("[performance] total JavaScript gzip budget exceeded: " + totalJsGzipBytes);
if (cssGzipBytes > report.budgets.cssGzipBytes) throw new Error("[performance] CSS gzip budget exceeded: " + cssGzipBytes);
console.log("[performance] initial JS " + initialJsGzipBytes + " / " + report.budgets.initialJsGzipBytes + "; total JS " + totalJsGzipBytes + " / " + report.budgets.totalJsGzipBytes + "; CSS " + cssGzipBytes + " / " + report.budgets.cssGzipBytes + " gzip bytes");
