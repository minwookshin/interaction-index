import { readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const registryRoot = resolve(process.cwd(), "public/r");
const entries = await readdir(registryRoot, { withFileTypes: true });
const mutableArtifacts = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

for (const artifact of mutableArtifacts) {
  await rm(resolve(registryRoot, artifact.name));
}

console.log(`[registry-clean] removed ${mutableArtifacts.length} mutable JSON artifacts; versioned releases were preserved`);
