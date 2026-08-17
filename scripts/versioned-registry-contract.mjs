import { createHash } from "node:crypto";

export const mutableRegistryScope = "@teum";
export const pinnedRegistryScope = "@teum-pinned";

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const integrity256 = (value) => `sha256-${createHash("sha256").update(value).digest("base64")}`;
export const serializeJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

export function dependencyName(specifier) {
  const separator = specifier.startsWith("@")
    ? specifier.indexOf("@", specifier.indexOf("/") + 1)
    : specifier.indexOf("@");
  return separator === -1 ? specifier : specifier.slice(0, separator);
}

export function dependencyVersionsFromLockfile(lockfile) {
  const versions = new Map();
  for (const [path, entry] of Object.entries(lockfile.packages ?? {})) {
    if (!path.startsWith("node_modules/") || !entry?.version) continue;
    const name = path.slice("node_modules/".length);
    if (!name.includes("/node_modules/")) versions.set(name, entry.version);
  }
  return versions;
}

export function exactDependencySpecifier(specifier, versions) {
  const name = dependencyName(specifier);
  const version = versions.get(name);
  if (!version) throw new Error(`versioned registry dependency ${name} is absent from package-lock.json`);
  return `${name}@${version}`;
}

export function exactDependencyVersionsFromRegistry(value, versions = new Map()) {
  if (Array.isArray(value)) {
    for (const entry of value) exactDependencyVersionsFromRegistry(entry, versions);
    return versions;
  }
  if (!value || typeof value !== "object") return versions;
  for (const [key, entry] of Object.entries(value)) {
    if (key === "dependencies" && Array.isArray(entry)) {
      for (const dependency of entry) {
        const name = dependencyName(dependency);
        const version = dependency.slice(name.length + 1);
        if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
          throw new Error(`versioned registry dependency is not exact: ${dependency}`);
        }
        versions.set(name, version);
      }
    } else {
      exactDependencyVersionsFromRegistry(entry, versions);
    }
  }
  return versions;
}

export function rewritePinnedRegistryDependencies(value, dependencyVersions) {
  if (Array.isArray(value)) return value.map((entry) => rewritePinnedRegistryDependencies(entry, dependencyVersions));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
    if (key === "dependencies" && Array.isArray(entry)) {
      return [key, entry.map((dependency) => exactDependencySpecifier(dependency, dependencyVersions))];
    }
    if (key === "registryDependencies" && Array.isArray(entry)) {
      return [key, entry.map((dependency) => {
        if (typeof dependency !== "string" || !dependency.startsWith(`${mutableRegistryScope}/`)) return dependency;
        return `${pinnedRegistryScope}/${dependency.slice(`${mutableRegistryScope}/`.length)}`;
      })];
    }
    return [key, rewritePinnedRegistryDependencies(entry, dependencyVersions)];
  }));
}

export function createVersionedArtifactSources(mutableSources, { dependencyVersions, installerVersion }) {
  const mutableManifestSource = mutableSources.get("manifest.json");
  if (!mutableManifestSource) throw new Error("mutable registry manifest is missing");
  if (!(dependencyVersions instanceof Map) || dependencyVersions.size === 0) {
    throw new Error("versioned registry dependency lock is missing");
  }
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(installerVersion)) {
    throw new Error(`versioned registry installer must be exact: ${installerVersion}`);
  }

  const versionedSources = new Map();
  for (const [name, source] of mutableSources) {
    if (name === "manifest.json") continue;
    versionedSources.set(name, serializeJson(rewritePinnedRegistryDependencies(JSON.parse(source), dependencyVersions)));
  }
  const exactExternalVersions = exactDependencyVersionsFromRegistry(JSON.parse(versionedSources.get("registry.json")));

  const manifest = JSON.parse(mutableManifestSource);
  const version = manifest.version;
  manifest.distribution.immutableRegistry.registryScope = pinnedRegistryScope;
  manifest.distribution.immutableRegistry.dependencyPolicy = "same-version-internal-and-exact-external";
  manifest.distribution.immutableRegistry.installer = `shadcn@${installerVersion}`;
  manifest.versionedFrom = {
    mutableManifestSha256: sha256(mutableManifestSource),
    dependencyScopeRewrite: `${mutableRegistryScope}/* -> ${pinnedRegistryScope}/*`,
    installer: `shadcn@${installerVersion}`,
    externalDependencyVersions: Object.fromEntries([...exactExternalVersions].sort(([a], [b]) => a.localeCompare(b))),
  };

  for (const [name, artifact] of Object.entries(manifest.artifacts ?? {})) {
    const source = versionedSources.get(`${name}.json`);
    if (!source) throw new Error(`versioned registry artifact ${name}.json is missing`);
    artifact.path = `public/r/v/${version}/${name}.json`;
    artifact.bytes = Buffer.byteLength(source);
    artifact.sha256 = sha256(source);
    artifact.integrity = integrity256(source);
  }

  versionedSources.set("manifest.json", serializeJson(manifest));
  return versionedSources;
}
