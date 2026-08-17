import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const outputPath = resolve(root, "release/public-surface.freeze.json");

const fail = (message) => {
  throw new Error(`[release-freeze] ${message}`);
};

const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));

const [registry, publicApi, tokenManifest] = await Promise.all([
  readJson("registry.json"),
  readJson("api/generated/public-api.json"),
  readJson("tokens/generated/token-manifest.json"),
]);

const componentIds = registry.items
  .filter((item) => item.type === "registry:ui")
  .map((item) => item.name);
const productComponentIds = registry.items
  .filter((item) => item.type === "registry:component")
  .map((item) => item.name);

if (componentIds.length !== 45) {
  fail(`the RC catalog must contain exactly 45 components; found ${componentIds.length}`);
}
if (new Set(componentIds).size !== componentIds.length) {
  fail("the RC catalog contains duplicate component ids");
}

const apiComponentIds = Object.keys(publicApi.components);
const apiProductComponentIds = Object.keys(publicApi.productComponents ?? {});
const missingFromApi = componentIds.filter((id) => !apiComponentIds.includes(id));
const missingFromRegistry = apiComponentIds.filter((id) => !componentIds.includes(id));
if (missingFromApi.length || missingFromRegistry.length) {
  fail(`registry/API component drift; missing from API: ${missingFromApi.join(", ") || "none"}; missing from registry: ${missingFromRegistry.join(", ") || "none"}`);
}
const productMissingFromApi = productComponentIds.filter((id) => !apiProductComponentIds.includes(id));
const productMissingFromRegistry = apiProductComponentIds.filter((id) => !productComponentIds.includes(id));
if (productMissingFromApi.length || productMissingFromRegistry.length) {
  fail(`registry/API product-component drift; missing from API: ${productMissingFromApi.join(", ") || "none"}; missing from registry: ${productMissingFromRegistry.join(", ") || "none"}`);
}

const components = Object.fromEntries(componentIds.map((id) => [
  id,
  publicApi.components[id].exports.map(({ name, kind, typeHash }) => ({ name, kind, typeHash })),
]));
const productComponents = Object.fromEntries(productComponentIds.map((id) => [
  id,
  publicApi.productComponents[id].exports.map(({ name, kind, typeHash }) => ({ name, kind, typeHash })),
]));
const contracts = Object.fromEntries(Object.entries(publicApi.contracts ?? {}).map(([id, contract]) => [
  id,
  contract.exports.map(({ name, kind, typeHash }) => ({ name, kind, typeHash })),
]));

const tokenContract = tokenManifest.tokens.map(({ path, type, cssVariable, deprecated }) => ({
  path,
  type,
  cssVariable,
  deprecated,
}));

const freeze = {
  schemaVersion: 1,
  status: "frozen-for-0.1-rc",
  policy: {
    componentAdditions: "blocked",
    productComponentAdditions: "migration-and-freeze-update-required",
    componentRemovals: "blocked",
    publicTypeChanges: "migration-and-freeze-update-required",
    semanticTokenChanges: "migration-and-freeze-update-required",
    implementationFixes: "allowed-when-public-contract-is-unchanged",
  },
  catalog: {
    componentCount: componentIds.length,
    componentIds,
    productComponentCount: productComponentIds.length,
    productComponentIds,
    registryItemCount: registry.items.length,
  },
  publicApi: {
    exportCount: publicApi.exportCount,
    runtimeExportCount: publicApi.runtimeExportCount,
    indexExports: publicApi.indexExports,
    indexRuntimeExports: publicApi.indexRuntimeExports,
    components,
    productComponents,
    contracts,
  },
  semanticTokens: {
    format: tokenManifest.format,
    modes: tokenManifest.modes,
    count: tokenContract.length,
    contract: tokenContract,
  },
};

const expected = `${JSON.stringify(freeze, null, 2)}\n`;

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => null);
  if (current !== expected) {
    fail("release/public-surface.freeze.json drifted; public changes require an explicit migration note and npm run build:freeze");
  }
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, expected, "utf8");
}

console.log(`[release-freeze] ${checkOnly ? "verified" : "captured"} ${componentIds.length} Core components, ${productComponentIds.length} product components, ${publicApi.exportCount} exports, and ${tokenContract.length} semantic tokens`);
