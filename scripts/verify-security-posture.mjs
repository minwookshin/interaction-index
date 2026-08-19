import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), "utf8");
const failures = [];
const requireContract = (condition, message) => {
  if (!condition) failures.push(message);
};

const workflowDirectory = resolve(root, ".github/workflows");
const workflowNames = (await readdir(workflowDirectory)).filter((name) => name.endsWith(".yml")).sort();
for (const name of workflowNames) {
  const source = await read(`.github/workflows/${name}`);
  const actionReferences = [...source.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm)].map((match) => match[1]);
  requireContract(actionReferences.length > 0, `${name}: workflow has no auditable action references`);
  for (const reference of actionReferences) {
    requireContract(/^[^@]+@[0-9a-f]{40}$/.test(reference), `${name}: action is not pinned to a full commit SHA: ${reference}`);
  }

  const checkouts = [...source.matchAll(/^([ \t]*)- uses: actions\/checkout@[0-9a-f]{40}.*$/gm)];
  for (const checkout of checkouts) {
    const following = source.slice(checkout.index, checkout.index + 320);
    requireContract(/persist-credentials:\s*false/.test(following), `${name}: checkout must disable persisted credentials`);
  }

  requireContract(/^permissions:/m.test(source) || /^\s{4}permissions:/m.test(source), `${name}: permissions are implicit`);
  const globalPermissions = source.match(/^permissions:\s*\n((?:^  .+\n?)*)/m)?.[1] ?? "";
  requireContract(!/(?:id-token|attestations|pages):\s*write/.test(globalPermissions), `${name}: write privileges are workflow-wide`);
}

const packageJson = JSON.parse(await read("package.json"));
requireContract(/^\d+\.\d+\.\d+$/.test(packageJson.devDependencies?.shadcn ?? ""), "shadcn CLI must use an exact version");
requireContract(packageJson.private === true, "npm publication lock must remain enabled");

const publicationSurfaces = [
  "README.md",
  "publication.json",
  "public/llms.txt",
  "src/App.tsx",
  "src/landing.tsx",
  "src/documentation/public-docs.tsx",
  "scripts/configure-publication.mjs",
  "scripts/verify-shadcn-consumer.mjs",
  "tests/browser/documentation.spec.ts",
];
for (const path of publicationSurfaces) {
  const source = await read(path);
  requireContract(!/shadcn@latest/.test(source), `${path}: mutable shadcn@latest install remains`);
}

const packageWorkflow = await read(".github/workflows/package-candidate.yml");
requireContract(!/subject-path:\s*[^\n]*[*?]/.test(packageWorkflow), "package attestation subject must not use a wildcard");
requireContract(/\n  attest:\n/.test(packageWorkflow), "attestation must run in an isolated job");
requireContract(/mapfile[\s\S]*test "\$\{#subjects\[@\]\}" -eq 1/.test(packageWorkflow), "attestation must validate exactly one tarball");

const packageAssembler = await read("scripts/build-package-candidate.mjs");
requireContract(/mkdtemp\(/.test(packageAssembler), "package candidate must assemble in a fresh staging directory");
requireContract(/output already exists/.test(packageAssembler), "package candidate must reject a reused output directory");
requireContract(/unexpected output set/.test(packageAssembler), "package candidate must reject files outside its exact allowlist");
requireContract(/rename\(staging, output\)/.test(packageAssembler), "package candidate must publish the staged directory atomically");

const releaseAssembler = await read("scripts/assemble-release-candidate.mjs");
requireContract(/mkdtemp\(/.test(releaseAssembler), "release candidate must assemble in a fresh staging directory");
requireContract(/output already exists/.test(releaseAssembler), "release candidate must reject a reused output directory");
requireContract(/unexpected candidate file set/.test(releaseAssembler), "release candidate must reject files outside its exact allowlist");
requireContract(/rename\(staging, output\)/.test(releaseAssembler), "release candidate must publish the staged directory atomically");

const cleanRoom = await read("scripts/verify-clean-room.mjs");
requireContract(/"clone", "--no-hardlinks", "--no-checkout"/.test(cleanRoom), "clean-room verification must use an isolated local Git clone");
requireContract(!/GIT_(?:DIR|WORK_TREE)/.test(cleanRoom), "clean-room verification must not expose the owner Git directory to consumer fixtures");

const codeowners = await read(".github/CODEOWNERS");
for (const protectedPath of ["/public/r/v/", "/.github/workflows/", "/scripts/verify-registry-history.mjs"]) {
  requireContract(codeowners.includes(protectedPath), `CODEOWNERS does not protect ${protectedPath}`);
}

const worker = await read("worker/index.js");
for (const header of [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
]) {
  requireContract(worker.includes(`\"${header}\"`), `Sites worker does not set ${header}`);
}
requireContract(/isRegistryRoute/.test(worker), "Sites worker does not keep missing registry routes out of SPA fallback");
requireContract(/value > 0/.test(worker), "Sites worker does not honor Accept quality values");

const vercel = JSON.parse(await read("vercel.json"));
requireContract(!vercel.rewrites, "Vercel must not rewrite missing registry paths to the application shell");
const globalHeaders = vercel.headers?.find((entry) => entry.source === "/(.*)")?.headers ?? [];
for (const name of ["Content-Security-Policy", "Cache-Control", "Permissions-Policy", "Referrer-Policy", "X-Content-Type-Options"]) {
  requireContract(globalHeaders.some((header) => header.key === name), `Vercel global policy is missing ${name}`);
}
requireContract(globalHeaders.some((header) => header.key === "Cache-Control" && header.value === "no-cache"), "Vercel HTML fallback must opt out of stale caching");

if (failures.length > 0) {
  throw new Error(`[security] posture verification failed:\n- ${failures.join("\n- ")}`);
}

console.log(`[security] verified ${workflowNames.length} workflows, exact installer use, publication lock, and hosting policy`);
