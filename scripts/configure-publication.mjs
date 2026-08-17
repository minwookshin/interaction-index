import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const repository = valueFor("--repo");
if (!repository || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
  throw new Error("Usage: npm run configure:publication -- --repo owner/repository [--homepage https://…]");
}

const root = process.cwd();
const homepage = valueFor("--homepage") ?? `https://${repository.split("/")[0]}.github.io/${repository.split("/")[1]}`;
const repositoryUrl = `https://github.com/${repository}`;

for (const rawUrl of [homepage, repositoryUrl]) {
  const url = new URL(rawUrl);
  if (url.protocol !== "https:") throw new Error(`Publication URLs must use HTTPS: ${rawUrl}`);
}

const packagePath = resolve(root, "package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
packageJson.repository = { type: "git", url: `git+${repositoryUrl}.git` };
packageJson.bugs = { url: `${repositoryUrl}/issues` };
packageJson.homepage = homepage;
await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const registryPath = resolve(root, "registry.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
registry.homepage = homepage;
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

const issueConfigPath = resolve(root, ".github/ISSUE_TEMPLATE/config.yml");
const issueConfig = await readFile(issueConfigPath, "utf8");
await writeFile(issueConfigPath, issueConfig.replace("https://github.com/OWNER/REPOSITORY/security/advisories/new", `${repositoryUrl}/security/advisories/new`));

const publication = {
  status: "configured",
  repository,
  repositoryUrl,
  issueTracker: `${repositoryUrl}/issues`,
  securityAdvisories: `${repositoryUrl}/security/advisories/new`,
  homepage,
  registryNamespace: "@teum",
  packageCandidate: "teum",
  registryInstall: `npx shadcn@${packageJson.devDependencies.shadcn} add ${repository}/teum#v${packageJson.version}`,
};
await writeFile(resolve(root, "publication.json"), `${JSON.stringify(publication, null, 2)}\n`);

console.log(`[publication] configured ${repositoryUrl}`);
console.log(`[publication] package remains private: ${Boolean(packageJson.private)}`);
