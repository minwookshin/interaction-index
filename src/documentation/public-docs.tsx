import { CaretRight, Check, Copy, ShieldCheck } from "@phosphor-icons/react";
import { lazy, Suspense, useState, type ReactNode } from "react";
import packageManifest from "../../package.json";
import packageContractEvidence from "../../release/package-contract.json";
import accessibilityEvidence from "../../release/accessibility.json";
import agentEvaluation from "../../release/agent-evaluation.json";
import nextQuickstartManifest from "../../examples/quickstart-next/package.json";
import { componentMaturity, maturityDefinitions, readyCriteria } from "../component-maturity";
import { copyText } from "../lib/copy-text";
import {
  teumDataComponentContracts,
  teumDataRecipeContracts,
  teumDataViewStateContract,
} from "../lib/teum-data-contract";
import {
  teumAnalyticsComponentContracts,
  teumAnalyticsRecipeContracts,
  teumAnalyticsStateContract,
} from "../lib/teum-analytics-contract";
import {
  teumProductPatternContracts,
  teumProductPatternSystemContract,
} from "../lib/teum-product-patterns-contract";
import {
  teumAgentForbiddenRules,
  teumAgentRecipeContracts,
  teumAgentSelectionRules,
  teumAgentSystemContract,
} from "../lib/teum-agent-contract";
import { publicDocItems, type PublicDocId } from "./public-doc-metadata";

const ProductPilot = lazy(() => import("./product-pilot").then((module) => ({ default: module.ProductPilot })));
const CustomerDirectoryRecipe = lazy(() => import("./data-recipes").then((module) => ({ default: module.CustomerDirectoryRecipe })));
const AuditLogRecipe = lazy(() => import("./data-recipes").then((module) => ({ default: module.AuditLogRecipe })));
const SaaSOverviewRecipe = lazy(() => import("./analytics-recipes").then((module) => ({ default: module.SaaSOverviewRecipe })));
const ProductUsageRecipe = lazy(() => import("./analytics-recipes").then((module) => ({ default: module.ProductUsageRecipe })));
const ConversionRetentionRecipe = lazy(() => import("./analytics-recipes").then((module) => ({ default: module.ConversionRetentionRecipe })));
const AnalyticsRendererGallery = lazy(() => import("./analytics-recipes").then((module) => ({ default: module.AnalyticsRendererGallery })));
const CustomerWorkspaceRecipe = lazy(() => import("./product-pattern-recipes").then((module) => ({ default: module.CustomerWorkspaceRecipe })));
const BillingUsageRecipe = lazy(() => import("./product-pattern-recipes").then((module) => ({ default: module.BillingUsageRecipe })));
const MembersPermissionsRecipe = lazy(() => import("./product-pattern-recipes").then((module) => ({ default: module.MembersPermissionsRecipe })));
const shadcnCli = `shadcn@${packageManifest.devDependencies.shadcn}`;

function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="public-doc-section" id={id}><h2>{title}</h2>{children}</section>;
}

function CodeBlock({ label, children, collapsed = false }: { label: string; children: string; collapsed?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(!collapsed);
  const copy = () => void copyText(children).then((result) => {
    setCopied(result);
    window.setTimeout(() => setCopied(false), 1200);
  });
  return <figure className="public-doc-code" data-collapsed={!open || undefined}><figcaption><button className="public-doc-code__toggle" type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}><CaretRight aria-hidden="true" />{label}</button><button className="public-doc-code__copy" type="button" title={copied ? "Copied" : "Copy code"} onClick={copy} aria-label={copied ? `${label} copied` : `Copy ${label}`}>{copied ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}</button></figcaption>{open && <pre tabIndex={0}><code>{children}</code></pre>}</figure>;
}

function CheckList({ items }: { items: readonly string[] }) {
  return <ul className="public-doc-checks">{items.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

function StatusTable({ label, rows, columns = ["Target", "Level", "Evidence"] }: { label: string; rows: readonly (readonly [string, string, string])[]; columns?: readonly [string, string, string] }) {
  return <div className="public-doc-table-wrap" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map(([target, level, evidence]) => <tr key={target}><th scope="row">{target}</th><td>{level}</td><td>{evidence}</td></tr>)}</tbody></table></div>;
}

function MaturityTable() {
  return <div className="public-doc-table-wrap public-doc-maturity-table" role="region" aria-label="Component maturity matrix scroll area" tabIndex={0}>
    <table aria-label="Component maturity matrix">
      <thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Verified evidence</th><th scope="col">Next gate</th></tr></thead>
      <tbody>{componentMaturity.map((component) => <tr key={component.id}><th scope="row">{component.name}</th><td><span className="maturity-status" data-status={component.status.toLocaleLowerCase()}>{component.status}</span></td><td>{component.evidence}</td><td>{component.nextGate}</td></tr>)}</tbody>
    </table>
  </div>;
}

function DecisionTable({ label, rows }: { label: string; rows: readonly (readonly [string, string, string])[] }) {
  return <div className="public-doc-table-wrap public-doc-decision-table" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr><th scope="col">User need</th><th scope="col">Choose</th><th scope="col">Do not use it when</th></tr></thead><tbody>{rows.map(([need, choice, boundary]) => <tr key={need}><th scope="row">{need}</th><td><strong>{choice}</strong></td><td>{boundary}</td></tr>)}</tbody></table></div>;
}

function ProductPilotPage() {
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="data-workspace" aria-labelledby="data-workspace-title"><h2 id="data-workspace-title">Issues Workspace</h2><p>Search, inspect, act, and undo.</p><Suspense fallback={<div className="pilot-workspace pilot-workspace--loading" role="status">Loading Issues Workspace…</div>}><ProductPilot /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="customer-directory" aria-labelledby="customer-directory-title"><h2 id="customer-directory-title">Customer Directory</h2><p>Saved views, filters, columns, and export.</p><Suspense fallback={<div className="teum-data-recipe teum-data-recipe--loading" role="status">Loading Customer Directory…</div>}><CustomerDirectoryRecipe /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="audit-log" aria-labelledby="audit-log-title"><h2 id="audit-log-title">Audit Log</h2><p>Virtualized events with search and date filters.</p><Suspense fallback={<div className="teum-data-recipe teum-data-recipe--loading" role="status">Loading Audit Log…</div>}><AuditLogRecipe /></Suspense></section>
    <DocSection id="data-layer" title="Product primitives">
      <StatusTable
        label="whatiuse Data product primitives"
        columns={["Primitive", "Job", "States"]}
        rows={teumDataComponentContracts.map((component) => [component.id, component.intent, component.states.join(", ")] as const)}
      />
    </DocSection>
    <DocSection id="data-contract" title="Composition contract">
      <p>URL, server, saved-view, and display state share one model.</p>
      <CodeBlock label="data-view-state.contract.json" collapsed>{JSON.stringify(teumDataViewStateContract, null, 2)}</CodeBlock>
      <CodeBlock label="data-recipes.contract.json" collapsed>{JSON.stringify(teumDataRecipeContracts, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="data-install" title="Install the vertical slice">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @teum-pinned/teum-data`}</CodeBlock>
      <p>Installs the Data components, recipes, styles, and contracts. Pre-release.</p>
    </DocSection>
  </>;
}

function AnalyticsPage() {
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="renderer-family" aria-labelledby="renderer-family-title"><h2 id="renderer-family-title">Primitives</h2><p>Charts and metrics share one visual contract.</p><Suspense fallback={<div className="teum-analytics-gallery" role="status">Loading analytics primitives…</div>}><AnalyticsRendererGallery /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="saas-overview" aria-labelledby="saas-overview-title"><h2 id="saas-overview-title">SaaS Overview</h2><p>Revenue, retention, targets, and expansion in one period.</p><Suspense fallback={<div className="teum-analytics-recipe" role="status">Loading SaaS Overview…</div>}><SaaSOverviewRecipe /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="product-usage" aria-labelledby="product-usage-title"><h2 id="product-usage-title">Product Usage</h2><p>Usage and releases with independent chart inspection.</p><Suspense fallback={<div className="teum-analytics-recipe" role="status">Loading Product Usage…</div>}><ProductUsageRecipe /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="conversion-retention" aria-labelledby="conversion-retention-title"><h2 id="conversion-retention-title">Conversion &amp; Retention</h2><p>A selected funnel stage updates the trend, cohort context, and supporting records.</p><Suspense fallback={<div className="teum-analytics-recipe" role="status">Loading Conversion &amp; Retention…</div>}><ConversionRetentionRecipe /></Suspense></section>
    <DocSection id="analytics-layer" title="Product primitives">
      <StatusTable label="whatiuse Analytics product primitives" columns={["Primitive", "Job", "States"]} rows={teumAnalyticsComponentContracts.map((component) => [component.id, component.intent, component.states.join(", ")] as const)} />
    </DocSection>
    <DocSection id="analytics-contract" title="Composition contract">
      <p>Product state remains controlled by the recipe. Transient inspection stays local to each chart.</p>
      <CodeBlock label="analytics-state.contract.json" collapsed>{JSON.stringify(teumAnalyticsStateContract, null, 2)}</CodeBlock>
      <CodeBlock label="analytics-recipes.contract.json" collapsed>{JSON.stringify(teumAnalyticsRecipeContracts, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="analytics-install" title="Install the vertical slice">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @teum-pinned/teum-analytics`}</CodeBlock>
      <p>Installs the Analytics components, recipes, styles, and contracts. Pre-release.</p>
    </DocSection>
  </>;
}

function ProductPatternsPage() {
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="customer-workspace" aria-labelledby="customer-workspace-title"><h2 id="customer-workspace-title">Customer Workspace</h2><p>Find an account, inspect health, and finish a follow-up without losing the list.</p><Suspense fallback={<div className="teum-product-pattern" role="status">Loading Customer Workspace…</div>}><CustomerWorkspaceRecipe /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="billing-usage" aria-labelledby="billing-usage-title"><h2 id="billing-usage-title">Billing &amp; Usage</h2><p>Plan, spend, limits, usage, and invoices share one billing period.</p><Suspense fallback={<div className="teum-product-pattern" role="status">Loading Billing &amp; Usage…</div>}><BillingUsageRecipe /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="members-permissions" aria-labelledby="members-permissions-title"><h2 id="members-permissions-title">Members &amp; Permissions</h2><p>Membership, invitations, roles, and access policy stay in one task.</p><Suspense fallback={<div className="teum-product-pattern" role="status">Loading Members &amp; Permissions…</div>}><MembersPermissionsRecipe /></Suspense></section>
    <DocSection id="product-pattern-contract" title="Composition contract">
      <p>Each pattern names its task, state ownership, failure states, and accessibility boundaries.</p>
      <CodeBlock label="product-patterns.contract.json">{JSON.stringify(teumProductPatternContracts, null, 2)}</CodeBlock>
      <CodeBlock label="product-pattern-system.contract.json">{JSON.stringify(teumProductPatternSystemContract, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="product-pattern-install" title="Install the product patterns">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @teum-pinned/teum-product-patterns`}</CodeBlock>
      <p>The block installs the three source-owned B2B recipes and their composition contract. It remains pre-release.</p>
    </DocSection>
  </>;
}

function AgentNativePage() {
  return <>
    <DocSection id="agent-contract" title="One contract for people and agents">
      <p>The generated catalog records every installable item, product recipe, selection boundary, and forbidden rule. Registry metadata, the agent skill, and this page use the same source.</p>
      <CodeBlock label="teum-agent.json">{`${packageManifest.homepage}/agent/teum-agent.json`}</CodeBlock>
      <CodeBlock label="system.contract.json">{JSON.stringify(teumAgentSystemContract, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="selection-rules" title="Choose by task boundary">
      <StatusTable label="Agent selection rules" columns={["Task", "Choose", "Reject when"]} rows={teumAgentSelectionRules.map((rule) => [rule.task, rule.choose, rule.rejectWhen.join(" ")] as const)} />
    </DocSection>
    <DocSection id="composition-rules" title="Start from a complete recipe">
      <p>Nine recipes connect product intent to public exports, required state, and composition rules. Agents should select one recipe before adding individual components.</p>
      <StatusTable label="Agent product recipes" columns={["Recipe", "Registry item", "Composition"]} rows={teumAgentRecipeContracts.map((recipe) => [recipe.title, `@teum-pinned/${recipe.registryItem}`, recipe.components.join(", ")] as const)} />
    </DocSection>
    <DocSection id="forbidden-rules" title="Reject invalid shortcuts">
      <CheckList items={teumAgentForbiddenRules} />
    </DocSection>
    <DocSection id="skill-install" title="Install the agent skill">
      <CodeBlock label="Project skill">{`npx skills add minwookshin/whatiuse --skill teum --copy --yes`}</CodeBlock>
      <p>The skill inspects the project, selects a documented recipe, installs source through the pinned registry, and runs the product's own quality gates. Review installed skills before use.</p>
    </DocSection>
    <DocSection id="agent-evaluation" title="Deterministic product-task evaluation">
      <StatusTable label="Agent evaluation evidence" rows={[["Recipe selection", `${agentEvaluation.selectedCorrectly} / ${agentEvaluation.taskCount}`, "Thirty fixed B2B product requests"], ["Clean install and build", agentEvaluation.productionBuild, agentEvaluation.scope], ["Contract violations", String(agentEvaluation.contractViolations), "Required and forbidden component checks"]]} />
      <p>This is repository-owned contract evidence, not a benchmark of external models or proof of production adoption.</p>
    </DocSection>
  </>;
}

function ComponentStatus() {
  return <>
    <DocSection id="status-model" title="Maturity is a support promise">
      <p>Status describes whether a component is safe to depend on, not how polished its screenshot looks. whatiuse follows the public Experimental, Ready, and Deprecated model while keeping every current component honest at Experimental during private alpha.</p>
      <StatusTable label="Maturity definitions" rows={maturityDefinitions.map((item) => [item.status, item.meaning, item.releaseContract] as const)} />
    </DocSection>
    <DocSection id="promotion-gate" title="Ready requires the whole evidence chain">
      <CheckList items={readyCriteria} />
    </DocSection>
    <DocSection id="current-matrix" title={`All ${componentMaturity.length} components remain Experimental`}>
      <p>The matrix separates what the repository verifies today from the external evidence still missing. Passing internal tests is necessary, but it is not independent adoption or production readiness.</p>
      <MaturityTable />
    </DocSection>
    <DocSection id="migration-contract" title="Changes keep a visible way forward">
      <CheckList items={["Breaking alpha changes name every affected component, prop, token, and behavior in the changelog.", "A migration note shows the previous form, replacement form, and the last version that accepted the old contract.", "Deprecated components name a replacement, emit a consumer-visible warning when practical, and keep a defined removal window.", "A Ready component cannot return to Experimental silently; a major version and migration path are required."]} />
    </DocSection>
  </>;
}

function Installation() {
  const pinnedRegistry = `${packageManifest.homepage}/r/v/${packageManifest.version}/{name}.json`;
  const viteConfig = JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" },
    iconLibrary: "lucide",
    aliases: { components: "components", utils: "lib/utils", ui: "components/ui", lib: "lib", hooks: "hooks" },
    registries: { "@teum-pinned": pinnedRegistry },
  }, null, 2);
  const nextConfig = JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: { config: "", css: "src/app/globals.css", baseColor: "neutral", cssVariables: true, prefix: "" },
    iconLibrary: "lucide",
    aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" },
    registries: { "@teum-pinned": pinnedRegistry },
  }, null, 2);
  return <>
    <DocSection id="quickstart" title="Choose a path">
      <p>Install one source-owned Button, change one semantic token, then build the product. Start with the framework already in use.</p>
      <CheckList items={[
        "Vite — React 18 and 19, plain CSS, and the optional Tailwind CSS v4 bridge.",
        `Next.js ${nextQuickstartManifest.dependencies.next} — App Router with one explicit client boundary for interaction.`,
        "Registry update — dry-run and file diff keep local source unchanged until explicit acceptance.",
      ]} />
    </DocSection>
    <DocSection id="vite" title="Vite">
      <CodeBlock label="1 · Create or open a React + TypeScript app">npm create vite@latest whatiuse-app -- --template react-ts</CodeBlock>
      <CodeBlock label="2 · Add components.json">{viteConfig}</CodeBlock>
      <CodeBlock label="3 · Install Button">{`npx ${shadcnCli} add @teum-pinned/button`}</CodeBlock>
      <CodeBlock label="4 · Render it">{'import { Button } from "./components/ui/button";\n\nexport function App() {\n  return <Button variant="primary">Create issue</Button>;\n}'}</CodeBlock>
      <p>The verified fixture lives in <code>examples/quickstart-vite</code>. It builds against React 18 and React 19 without a Tailwind runtime.</p>
    </DocSection>
    <DocSection id="next" title="Next.js App Router">
      <CodeBlock label="1 · Create or open an App Router project">{`npx create-next-app@${nextQuickstartManifest.dependencies.next} whatiuse-app --ts --app --src-dir --use-npm --empty --no-tailwind --yes`}</CodeBlock>
      <CodeBlock label="2 · Add components.json">{nextConfig}</CodeBlock>
      <CodeBlock label="3 · Install Button">{`npx ${shadcnCli} add @teum-pinned/button`}</CodeBlock>
      <CodeBlock label="4 · Keep interaction behind a client boundary">{'"use client";\n\nimport { Button } from "@/components/ui/button";\n\nexport function CreateIssue() {\n  return <Button variant="primary">Create issue</Button>;\n}'}</CodeBlock>
      <p>Import <code>src/app/globals.css</code> once from the root layout. The layout and page stay Server Components; only interactive compositions need <code>"use client"</code>.</p>
    </DocSection>
    <DocSection id="theme" title="Theme and customize">
      <CodeBlock label="Switch the public theme contract">document.documentElement.dataset.theme = "dark";</CodeBlock>
      <CodeBlock label="Override one semantic role in product CSS">{':root {\n  --teum-radius-control: 9px;\n}'}</CodeBlock>
      <p>Light is the default. Product CSS is unlayered and therefore overrides whatiuse's <code>teum.tokens → teum.base → teum.components</code> cascade without selector escalation. Use <code>--teum-*</code> roles instead of copying raw graphite values.</p>
    </DocSection>
    <DocSection id="registry" title="Pin what enters the product">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} registry add @teum-pinned=${pinnedRegistry}\nnpx ${shadcnCli} view @teum-pinned/button\nnpx ${shadcnCli} add @teum-pinned/button`}</CodeBlock>
      <p>The registry copies source, scoped CSS, shared tokens, utilities, and declared dependencies into the product. Review and own those files. Use the mutable <code>@teum</code> channel only for active pre-release evaluation.</p>
    </DocSection>
    <DocSection id="update" title="Review before overwrite">
      <CodeBlock label="Inspect the next pinned candidate">{`npx ${shadcnCli} add @teum-pinned/button --dry-run\nnpx ${shadcnCli} add @teum-pinned/button --diff src/components/ui/button.tsx`}</CodeBlock>
      <CodeBlock label="Accept only after review">{`npx ${shadcnCli} add @teum-pinned/button --overwrite --yes\nnpm run typecheck\nnpm run build`}</CodeBlock>
      <p>Commit local edits first. Dry-run and diff never write; overwrite is the explicit acceptance step. The previous pinned path remains the rollback boundary.</p>
    </DocSection>
    <DocSection id="migrate" title="Migrate deliberately">
      <CheckList items={["Read CHANGELOG.md and MIGRATIONS.md for every version between the current and target candidate.", "Review props, tokens, dependencies, behavior, and CSS together; copied source may contain local edits.", "Use a codemod only when the migration note names one; do not run unrelated shadcn migrations by default.", "Keep the previous pinned registry URL and the pre-update commit until product checks pass."]} />
    </DocSection>
    <DocSection id="troubleshooting" title="Common failures">
      <StatusTable label="Installation troubleshooting" columns={["Symptom", "Cause", "Fix"]} rows={[
        ["@teum-pinned cannot resolve", "The registry entry is absent or points to a different candidate", "Copy the pinned registries block into components.json and run view before add"],
        ["Button has no whatiuse styles", "A generated CSS import was removed or moved", "Restore teum-base.css and the component stylesheet beside the copied source"],
        ["Next.js reports a client boundary error", "An interactive component was rendered through an invalid Server Component boundary", "Move the interactive composition into a small file with an explicit use client directive"],
        ["Update would replace local edits", "Copied source differs from the candidate", "Commit, dry-run, inspect the exact file diff, then overwrite only after acceptance"],
      ]} />
      <p>The npm package remains unpublished. Registry source is the supported evaluation path for this candidate.</p>
    </DocSection>
  </>;
}

function ChoosingComponents() {
  return <>
    <DocSection id="selection" title="Choose by the value being changed">
      <p>Controls that look similar can carry different data, timing, and comparison contracts. Keep them separate so product intent remains visible in code and behavior.</p>
      <DecisionTable label="Selection component decisions" rows={[
        ["Choose one short, predefined form value", "Select", "Filtering is needed or the surrounding product context changes"],
        ["Filter a large, predefined collection", "Combobox", "Free-form text is a valid submitted value"],
        ["Change workspace, platform, or environment context", "Context Switcher", "The value is an ordinary form field"],
        ["Compare a small set of form choices", "Radio Group", "Space is constrained or the set is long"],
        ["Switch between two to four immediate peer modes", "Segmented Control", "Options need descriptions or submit later"],
      ]} />
    </DocSection>
    <DocSection id="temporary-surfaces" title="Choose by focus and task size">
      <DecisionTable label="Temporary surface decisions" rows={[
        ["Explain one otherwise understandable control", "Tooltip", "Content is required or interactive"],
        ["Expose a compact contextual action set", "Menu", "Actions need search, grouping, and keyboard-first discovery"],
        ["Search and run many cross-product actions", "Action List", "The set is a small anchored menu"],
        ["Keep a few controls beside their origin", "Popover", "The task needs full attention or a long form"],
        ["Complete a short, reversible focused task", "Dialog", "An explicit consequential response is required"],
        ["Confirm an irreversible or consequential decision", "Alert Dialog", "The action is safely reversible without interruption"],
      ]} />
    </DocSection>
    <DocSection id="feedback-recovery" title="Separate information from recovery">
      <DecisionTable label="Feedback and recovery decisions" rows={[
        ["Explain a field-specific problem", "Field error", "The message applies to the whole task"],
        ["Keep important contextual status visible", "Alert", "The outcome is transient and secondary"],
        ["Confirm a brief non-blocking outcome", "Toast", "The user must respond before continuing"],
        ["Reverse one or more reliable mutations", "Undo Stack", "The inverse is unsafe, lossy, or unavailable"],
      ]} />
    </DocSection>
    <DocSection id="decision-rule" title="Do not merge by shape"><div className="public-doc-callout"><ShieldCheck aria-hidden="true" /><div><strong>Task, focus, and recovery are the boundary</strong><p>If two components share a trigger or floating rectangle but change different kinds of state, move focus differently, or promise different recovery, they remain separate components with shared visual tokens.</p></div></div></DocSection>
  </>;
}

function Accessibility() {
  return <>
    <DocSection id="baseline-contract" title="Baseline contract"><CheckList items={["Semantic HTML, Base UI, and React Aria primitives provide the starting behavior.", "Every public view owns one main landmark and one page heading.", "Every icon-only control requires an accessible name.", "Disabled, validation, loading, empty, and recovery states remain perceivable.", "Automated checks support manual review. They never replace it."]} /></DocSection>
    <DocSection id="keyboard-focus" title="Keyboard and focus"><p>Keyboard input must complete the same task as pointer input. Skip links bypass repeated product chrome, in-app route changes announce the selected document without stealing desktop focus, and compact navigation hands focus to the document after its drawer closes. Focus returns to the initiating control after dismissal and never gets trapped outside a modal contract.</p></DocSection>
    <DocSection id="motion-contrast" title="Motion and contrast"><p>Reduced motion removes spatial travel while preserving state feedback. Light, dark, increased-contrast, and forced-color modes keep structure and meaning without depending on a brand accent.</p></DocSection>
    <DocSection id="manual-review" title="Evidence matrix"><StatusTable label="Accessibility release review" rows={[[`${accessibilityEvidence.routes.public} public routes`, "Automated gate", `${accessibilityEvidence.passed} applicable checks passed, ${accessibilityEvidence.skipped} intentional project skips, zero failures`], [`${componentMaturity.length} component routes`, "Automated gate", "Serious and critical axe findings, overflow, atomic shortcut geometry, and one-page-heading ownership"], ["200% equivalent", "Automated + browser review", "All component routes at a 640px CSS viewport with no lost content or horizontal page overflow"], ["Forced colors / reduced motion", "Automated gate", "System colors preserve structure; non-essential spatial motion is removed or reduced"], ["Keyboard", "Five-project task paths", "Skip paths, route announcements, compact focus handoff, Menu and Dialog focus return, and whatiuse Data recovery"], ["Screen reader / physical devices", "External gate", "Manual assistive-technology and touch-device sign-off remains required before any component becomes Ready"]]} /></DocSection>
  </>;
}

function BrowserSupport() {
  return <>
    <DocSection id="support-policy" title="Support the engines people ship"><p>The automated matrix covers Chromium, Firefox, and WebKit on desktop, plus mobile Chromium and mobile WebKit emulation. Chrome and Safari anchor routes are manually verified; Edge and physical devices remain manual targets.</p></DocSection>
    <DocSection id="browser-matrix" title="Browser matrix"><StatusTable label="Browser support matrix" rows={[["Chromium / Firefox / WebKit", "Automated verified", "Desktop route, disclosure, theme, and overflow coverage"], ["Chrome 151", "Anchor verified", "Button keyboard focus and confirmed 200% zoom on macOS 26.5.2"], ["Safari 26.5.2", "Anchor verified", "Button keyboard/zoom plus VoiceOver Dialog and Menu on macOS 26.5.2"], ["Mobile engines", "Automated verified", "Pixel 5 and iPhone 12 emulation; drawer, route, and overflow coverage"], ["Edge / physical devices", "Manual target", "Edge unavailable; connected iPhone and iPad detected but touch was not remotely exercised"]]} /></DocSection>
    <DocSection id="viewport-matrix" title="Viewport matrix"><CheckList items={["1280 x 720 desktop documentation and component routes.", "1024 px compact desktop with the page outline removed.", "768 px tablet with a modal navigation drawer.", "390 px mobile with touch targets, zoom, and safe overflow.", "200 percent zoom and forced-colors review."]} /></DocSection>
    <DocSection id="failure-policy" title="Failures block the claim"><p>A failing engine is marked unverified. The release notes name the affected component, state, platform, and workaround. Support is evidence-based, not inferred from shared browser ancestry.</p></DocSection>
  </>;
}

function Security() {
  return <>
    <DocSection id="reporting" title="Report privately"><p>Use the repository's private security-advisory flow once the canonical repository is public. Do not include exploit details in a public issue.</p></DocSection>
    <DocSection id="response" title="Response process"><dl className="public-doc-principles"><div><dt>Acknowledge</dt><dd>Confirm receipt and establish a private communication channel.</dd></div><div><dt>Validate</dt><dd>Reproduce the issue, assess affected versions, and agree on disclosure timing.</dd></div><div><dt>Resolve</dt><dd>Ship a tested fix, credit the reporter when requested, and publish an advisory.</dd></div></dl></DocSection>
    <DocSection id="release-integrity" title="Release integrity"><CheckList items={["Public install commands pin the shadcn CLI; versioned artifacts pin internal and external dependency edges.", "Every historical registry directory is checked against an append-only content ledger; release-anchored versions also match their source commit byte-for-byte.", "GitHub Actions use reviewed full commit SHAs, read-only checkout credentials, and job-scoped deployment or attestation authority.", "A package candidate contains exactly one tarball, a CycloneDX SBOM, a manifest, and checksums before that exact tarball can be attested.", "The npm package remains private. A verified candidate or attestation is not publication."]} /></DocSection>
    <DocSection id="supported-versions" title="Supported versions"><p>Before 1.0, only the latest pre-release candidate receives security fixes. Historical registry artifacts remain available for reproducibility, not ongoing support. A stable release must document its support window before publication.</p></DocSection>
  </>;
}

function Contributing() {
  return <>
    <DocSection id="entry-criteria" title="A component starts with a product case"><CheckList items={["A real decision existing primitives cannot express clearly.", "Five to nine distinct states without filler.", "Usage, accessibility, API, light, dark, and reduced-motion contracts.", "A registry boundary and verification proportional to risk."]} /></DocSection>
    <DocSection id="workflow" title="Development workflow"><CodeBlock label="Terminal">{"npm install\nnpm run dev\nnpm run quality"}</CodeBlock><p><code>npm run quality</code> is the merge gate for unit tests, registry generation, type checking, production build, and worker verification.</p></DocSection>
    <DocSection id="review-evidence" title="Review evidence"><p>Every change includes its product case, affected public API, keyboard path, reduced-motion decision, automated tests, and matched light and dark screenshots.</p></DocSection>
    <DocSection id="change-boundaries" title="Change boundaries"><p>Do not change public props, semantic tokens, focus behavior, or registry paths silently. Breaking alpha changes belong in the changelog with a migration note.</p></DocSection>
  </>;
}

function Releases() {
  return <>
    <DocSection id="version-policy" title="Version policy"><p>The project follows Semantic Versioning once a stable public API exists. During 0.x, every breaking change is still documented and paired with a migration path.</p></DocSection>
    <DocSection id="release-evidence" title="Release evidence"><CheckList items={["All tests, types, registry checks, clean-consumer and production builds pass.", "The immutable version path preserves source bytes, pins internal dependencies to its release scope, and rejects changed content without a version bump.", "The clean consumer preserves a local modification, stages the upstream candidate, and builds after explicit acceptance.", "Cross-browser, 200% reflow, forced-colors, reduced-motion, keyboard, and accessibility matrices match the support claim.", "Representative light, dark, focus, loading, error, and product visual baselines are reviewed.", "The changelog, migration note, compatibility table, maintainer ownership, and security status are current."]} /></DocSection>
    <DocSection id="package-candidate" title="Package candidate is not publication"><p>The private package candidate has defined exports, React peer boundaries, an allowlisted tarball, and a fresh TypeScript/Vite consumer test. Its entry preserves a React client boundary; the recorded package fixture exposes {packageContractEvidence.runtimeExports} runtime exports, server-renders a representative tree, and hydrates with {packageContractEvidence.hydrationRecoverableErrors} recoverable mismatch errors. Framework-specific RSC integration, npm publication, and trusted-publisher configuration remain separate maintainer decisions.</p></DocSection>
    <DocSection id="deprecation" title="Deprecation"><p>Deprecated APIs remain documented for at least one minor release after 1.0. Warnings name the replacement and the last supported version.</p></DocSection>
    <DocSection id="support-window" title="Support window"><p>Pre-release builds support only the latest candidate. The first stable release must publish a defined maintenance window before the package is described as production-ready.</p></DocSection>
  </>;
}

function Licensing() {
  return <>
    <DocSection id="license" title="MIT license"><div className="public-doc-callout"><ShieldCheck aria-hidden="true" /><div><strong>Permissive by design</strong><p>The repository includes the MIT license. The full LICENSE file is the legal source of truth.</p></div></div></DocSection>
    <DocSection id="permissions" title="Permissions"><CheckList items={["Use the system in personal and commercial products.", "Copy, modify, merge, publish, distribute, sublicense, and sell copies.", "Keep the copyright and permission notice with substantial copies."]} /></DocSection>
    <DocSection id="attribution" title="Attribution"><p>Attribution does not need to appear inside the product interface. Preserve the license notice in the distributed source or legal notices.</p></DocSection>
    <DocSection id="third-party" title="Third-party work"><p>The MIT license covers whatiuse source. Dependencies, fonts, icons, and copied registry code retain their own licenses and notices.</p></DocSection>
  </>;
}

const contentById: Record<PublicDocId, (props: { onNavigate: (id: string) => void }) => ReactNode> = {
  installation: Installation,
  "choosing-components": ChoosingComponents,
  "product-pilot": ProductPilotPage,
  analytics: AnalyticsPage,
  "product-patterns": ProductPatternsPage,
  "agent-native": AgentNativePage,
  "component-status": ComponentStatus,
  accessibility: Accessibility,
  "browser-support": BrowserSupport,
  security: Security,
  contributing: Contributing,
  releases: Releases,
  licensing: Licensing,
};

export function PublicDocPage({ id, onNavigate }: { id: PublicDocId; onNavigate: (id: string) => void }) {
  const doc = publicDocItems.find((item) => item.id === id)!;
  const Content = contentById[id];
  return <div className={"system-detail__content public-doc-page system-reference-page" + (["product-pilot", "analytics", "product-patterns"].includes(id) ? " public-doc-page--pilot" : "")}>
    <section className="system-overview" id="system-overview"><span className="public-doc-kicker">{doc.group}</span><h1>{doc.label}</h1><p>{doc.description}</p></section><div className="public-doc-body"><Content onNavigate={onNavigate} /></div>
    <footer className="system-footer"><span>whatiuse</span><span>Public system documentation</span></footer>
  </div>;
}
