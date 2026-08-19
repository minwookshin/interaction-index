import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import packageManifest from "../../package.json";
import { publicLibraryItems } from "../component-catalog";
import { getComponentInstallCommand } from "./component-install-command";

describe("component install copy contract", () => {
  it("points every public Library copy action at its exact versioned registry item", () => {
    expect(publicLibraryItems).toHaveLength(74);

    for (const component of publicLibraryItems) {
      const expectedArtifact = `${packageManifest.homepage}/r/v/${packageManifest.version}/${component.id}.json`;
      expect(getComponentInstallCommand(component.id)).toBe(
        `npx shadcn@${packageManifest.devDependencies.shadcn} add ${expectedArtifact}`,
      );

      const artifactPath = resolve(`public/r/v/${packageManifest.version}/${component.id}.json`);
      expect(existsSync(artifactPath), `${component.id} registry artifact`).toBe(true);
      const artifact = JSON.parse(readFileSync(artifactPath, "utf8")) as { name?: string; files?: unknown[] };
      expect(artifact.name).toBe(component.id);
      expect(artifact.files?.length ?? 0).toBeGreaterThan(0);

      const reactSourcePath = resolve(`registry/components/ui/${component.id}.tsx`);
      const cssSourcePath = resolve(`registry/styles/components/${component.id}.css`);
      expect(existsSync(reactSourcePath), `${component.id} React source`).toBe(true);
      expect(existsSync(cssSourcePath), `${component.id} CSS source`).toBe(true);
      expect(readFileSync(reactSourcePath, "utf8").trim().length).toBeGreaterThan(0);
      expect(readFileSync(cssSourcePath, "utf8").trim().length).toBeGreaterThan(0);
    }
  });
});
