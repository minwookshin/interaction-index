import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const allowUnpublished = process.argv.includes("--allow-unpublished");
const writeEvidence = process.argv.includes("--write-evidence");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const publication = JSON.parse(await readFile(resolve(root, "publication.json"), "utf8"));
const version = packageJson.version;
const tag = `v${version}`;
const baseUrl = (process.env.TEUM_PUBLIC_BETA_URL ?? publication.homepage).replace(/\/$/, "");
const repository = publication.repository;
const fail = (message) => { throw new Error(`[public-beta] ${message}`); };

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: "follow",
    ...options,
    headers: {
      Accept: "application/json, text/plain, text/html;q=0.9",
      "User-Agent": "teum-public-beta-verifier",
      ...options.headers,
    },
  });
  return response;
}

async function requireResponse(url, label) {
  const response = await request(url);
  if (!response.ok) fail(`${label} returned ${response.status} at ${url}`);
  return response;
}

function requireHeader(response, name, pattern, label) {
  const value = response.headers.get(name) ?? "";
  if (!pattern.test(value)) fail(`${label} has invalid ${name}: ${value || "<missing>"}`);
  return value;
}

async function requireExactArtifact(pathname, label) {
  const local = await readFile(resolve(root, "public", pathname.slice(1)));
  const response = await requireResponse(`${baseUrl}${pathname}`, label);
  const remote = Buffer.from(await response.arrayBuffer());
  if (!local.equals(remote)) fail(`${label} does not match the candidate bytes`);
  requireHeader(response, "x-content-type-options", /^nosniff$/i, label);
  return response;
}

const rootResponse = await requireResponse(`${baseUrl}/`, "site root");
requireHeader(rootResponse, "content-security-policy", /default-src 'self'/i, "site root");
requireHeader(rootResponse, "strict-transport-security", /max-age=63072000/i, "site root");
requireHeader(rootResponse, "x-content-type-options", /^nosniff$/i, "site root");
requireHeader(rootResponse, "cache-control", /no-cache/i, "site root");

const manifestResponse = await requireExactArtifact("/r/manifest.json", "mutable registry manifest");
requireHeader(manifestResponse, "cache-control", /(max-age=0|no-cache).*(must-revalidate)?/i, "mutable registry manifest");

const buttonResponse = await requireExactArtifact(`/r/v/${version}/button.json`, "immutable button artifact");
requireHeader(buttonResponse, "cache-control", /max-age=31536000.*immutable/i, "immutable button artifact");
await requireExactArtifact("/llms.txt", "agent index");

const repoResponse = await requireResponse(`https://api.github.com/repos/${repository}`, "GitHub repository");
const repo = await repoResponse.json();
if (repo.private !== false || repo.archived === true) fail("GitHub repository is not a live public repository");

const releaseResponse = await request(`https://api.github.com/repos/${repository}/releases/tags/${tag}`);
let release = null;
if (releaseResponse.ok) {
  release = await releaseResponse.json();
  if (release.draft === true || release.prerelease !== true) fail(`${tag} must be a published prerelease`);
  if (release.target_commitish !== "main" && release.tag_name !== tag) fail(`${tag} release metadata is inconsistent`);
} else if (!allowUnpublished) {
  fail(`GitHub prerelease ${tag} returned ${releaseResponse.status}`);
}

const npmResponse = await request(`https://registry.npmjs.org/${encodeURIComponent(packageJson.name)}/${version}`);
let npm = null;
if (npmResponse.ok) {
  npm = await npmResponse.json();
  if (npm.version !== version) fail(`npm returned ${npm.version} instead of ${version}`);
} else if (npmResponse.status !== 404) {
  fail(`npm registry returned ${npmResponse.status}`);
}

const report = {
  schemaVersion: 1,
  generatedBy: "scripts/verify-public-beta.mjs",
  generatedAt: new Date().toISOString(),
  candidate: version,
  site: {
    url: baseUrl,
    status: "passed",
    securityHeaders: true,
  },
  registry: {
    manifest: `${baseUrl}/r/manifest.json`,
    immutableArtifact: `${baseUrl}/r/v/${version}/button.json`,
    exactCandidateBytes: true,
  },
  github: {
    repository: `https://github.com/${repository}`,
    public: true,
    release: release?.html_url ?? null,
    prerelease: release?.prerelease ?? false,
  },
  npm: {
    published: npm !== null,
    url: npm ? `https://www.npmjs.com/package/${packageJson.name}/v/${version}` : null,
  },
};

if (writeEvidence) {
  if (!release) fail("cannot record public-beta evidence before the GitHub prerelease exists");
  await writeFile(resolve(root, "release/public-beta-live.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log(`[public-beta] ${version}: site passed; registry bytes passed; GitHub release ${release ? "passed" : "open"}; npm ${npm ? "passed" : "open"}`);
