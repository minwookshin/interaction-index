import packageManifest from "../../package.json";

export function getComponentInstallCommand(id: string) {
  return `npx shadcn@${packageManifest.devDependencies.shadcn} add ${packageManifest.homepage}/r/v/${packageManifest.version}/${id}.json`;
}
