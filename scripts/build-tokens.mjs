import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateOutputs, readTokenDocument, TOKEN_SOURCE } from "./token-utils.mjs";

const root = process.cwd();
const check = process.argv.includes("--check");
const document = await readTokenDocument(root);
const { model, outputs } = generateOutputs(document);
const drift = [];

for (const [relativePath, content] of outputs) {
  const outputPath = resolve(root, relativePath);
  if (check) {
    let current = "";
    try {
      current = await readFile(outputPath, "utf8");
    } catch {
      drift.push(relativePath);
      continue;
    }
    if (current !== content) drift.push(relativePath);
  } else {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, "utf8");
  }
}

if (drift.length > 0) {
  console.error(`[tokens] generated outputs are stale: ${drift.join(", ")}`);
  console.error("[tokens] run npm run build:tokens and commit the generated artifacts.");
  process.exitCode = 1;
} else {
  console.log(`[tokens] ${check ? "verified" : "generated"} ${model.tokens.length} tokens from ${TOKEN_SOURCE} across ${model.modes.length} modes`);
}
