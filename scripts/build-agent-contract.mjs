import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import ts from "@typescript/typescript6";
import Ajv2020 from "ajv/dist/2020.js";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function loadTypeScriptModule(path) {
  const source = await readFile(path, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
    fileName: path,
  });
  const url = `data:text/javascript;base64,${Buffer.from(result.outputText).toString("base64")}#${hash(source)}`;
  return import(url);
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const registry = JSON.parse(await readFile(resolve(root, "registry.json"), "utf8"));
const schema = await readFile(resolve(root, "agent/whatiuse-agent.schema.json"), "utf8");
const agent = await loadTypeScriptModule(resolve(root, "src/lib/whatiuse-agent-contract.ts"));
const guidanceModule = await loadTypeScriptModule(resolve(root, "src/component-guidance.ts"));
const guidance = guidanceModule.componentGuidance;

const installableTypes = new Set(["registry:ui", "registry:component", "registry:block", "registry:lib"]);
const components = registry.items.filter((item) => installableTypes.has(item.type)).map((item) => {
  const componentGuidance = guidance[item.name];
  return {
    id: item.name,
    title: item.title ?? item.name,
    type: item.type,
    description: item.description ?? "",
    registryItem: `@whatiuse/${item.name}`,
    registryDependencies: item.registryDependencies ?? [],
    packageDependencies: item.dependencies ?? [],
    ...(componentGuidance ? {
      useWhen: componentGuidance.useWhen,
      avoidWhen: componentGuidance.avoidWhen,
      states: componentGuidance.states,
      keyboard: componentGuidance.keyboard,
      quality: componentGuidance.quality,
    } : {}),
  };
});

const contract = {
  $schema: "https://whatiuse.minwookshin.com/agent/whatiuse-agent.schema.json",
  schemaVersion: 1,
  version: packageJson.version,
  generatedBy: "scripts/build-agent-contract.mjs",
  system: agent.whatiuseAgentSystemContract,
  components,
  recipes: agent.whatiuseAgentRecipeContracts,
  selectionRules: agent.whatiuseAgentSelectionRules,
  forbiddenRules: agent.whatiuseAgentForbiddenRules,
};

const validate = new Ajv2020({ allErrors: true, strict: true }).compile(JSON.parse(schema));
if (!validate(contract)) {
  throw new Error(`[agent-contract] generated contract failed its JSON Schema: ${JSON.stringify(validate.errors)}`);
}

const serialized = `${JSON.stringify(contract, null, 2)}\n`;
const outputs = new Map([
  [resolve(root, "agent/generated/whatiuse-agent.json"), serialized],
  [resolve(root, "public/agent/whatiuse-agent.json"), serialized],
  [resolve(root, "skills/whatiuse/references/catalog.json"), serialized],
  [resolve(root, "public/agent/whatiuse-agent.schema.json"), schema.endsWith("\n") ? schema : `${schema}\n`],
]);

for (const [path, expected] of outputs) {
  if (checkOnly) {
    const current = await readFile(path, "utf8").catch(() => null);
    if (current !== expected) throw new Error(`[agent-contract] ${path} is stale; run npm run build:agent`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, expected, "utf8");
  }
}

console.log(`[agent-contract] ${checkOnly ? "verified" : "generated"} ${components.length} installable items, ${contract.recipes.length} recipes, ${contract.selectionRules.length} selection rules, and ${contract.forbiddenRules.length} forbidden rules`);
