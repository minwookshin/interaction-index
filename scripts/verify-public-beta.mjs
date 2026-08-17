import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const allowUnpublished = process.argv.includes("--allow-unpublished");
const writeEvidence = process.argv.includes("--write-evidence");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const publication = JSON.parse(await readFile(resolve(root, "publication.json"), "utf8"));
const recordedLiveEvidence = await readFile(resolve(root, "release/public-beta-live.json"), "utf8")
  .then((value) => JSON.parse(value))
  .catch(() => null);
const version = packageJson.version;
const tag = `v${version}`;
const baseUrl = (process.env.TEUM_PUBLIC_BETA_URL ?? publication.homepage).replace(/\/$/, "");
const repository = publication.repository;
const fail = (message) => { throw new Error(`[public-beta] ${message}`); };
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

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
let releaseAssetsVerified = false;
let releaseAssetDigests = {};
if (releaseResponse.ok) {
  release = await releaseResponse.json();
  if (release.draft === true || release.prerelease !== true) fail(`${tag} must be a published prerelease`);
  if (release.target_commitish !== "main" && release.tag_name !== tag) fail(`${tag} release metadata is inconsistent`);

  const tarballName = `${packageJson.name}-${version}.tgz`;
  const requiredAssets = ["SHA256SUMS", "public-package.json", "sbom.cdx.json", tarballName].sort();
  const assets = new Map((release.assets ?? []).map((asset) => [asset.name, asset]));
  if (JSON.stringify([...assets.keys()].sort()) !== JSON.stringify(requiredAssets)) {
    fail(`${tag} release asset inventory is not exact`);
  }

  const checksumAsset = assets.get("SHA256SUMS");
  const checksumResponse = await requireResponse(checksumAsset.browser_download_url, "release checksums");
  const checksumBytes = Buffer.from(await checksumResponse.arrayBuffer());
  const checksumDigest = sha256(checksumBytes);
  if (checksumAsset.digest !== `sha256:${checksumDigest}`) fail("release checksum asset digest does not match GitHub metadata");
  const checksums = new Map(checksumBytes.toString("utf8").trim().split("\n").map((line) => {
    const match = line.match(/^([a-f0-9]{64})  ([^/]+)$/);
    if (!match) fail(`invalid release checksum line: ${line}`);
    return [match[2], match[1]];
  }));

  const payloadNames = ["public-package.json", "sbom.cdx.json", tarballName].sort();
  if (JSON.stringify([...checksums.keys()].sort()) !== JSON.stringify(payloadNames)) fail("release checksum inventory is not exact");
  const downloaded = new Map();
  releaseAssetDigests = { SHA256SUMS: checksumDigest };
  for (const name of payloadNames) {
    const asset = assets.get(name);
    const assetResponse = await requireResponse(asset.browser_download_url, `release asset ${name}`);
    const bytes = Buffer.from(await assetResponse.arrayBuffer());
    const digest = sha256(bytes);
    if (checksums.get(name) !== digest || asset.digest !== `sha256:${digest}`) fail(`release asset digest mismatch: ${name}`);
    downloaded.set(name, bytes);
    releaseAssetDigests[name] = digest;
  }

  const candidate = JSON.parse(downloaded.get("public-package.json").toString("utf8"));
  if (candidate.status !== "publishable-beta-candidate" || candidate.version !== version || candidate.distTag !== "beta") {
    fail("release package candidate metadata is inconsistent");
  }
  if (candidate.package?.file !== tarballName || candidate.package?.sha256 !== releaseAssetDigests[tarballName]) {
    fail("release package candidate does not name the verified tarball");
  }
  const pinnedDigests = recordedLiveEvidence?.candidate === version && recordedLiveEvidence.github?.assetsVerified
    ? recordedLiveEvidence.github.assetDigests
    : null;
  if (pinnedDigests && JSON.stringify(pinnedDigests) !== JSON.stringify(releaseAssetDigests)) {
    fail(`${tag} release assets changed after their first verified publication`);
  }
  releaseAssetsVerified = true;
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
    assetsVerified: releaseAssetsVerified,
    assetDigests: releaseAssetDigests,
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
