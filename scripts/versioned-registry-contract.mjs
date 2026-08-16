import { createHash } from "node:crypto";

export const mutableRegistryScope = "@teum";
export const pinnedRegistryScope = "@teum-pinned";

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const integrity256 = (value) => `sha256-${createHash("sha256").update(value).digest("base64")}`;
export const serializeJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

export function rewritePinnedRegistryDependencies(value) {
  if (Array.isArray(value)) return value.map((entry) => rewritePinnedRegistryDependencies(entry));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
    if (key === "registryDependencies" && Array.isArray(entry)) {
      return [key, entry.map((dependency) => {
        if (typeof dependency !== "string" || !dependency.startsWith(`${mutableRegistryScope}/`)) return dependency;
        return `${pinnedRegistryScope}/${dependency.slice(`${mutableRegistryScope}/`.length)}`;
      })];
    }
    return [key, rewritePinnedRegistryDependencies(entry)];
  }));
}

export function createVersionedArtifactSources(mutableSources) {
  const mutableManifestSource = mutableSources.get("manifest.json");
  if (!mutableManifestSource) throw new Error("mutable registry manifest is missing");

  const versionedSources = new Map();
  for (const [name, source] of mutableSources) {
    if (name === "manifest.json") continue;
    versionedSources.set(name, serializeJson(rewritePinnedRegistryDependencies(JSON.parse(source))));
  }

  const manifest = JSON.parse(mutableManifestSource);
  const version = manifest.version;
  manifest.distribution.immutableRegistry.registryScope = pinnedRegistryScope;
  manifest.distribution.immutableRegistry.dependencyPolicy = "same-version-pinned";
  manifest.versionedFrom = {
    mutableManifestSha256: sha256(mutableManifestSource),
    dependencyScopeRewrite: `${mutableRegistryScope}/* -> ${pinnedRegistryScope}/*`,
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
