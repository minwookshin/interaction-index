import { execFile } from "node:child_process";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const fixture = await mkdtemp(join(tmpdir(), "teum-skill-consumer-"));
const executable = process.platform === "win32" ? resolve(root, "node_modules/.bin/skills.cmd") : resolve(root, "node_modules/.bin/skills");

try {
  await mkdir(resolve(fixture, "src"), { recursive: true });
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({ name: "teum-skill-consumer", private: true, version: "0.0.0" }, null, 2)}\n`);
  await writeFile(resolve(fixture, "components.json"), `${JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    aliases: { components: "components", utils: "lib/utils", ui: "components/ui", lib: "lib", hooks: "hooks" },
  }, null, 2)}\n`);
  await exec("git", ["init", "-q"], { cwd: fixture });
  await exec(executable, ["add", root, "--skill", "teum", "--agent", "universal", "--copy", "--yes"], {
    cwd: fixture,
    env: { ...process.env, CI: "1", NO_COLOR: "1" },
    maxBuffer: 16 * 1024 * 1024,
    timeout: 120_000,
  });

  const installed = resolve(fixture, ".agents/skills/teum");
  for (const path of ["SKILL.md", "agents/openai.yaml", "references/catalog.json", "references/selection.md", "references/quality.md", "scripts/context.mjs"]) {
    await access(resolve(installed, path)).catch(() => { throw new Error(`[teum-skill] copied installation omitted ${path}`); });
  }
  const skill = await readFile(resolve(installed, "SKILL.md"), "utf8");
  if (!skill.startsWith("---\n") || !skill.includes("name: teum") || !skill.includes("description:")) {
    throw new Error("[teum-skill] SKILL.md frontmatter is incomplete");
  }
  const context = await exec(process.execPath, [resolve(installed, "scripts/context.mjs"), "--project", fixture, "--task", "Build billing usage with invoices and a reviewed subscription change"], {
    cwd: fixture,
    maxBuffer: 8 * 1024 * 1024,
    timeout: 30_000,
  });
  const plan = JSON.parse(context.stdout);
  if (plan.match?.id !== "billing-usage") throw new Error(`[teum-skill] context selected ${plan.match?.id ?? "nothing"} instead of billing-usage`);
  if (!plan.commands?.install?.includes("@teum-pinned/teum-product-patterns")) throw new Error("[teum-skill] context omitted the pinned product-pattern install");
  if (!plan.match.forbidden?.length || !plan.match.rules?.length) throw new Error("[teum-skill] context omitted composition boundaries");
  console.log("[teum-skill] validated the package, copied it into a clean project, and produced a pinned billing-usage plan");
} finally {
  if (!process.env.TEUM_KEEP_FIXTURE) await rm(fixture, { recursive: true, force: true });
}
