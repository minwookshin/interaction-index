import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import ts from "@typescript/typescript6";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const sourceRoot = resolve(root, "src");
const entryPoint = resolve(sourceRoot, "components/ui/index.ts");
const virtualOut = resolve(root, ".whatiuse-api-emit");
const generatedRoot = resolve(root, "api/generated");
const generatedTypesRoot = resolve(generatedRoot, "types");
const documentationOutput = resolve(sourceRoot, "documentation/generated-component-exports.ts");

const hash = (value) => createHash("sha256").update(value).digest("hex");
const normalize = (value) => value.replace(/\s+/g, " ").trim();
const compact = (value, limit = 240) => value.length <= limit ? value : `${value.slice(0, limit - 1)}…`;

function fail(message) {
  throw new Error(`[api] ${message}`);
}

const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
if (!configPath) fail("tsconfig.json was not found");
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
if (configFile.error) fail(ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, dirname(configPath), {
  declaration: true,
  declarationMap: false,
  emitDeclarationOnly: true,
  incremental: false,
  noEmit: false,
  outDir: virtualOut,
  rootDir: sourceRoot,
}, configPath);

const program = ts.createProgram({ rootNames: [entryPoint], options: parsed.options });
const checker = program.getTypeChecker();
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length > 0) {
  fail(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n",
  }));
}

const declarationFiles = new Map();
const emit = program.emit(undefined, (fileName, data) => {
  if (!fileName.endsWith(".d.ts")) return;
  const outputPath = relative(virtualOut, fileName);
  declarationFiles.set(outputPath, data);
});
if (emit.emitSkipped) fail("TypeScript skipped declaration emission");

const registry = JSON.parse(await readFile(resolve(root, "registry.json"), "utf8"));
const coreComponentIds = registry.items
  .filter((item) => item.type === "registry:ui")
  .map((item) => item.name);
const productComponentIds = registry.items
  .filter((item) => item.type === "registry:component")
  .map((item) => item.name);
const componentIds = [...coreComponentIds, ...productComponentIds];
if (coreComponentIds.length === 0) fail("registry exposes no public Core components");
if (new Set(componentIds).size !== componentIds.length) fail("registry contains duplicate public component names");

function declarationKind(symbol, declaration) {
  if (symbol.flags & ts.SymbolFlags.TypeAlias) return "type";
  if (symbol.flags & ts.SymbolFlags.Interface) return "interface";
  if (symbol.flags & ts.SymbolFlags.Function) return "function";
  if (ts.isFunctionDeclaration(declaration)) return "function";
  return "const";
}

function publicSignature(exportedSymbol, declaration) {
  const target = exportedSymbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(exportedSymbol)
    : exportedSymbol;
  const targetDeclaration = target.valueDeclaration ?? target.declarations?.[0] ?? declaration;
  const kind = declarationKind(target, targetDeclaration);
  let exact = "";

  if (kind === "function") {
    const type = checker.getTypeOfSymbolAtLocation(target, targetDeclaration);
    const call = type.getCallSignatures()[0];
    exact = call
      ? `${exportedSymbol.name}${checker.signatureToString(call, targetDeclaration, ts.TypeFormatFlags.NoTruncation)}`
      : checker.typeToString(type, targetDeclaration, ts.TypeFormatFlags.NoTruncation);
  } else if (ts.isTypeAliasDeclaration(targetDeclaration)) {
    exact = `${exportedSymbol.name} = ${normalize(targetDeclaration.type.getText(targetDeclaration.getSourceFile()))}`;
  } else if (ts.isInterfaceDeclaration(targetDeclaration)) {
    exact = normalize(targetDeclaration.getText(targetDeclaration.getSourceFile()).replace(/^export\s+/, ""));
  } else {
    const type = checker.getTypeOfSymbolAtLocation(target, targetDeclaration);
    exact = `${exportedSymbol.name}: ${checker.typeToString(type, targetDeclaration, ts.TypeFormatFlags.NoTruncation)}`;
  }

  return {
    name: exportedSymbol.name,
    kind,
    signature: compact(normalize(exact)),
    typeHash: hash(normalize(exact)),
    description: ts.displayPartsToString(target.getDocumentationComment(checker)),
  };
}

const entrySource = program.getSourceFile(entryPoint);
const entrySymbol = entrySource && checker.getSymbolAtLocation(entrySource);
if (!entrySource || !entrySymbol) fail("public entry point could not be resolved");
const indexExports = checker.getExportsOfModule(entrySymbol).map((symbol) => symbol.name).sort();
const indexExportSet = new Set(indexExports);

const componentModules = {};
for (const id of componentIds) {
  const sourcePath = resolve(sourceRoot, `components/ui/${id}.tsx`);
  const sourceFile = program.getSourceFile(sourcePath);
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
  if (!sourceFile || !moduleSymbol) fail(`${id} source module could not be resolved`);
  const exports = checker.getExportsOfModule(moduleSymbol)
    .map((symbol) => {
      const declaration = symbol.declarations?.[0] ?? symbol.valueDeclaration;
      if (!declaration) fail(`${id}/${symbol.name} has no declaration`);
      return publicSignature(symbol, declaration);
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  if (exports.length === 0) fail(`${id} has no public exports`);
  for (const item of exports) {
    if (!indexExportSet.has(item.name)) fail(`${id}/${item.name} is not re-exported from the public entry point`);
  }
  const source = await readFile(sourcePath, "utf8");
  componentModules[id] = {
    source: relative(root, sourcePath),
    sourceHash: hash(source),
    declaration: `api/generated/types/components/ui/${id}.d.ts`,
    exports,
  };
}

const components = Object.fromEntries(coreComponentIds.map((id) => [id, componentModules[id]]));
const productComponents = Object.fromEntries(productComponentIds.map((id) => [id, componentModules[id]]));
const contractDefinitions = [
  { id: "motion-contract", source: "lib/motion-contract.ts" },
  { id: "data-view-state", source: "lib/data-view-state.ts" },
  { id: "data-export", source: "lib/data-export.ts" },
  { id: "whatiuse-data-contract", source: "lib/whatiuse-data-contract.ts" },
  { id: "analytics", source: "lib/analytics.ts" },
  { id: "whatiuse-analytics-contract", source: "lib/whatiuse-analytics-contract.ts" },
  { id: "whatiuse-product-patterns-contract", source: "lib/whatiuse-product-patterns-contract.ts" },
  { id: "whatiuse-agent-contract", source: "lib/whatiuse-agent-contract.ts" },
];
const contracts = {};
for (const { id, source } of contractDefinitions) {
  const sourcePath = resolve(sourceRoot, source);
  const sourceFile = program.getSourceFile(sourcePath);
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
  if (!sourceFile || !moduleSymbol) fail(`${id} contract module could not be resolved`);
  const exports = checker.getExportsOfModule(moduleSymbol)
    .map((symbol) => {
      const declaration = symbol.declarations?.[0] ?? symbol.valueDeclaration;
      if (!declaration) fail(`${id}/${symbol.name} has no declaration`);
      return publicSignature(symbol, declaration);
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const item of exports) {
    if (!indexExportSet.has(item.name)) fail(`${id}/${item.name} is not re-exported from the public entry point`);
  }
  contracts[id] = {
    source,
    sourceHash: hash(await readFile(sourcePath, "utf8")),
    declaration: `api/generated/types/${source.replace(/\.ts$/, ".d.ts")}`,
    exports,
  };
}
const indexRuntimeExports = [...new Set([
  ...Object.values(componentModules),
  ...Object.values(contracts),
].flatMap((module) => module.exports
  .filter((item) => item.kind === "function" || item.kind === "const")
  .map((item) => item.name)))].sort();

const manifest = {
  schemaVersion: 1,
  generatedBy: "scripts/build-api.mjs",
  entryPoint: relative(root, entryPoint),
  typescriptVersion: ts.version,
  componentCount: coreComponentIds.length,
  productComponentCount: productComponentIds.length,
  publicComponentCount: componentIds.length,
  exportCount: indexExports.length,
  runtimeExportCount: indexRuntimeExports.length,
  indexExports,
  indexRuntimeExports,
  components,
  productComponents,
  contracts,
};

const report = [
  "# whatiuse public API report",
  "",
  "> Generated from the TypeScript compiler. Do not edit directly.",
  "",
  `- Entry point: \`${manifest.entryPoint}\``,
  `- TypeScript: \`${manifest.typescriptVersion}\``,
  `- Core components: \`${manifest.componentCount}\``,
  `- Product components: \`${manifest.productComponentCount}\``,
  `- Public exports: \`${manifest.exportCount}\``,
  `- Runtime exports: \`${manifest.runtimeExportCount}\``,
  "",
  ...coreComponentIds.flatMap((id) => [
    `## ${id}`,
    "",
    `Declaration: [\`${id}.d.ts\`](./types/components/ui/${id}.d.ts)`,
    "",
    ...componentModules[id].exports.map((item) => `- **${item.name}** · ${item.kind} · \`${item.signature.replaceAll("`", "\\`")}\``),
    "",
  ]),
  "# Product components",
  "",
  ...productComponentIds.flatMap((id) => [
    `## ${id}`,
    "",
    `Declaration: [\`${id}.d.ts\`](./types/components/ui/${id}.d.ts)`,
    "",
    ...componentModules[id].exports.map((item) => `- **${item.name}** · ${item.kind} · \`${item.signature.replaceAll("`", "\\`")}\``),
    "",
  ]),
  "# Contracts",
  "",
  ...contractDefinitions.flatMap(({ id }) => [
    `## ${id}`,
    "",
    `Declaration: [\`${contracts[id].declaration.split("/").at(-1)}\`](./types/lib/${contracts[id].declaration.split("/").at(-1)})`,
    "",
    ...contracts[id].exports.map((item) => `- **${item.name}** · ${item.kind} · \`${item.signature.replaceAll("`", "\\`")}\``),
    "",
  ]),
].join("\n");
const reportOutput = `${report.trimEnd()}\n`;

const documentationExports = Object.fromEntries(coreComponentIds.map((id) => [
  id,
  components[id].exports.map(({ name, kind, signature }) => ({ name, kind, signature })),
]));
const documentationModule = `/* Generated by scripts/build-api.mjs. Do not edit directly. */\n\nexport const generatedComponentExports = ${JSON.stringify(
  documentationExports,
  null,
  2,
)} as const;\n\nexport type GeneratedComponentExportId = keyof typeof generatedComponentExports;\n`;

const expectedFiles = new Map([
  [resolve(generatedRoot, "public-api.json"), `${JSON.stringify(manifest, null, 2)}\n`],
  [resolve(generatedRoot, "public-api.md"), reportOutput],
  [documentationOutput, documentationModule],
]);
for (const [outputPath, data] of declarationFiles) {
  expectedFiles.set(resolve(generatedTypesRoot, outputPath), data);
}

async function verifyFile(path, expected) {
  const current = await readFile(path, "utf8").catch(() => null);
  if (current !== expected) fail(`${relative(root, path)} is stale; run npm run build:api`);
}

if (checkOnly) {
  for (const [path, data] of expectedFiles) await verifyFile(path, data);
} else {
  for (const [path, data] of expectedFiles) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data, "utf8");
  }
}

const generatedTypeFiles = await readdir(generatedTypesRoot, { recursive: true, withFileTypes: true }).catch(() => []);
const expectedTypePaths = new Set([...expectedFiles.keys()].filter((path) => path.startsWith(generatedTypesRoot)));
for (const entry of generatedTypeFiles) {
  if (!entry.isFile() || !entry.name.endsWith(".d.ts")) continue;
  const path = resolve(entry.parentPath, entry.name);
  if (!expectedTypePaths.has(path)) fail(`${relative(root, path)} is an orphaned declaration; rebuild the API artifacts`);
}

console.log(`[api] ${checkOnly ? "verified" : "generated"} ${manifest.componentCount} Core modules, ${manifest.productComponentCount} product modules, ${manifest.exportCount} public exports (${manifest.runtimeExportCount} runtime), and ${declarationFiles.size} declaration files`);
