import { gzipSync } from "node:zlib";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const assetsDir = resolve(root, "dist/client/assets");
const files = await readdir(assetsDir);
const measured = [];

for (const file of files.filter((name) => name.endsWith(".js") || name.endsWith(".css"))) {
  const bytes = await readFile(resolve(assetsDir, file));
  measured.push({ file, bytes: bytes.byteLength, gzipBytes: gzipSync(bytes).byteLength });
}

const jsGzipBytes = measured.filter((item) => item.file.endsWith(".js")).reduce((sum, item) => sum + item.gzipBytes, 0);
const cssGzipBytes = measured.filter((item) => item.file.endsWith(".css")).reduce((sum, item) => sum + item.gzipBytes, 0);
const report = {
  budgets: { jsGzipBytes: 330000, cssGzipBytes: 40000 },
  totals: { jsGzipBytes, cssGzipBytes },
  assets: measured.sort((a, b) => b.gzipBytes - a.gzipBytes),
};

await writeFile(resolve(root, "performance-report.json"), JSON.stringify(report, null, 2) + "\n");
if (jsGzipBytes > report.budgets.jsGzipBytes) throw new Error("[performance] JavaScript gzip budget exceeded: " + jsGzipBytes);
if (cssGzipBytes > report.budgets.cssGzipBytes) throw new Error("[performance] CSS gzip budget exceeded: " + cssGzipBytes);
console.log("[performance] JS " + jsGzipBytes + " / " + report.budgets.jsGzipBytes + " gzip bytes; CSS " + cssGzipBytes + " / " + report.budgets.cssGzipBytes + " gzip bytes");
