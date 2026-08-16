import { ArrowCounterClockwise, ArrowRight, Check, CheckCircle, Circle, Copy, Cube, CursorClick, ShieldCheck, Stack } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import packageManifest from "../../package.json";
import { componentMaturity, maturityDefinitions, readyCriteria } from "../component-maturity";
import { Badge, Button } from "../components/ui";
import { copyText } from "../lib/copy-text";
import { ProductPilot } from "./product-pilot";

export const publicDocItems = [
  { id: "introduction", label: "Introduction", group: "Getting started", description: "The system, its principles, and the shortest path through the documentation." },
  { id: "installation", label: "Installation", group: "Getting started", description: "Add the registry, install a component, and load the shared tokens." },
  { id: "choosing-components", label: "Choosing components", group: "Getting started", description: "Choose adjacent primitives by task, focus, and recovery contract instead of appearance." },
  { id: "product-pilot", label: "Product pilot", group: "Getting started", description: "A real issue-management slice that pressure-tests composition, state, continuity, and recovery." },
  { id: "component-status", label: "Component status", group: "Quality", description: "The maturity level, promotion evidence, and migration contract for every public component." },
  { id: "accessibility", label: "Accessibility", group: "Quality", description: "Keyboard, focus, motion, contrast, and assistive-technology expectations." },
  { id: "browser-support", label: "Browser support", group: "Quality", description: "The support policy, automated browser targets, and manual release matrix." },
  { id: "security", label: "Security", group: "Quality", description: "How vulnerabilities are reported, assessed, fixed, and disclosed." },
  { id: "contributing", label: "Contributing", group: "Project", description: "The evidence and review bar required for a system change." },
  { id: "releases", label: "Releases", group: "Project", description: "Versioning, deprecation, release evidence, and support windows." },
  { id: "licensing", label: "Licensing", group: "Project", description: "MIT permissions, attribution, third-party notices, and commercial use." },
] as const;

export type PublicDocId = (typeof publicDocItems)[number]["id"];
export type PublicDocGroup = (typeof publicDocItems)[number]["group"];

export const publicDocOutlines: Record<PublicDocId, readonly { id: string; label: string }[]> = {
  introduction: [
    { id: "what-it-is", label: "What it is" },
    { id: "system-map", label: "System map" },
    { id: "behavior-signature", label: "Behavior signature" },
    { id: "current-status", label: "Current status" },
  ],
  installation: [
    { id: "requirements", label: "Requirements" },
    { id: "add-registry", label: "Add the registry" },
    { id: "add-component", label: "Add a component" },
    { id: "source-ownership", label: "Source ownership" },
    { id: "load-styles", label: "Load styles" },
    { id: "theme-contract", label: "Theme contract" },
    { id: "cascade-contract", label: "Cascade contract" },
    { id: "integrity-contract", label: "Integrity contract" },
    { id: "update-safely", label: "Update safely" },
  ],
  "choosing-components": [
    { id: "selection", label: "Selection" },
    { id: "temporary-surfaces", label: "Temporary surfaces" },
    { id: "feedback-recovery", label: "Feedback and recovery" },
    { id: "decision-rule", label: "Decision rule" },
  ],
  "product-pilot": [
    { id: "pilot-workspace", label: "Live workspace" },
    { id: "pilot-purpose", label: "Why this exists" },
    { id: "pilot-coverage", label: "System coverage" },
    { id: "pilot-findings", label: "API findings" },
  ],
  "component-status": [
    { id: "status-model", label: "Status model" },
    { id: "promotion-gate", label: "Promotion gate" },
    { id: "current-matrix", label: "Current matrix" },
    { id: "migration-contract", label: "Migration contract" },
  ],
  accessibility: [
    { id: "baseline-contract", label: "Baseline contract" },
    { id: "keyboard-focus", label: "Keyboard and focus" },
    { id: "motion-contrast", label: "Motion and contrast" },
    { id: "manual-review", label: "Manual review" },
  ],
  "browser-support": [
    { id: "support-policy", label: "Support policy" },
    { id: "browser-matrix", label: "Browser matrix" },
    { id: "viewport-matrix", label: "Viewport matrix" },
    { id: "failure-policy", label: "Failure policy" },
  ],
  security: [
    { id: "reporting", label: "Reporting" },
    { id: "response", label: "Response process" },
    { id: "supported-versions", label: "Supported versions" },
  ],
  contributing: [
    { id: "entry-criteria", label: "Entry criteria" },
    { id: "workflow", label: "Workflow" },
    { id: "review-evidence", label: "Review evidence" },
    { id: "change-boundaries", label: "Change boundaries" },
  ],
  releases: [
    { id: "version-policy", label: "Version policy" },
    { id: "release-evidence", label: "Release evidence" },
    { id: "package-candidate", label: "Package candidate" },
    { id: "deprecation", label: "Deprecation" },
    { id: "support-window", label: "Support window" },
  ],
  licensing: [
    { id: "license", label: "MIT license" },
    { id: "permissions", label: "Permissions" },
    { id: "attribution", label: "Attribution" },
    { id: "third-party", label: "Third-party work" },
  ],
};

function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="public-doc-section" id={id}><h2>{title}</h2>{children}</section>;
}

function CodeBlock({ label, children }: { label: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => void copyText(children).then((result) => {
    setCopied(result);
    window.setTimeout(() => setCopied(false), 1200);
  });
  return <figure className="public-doc-code"><figcaption>{label}<button type="button" onClick={copy} aria-label={`Copy ${label}`}><Copy aria-hidden="true" />{copied ? "Copied" : "Copy"}</button></figcaption><pre tabIndex={0}><code>{children}</code></pre></figure>;
}

function CheckList({ items }: { items: readonly string[] }) {
  return <ul className="public-doc-checks">{items.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

function StatusTable({ label, rows }: { label: string; rows: readonly (readonly [string, string, string])[] }) {
  return <div className="public-doc-table-wrap" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr><th scope="col">Target</th><th scope="col">Level</th><th scope="col">Evidence</th></tr></thead><tbody>{rows.map(([target, level, evidence]) => <tr key={target}><th scope="row">{target}</th><td>{level}</td><td>{evidence}</td></tr>)}</tbody></table></div>;
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

const introductionIssues = [
  { id: "motion", code: "INT-204", title: "Motion contracts", detail: "Keep repeated actions fast while preserving spatial context for temporary surfaces." },
  { id: "focus", code: "INT-198", title: "Keyboard focus", detail: "Return focus to a predictable origin after menus, dialogs, and shared detail views close." },
  { id: "registry", code: "INT-191", title: "Registry output", detail: "Confirm installed source, tokens, and local dependencies match the published contract." },
] as const;

function IntroductionProof() {
  const [selectedId, setSelectedId] = useState<string>(introductionIssues[0].id);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const selected = introductionIssues.find((issue) => issue.id === selectedId) ?? introductionIssues[0];
  const completed = completedId === selected.id;
  return <div className="entry-proof" aria-label="Interactive component composition">
    <header><span>Live composition</span><Badge variant="outline">Interactive</Badge></header>
    <div className="entry-proof__workspace">
      <div className="entry-proof__list" aria-label="Issues">
        {introductionIssues.map((issue) => {
          const done = completedId === issue.id;
          return <button type="button" key={issue.id} aria-pressed={selectedId === issue.id} data-selected={selectedId === issue.id || undefined} onClick={() => setSelectedId(issue.id)}>
            {done ? <CheckCircle weight="fill" aria-hidden="true" /> : <Circle aria-hidden="true" />}
            <span><strong>{issue.title}</strong><small>{issue.code}</small></span>
          </button>;
        })}
      </div>
      <article className="entry-proof__detail" aria-live="polite">
        <span>{selected.code}</span>
        <h3>{selected.title}</h3>
        <p>{selected.detail}</p>
        <div><Badge variant={completed ? "strong" : "outline"}>{completed ? "Done" : "In progress"}</Badge><Button size="small" variant="secondary" onClick={() => setCompletedId(completed ? null : selected.id)}>{completed ? "Reopen" : "Mark done"}</Button></div>
      </article>
    </div>
    <footer>
      <span>Stable geometry</span><span>Shared origin</span><span>Reversible completion</span>
      {completedId && <button type="button" onClick={() => setCompletedId(null)}><ArrowCounterClockwise aria-hidden="true" />Undo</button>}
    </footer>
  </div>;
}

function Introduction({ onNavigate }: { onNavigate: (id: string) => void }) {
  return <>
    <section className="entry-hero" id="what-it-is">
      <div className="entry-hero__copy">
        <h1 className="entry-hero__route">Introduction</h1>
        <h2>Build interfaces that stay clear through change.</h2>
        <p>Accessible React components and authored interaction patterns for compact, recoverable product workflows.</p>
        <div className="entry-hero__actions"><Button variant="primary" trailingIcon={<ArrowRight />} onClick={() => onNavigate("installation")}>Get started</Button><button type="button" onClick={() => onNavigate("button")}>Explore components<ArrowRight aria-hidden="true" /></button></div>
      </div>
      <IntroductionProof />
    </section>
    <DocSection id="system-map" title="Start with the task in front of you">
      <div className="entry-paths">
        <button className="entry-paths__primary" type="button" onClick={() => onNavigate("installation")}><span className="entry-paths__icon"><Stack aria-hidden="true" /></span><span><strong>Start building</strong><small>Install one component, load the shared tokens, and understand source ownership.</small></span><ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate("button")}><span className="entry-paths__icon"><Cube aria-hidden="true" /></span><span><strong>Choose a component</strong><small>Compare live states, usage, accessibility, and API contracts.</small></span><ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate("patterns")}><span className="entry-paths__icon"><CursorClick aria-hidden="true" /></span><span><strong>Study behavior</strong><small>Explore four authored patterns for editing, inspecting, acting, and recovery.</small></span><ArrowRight aria-hidden="true" /></button>
      </div>
    </DocSection>
    <DocSection id="behavior-signature" title="Three rules make the system recognizable">
      <dl className="public-doc-principles"><div><dt>Stable geometry</dt><dd>Loading and state changes preserve the surrounding layout.</dd></div><div><dt>Shared origin</dt><dd>Overlays and detail surfaces reveal where they came from.</dd></div><div><dt>Reversible completion</dt><dd>Consequential actions expose a clear path back when the product allows it.</dd></div></dl>
    </DocSection>
    <DocSection id="current-status" title="Current status">
      <StatusTable label="Current system status" rows={[["Components", `${componentMaturity.length} documented`, "Live product and locked state specimens"], ["Themes", "Light and dark", "1280 x 720 route review"], ["Distribution", "Public preview", "GitHub source and HTTPS shadcn registry; npm unpublished"], ["License", "MIT", "License text included in the repository"]]} />
    </DocSection>
  </>;
}

function ProductPilotPage() {
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="pilot-workspace" aria-labelledby="pilot-workspace-title"><h2 id="pilot-workspace-title">Live workspace</h2><p>Find an issue, inspect it in Shared Detail, archive it from Action List, then restore it from Undo Stack. The same state model also supports create, edit, and completion.</p><ProductPilot /></section>
    <DocSection id="pilot-purpose" title="Prove the system inside a product">
      <p>This is not a showcase dashboard. It is one executable task: find and act, inspect without losing place, mutate, and recover. Search, selection, Action List, Shared Detail, and Undo Stack share one source of truth.</p>
    </DocSection>
    <DocSection id="pilot-coverage" title="System coverage"><CheckList items={["Button, Icon Button, Text Field, Search Input, Select, Menu, Dialog, Tabs, Badge, Table, Toast, Inline Edit, Action List, Shared Detail, and Undo Stack compose in one task.", "The pointer path and Command K path operate on the same selected issue and recovery history.", "Light, dark, reduced-motion, narrow viewport, and content-pressure states remain part of the release matrix."]} /></DocSection>
    <DocSection id="pilot-findings" title="API findings"><p>The pilot exposed two composition requirements: Shared Detail needs a product-owned detail slot, and Action List must execute against the selected object without taking ownership of that object. The composed task now verifies both boundaries and restores archived data through the real Undo Stack inverse.</p></DocSection>
  </>;
}

function ComponentStatus() {
  return <>
    <DocSection id="status-model" title="Maturity is a support promise">
      <p>Status describes whether a component is safe to depend on, not how polished its screenshot looks. Teum follows the public Experimental, Ready, and Deprecated model while keeping every current component honest at Experimental during private alpha.</p>
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
  return <>
    <DocSection id="requirements" title="Requirements"><p>Use React 18.2 or newer, including React 19. Teum is authored in TypeScript and ships typed React APIs, framework-neutral CSS variables, and an optional Tailwind CSS v4 bridge. Tailwind is never required to render a component.</p><StatusTable label="Supported integration modes" rows={[["React", "18.2+ and 19", "Fresh Vite consumers compile against both major lines"], ["TypeScript", "First-class", "Declarations and strict consumer builds are release-gated"], ["Plain CSS", "Source of truth", "Semantic variables, cascade layers, and scoped component CSS"], ["Tailwind CSS", "Optional v4 bridge", "Semantic utilities map back to the same Teum variables"]]} /></DocSection>
    <DocSection id="add-registry" title="Connect the Teum Registry"><CodeBlock label="Mutable alpha channel">{`npx shadcn@latest registry add @teum=${packageManifest.homepage}/r/{name}.json`}</CodeBlock><p><strong>Teum Registry</strong> is the product and source boundary. The shadcn CLI is the compatible transport used to resolve and copy the files; it does not define the component API, tokens, visual language, or release policy. Use the mutable channel while evaluating active alpha work.</p><CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx shadcn@latest registry add @teum-pinned=${packageManifest.homepage}/r/v/${packageManifest.version}/{name}.json`}</CodeBlock><p>Versioned JSON is a byte-for-byte release artifact. Its path is locked by the build and served with a one-year immutable cache policy; changing its contents requires a package-version bump.</p></DocSection>
    <DocSection id="add-component" title="Install from Teum"><CodeBlock label="Teum Registry">npx shadcn@latest add @teum/button</CodeBlock><p>The <code>@teum</code> namespace keeps the source identity visible while using an established installer. Install only what the product needs; <code>@teum/teum</code> remains available for evaluation and internal prototypes. The future <code>teum</code> npm package is verified as a private candidate but is not published yet.</p></DocSection>
    <DocSection id="source-ownership" title="Know what enters the product"><p>The registry copies component source, its scoped stylesheet, shared tokens and utilities, and declared package dependencies. The product owns those files after installation: review them, adapt them deliberately, and keep local changes visible during updates.</p></DocSection>
    <DocSection id="load-styles" title="Choose plain CSS or add the Tailwind bridge"><CodeBlock label="Plain CSS component source">{'import "../../styles/teum-base.css";\nimport "../../styles/components/button.css";'}</CodeBlock><p>Plain CSS is the default. Each generated component loads the shared contract and only its own scoped stylesheet; no Tailwind runtime or configuration is required. The complete-system item also includes <code>styles/teum.css</code> as a stable application-root entry.</p><CodeBlock label="Optional Tailwind CSS v4 bridge">{'npx shadcn@latest add @teum/teum-tailwind\n\n/* app.css */\n@import "tailwindcss";\n@import "./styles/teum-base.css";\n@import "./styles/teum-tailwind.css";'}</CodeBlock><p>The bridge adds semantic utilities such as <code>bg-background</code>, <code>text-foreground</code>, <code>rounded-control</code>, and <code>shadow-flyout</code>. They resolve to the same <code>--teum-*</code> variables as the components, so CSS and Tailwind stay visually identical.</p></DocSection>
    <DocSection id="theme-contract" title="Set theme once, then override semantic roles"><CodeBlock label="Theme control">document.documentElement.dataset.theme = "dark";</CodeBlock><p>Light is the default. Set <code>data-theme="dark"</code> on the root element and override public <code>--teum-*</code> semantic roles after the shared stylesheet. Components should never require product-specific raw gray values.</p></DocSection>
    <DocSection id="cascade-contract" title="Override without specificity fights"><CodeBlock label="Public layer order">@layer teum.tokens, teum.base, teum.components;</CodeBlock><p>Tokens, global defaults, and component rules have an explicit order. Ordinary unlayered product CSS takes precedence, so adopters can customize copied components without escalating selector specificity or depending on accidental import order.</p></DocSection>
    <DocSection id="integrity-contract" title="Verify what changed"><CodeBlock label="Registry review">npm run diff:registry -- --from ./previous-manifest.json</CodeBlock><p>The public manifest records SHA-256 hashes for every registry artifact and copied file, plus compiler-extracted API and semantic-token contract hashes. The mutable channel proves what changed; the versioned channel adds an immutable path and matching release manifest.</p></DocSection>
    <DocSection id="update-safely" title="Update with evidence"><CheckList items={["Commit product-owned customizations before fetching upstream source.", "Review the manifest diff, changelog, migration note, and staged registry candidate before accepting an overwrite.", "Keep locally modified files unchanged until the consumer explicitly accepts the upstream candidate.", "Run the product's type, browser, accessibility, interaction, and visual checks after every update."]} /></DocSection>
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
    <DocSection id="baseline-contract" title="Baseline contract"><CheckList items={["Semantic HTML, Base UI, and React Aria primitives provide the starting behavior.", "Every icon-only control requires an accessible name.", "Disabled, validation, loading, empty, and recovery states remain perceivable.", "Automated checks support manual review. They never replace it."]} /></DocSection>
    <DocSection id="keyboard-focus" title="Keyboard and focus"><p>Keyboard input must complete the same task as pointer input. Focus appears for keyboard navigation and explicit focus specimens, returns to the initiating control after dismissal, and never gets trapped outside a modal contract.</p></DocSection>
    <DocSection id="motion-contrast" title="Motion and contrast"><p>Reduced motion removes spatial travel while preserving state feedback. Light, dark, increased-contrast, and forced-color modes keep structure and meaning without depending on a brand accent.</p></DocSection>
    <DocSection id="manual-review" title="Evidence matrix"><StatusTable label="Accessibility release review" rows={[[`${componentMaturity.length} component routes`, "Automated gate", "Serious and critical axe findings, overflow, and atomic shortcut geometry"], ["200% equivalent", "Automated + browser review", "All component routes at a 640px CSS viewport with no lost content or horizontal page overflow"], ["Forced colors / reduced motion", "Automated gate", "System colors preserve structure; non-essential spatial motion is removed or reduced"], ["Keyboard", "Automated task paths", "Menu and Dialog focus return plus the Product pilot Command K archive and Undo task"], ["Screen reader / physical devices", "External gate", "Manual assistive-technology and touch-device sign-off remains required before any component becomes Ready"]]} /></DocSection>
  </>;
}

function BrowserSupport() {
  return <>
    <DocSection id="support-policy" title="Support the engines people ship"><p>The automated matrix covers Chromium, Firefox, and WebKit on desktop, plus mobile Chromium and mobile WebKit emulation. Branded Chrome and Safari anchor routes are manually verified; Edge and physical-device interaction remain explicit targets.</p></DocSection>
    <DocSection id="browser-matrix" title="Browser matrix"><StatusTable label="Browser support matrix" rows={[["Chromium / Firefox / WebKit", "Automated verified", "Desktop route, disclosure, theme, and overflow coverage"], ["Chrome 151", "Anchor verified", "Button keyboard focus and confirmed 200% zoom on macOS 26.5.2"], ["Safari 26.5.2", "Anchor verified", "Button keyboard/zoom plus VoiceOver Dialog and Menu on macOS 26.5.2"], ["Mobile engines", "Automated verified", "Pixel 5 and iPhone 12 emulation; drawer, route, and overflow coverage"], ["Edge / physical devices", "Manual target", "Edge unavailable; connected iPhone and iPad detected but touch was not remotely exercised"]]} /></DocSection>
    <DocSection id="viewport-matrix" title="Viewport matrix"><CheckList items={["1280 x 720 desktop documentation and component routes.", "1024 px compact desktop with the page outline removed.", "768 px tablet with a modal navigation drawer.", "390 px mobile with touch targets, zoom, and safe overflow.", "200 percent zoom and forced-colors review."]} /></DocSection>
    <DocSection id="failure-policy" title="Failures block the claim"><p>A failing engine is marked unverified. The release notes name the affected component, state, platform, and workaround. Support is evidence-based, not inferred from shared browser ancestry.</p></DocSection>
  </>;
}

function Security() {
  return <>
    <DocSection id="reporting" title="Report privately"><p>Use the repository's private security-advisory flow once the canonical repository is public. Do not include exploit details in a public issue.</p></DocSection>
    <DocSection id="response" title="Response process"><dl className="public-doc-principles"><div><dt>Acknowledge</dt><dd>Confirm receipt and establish a private communication channel.</dd></div><div><dt>Validate</dt><dd>Reproduce the issue, assess affected versions, and agree on disclosure timing.</dd></div><div><dt>Resolve</dt><dd>Ship a tested fix, credit the reporter when requested, and publish an advisory.</dd></div></dl></DocSection>
    <DocSection id="supported-versions" title="Supported versions"><p>Before 1.0, only the latest alpha receives security fixes. A stable release must document its support window before publication.</p></DocSection>
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
    <DocSection id="release-evidence" title="Release evidence"><CheckList items={["All tests, types, registry checks, clean-consumer and production builds pass.", "The immutable version path matches the mutable release byte-for-byte and rejects changed content without a version bump.", "The clean consumer preserves a local modification, stages the upstream candidate, and builds after explicit acceptance.", "Cross-browser, 200% reflow, forced-colors, reduced-motion, keyboard, and accessibility matrices match the support claim.", "Representative light, dark, focus, loading, error, and product visual baselines are reviewed.", "The changelog, migration note, compatibility table, maintainer ownership, and security status are current."]} /></DocSection>
    <DocSection id="package-candidate" title="Package candidate is not publication"><p>The private package candidate has explicit exports, React peer boundaries, an allowlisted tarball, and a fresh TypeScript/Vite consumer test. Its GitHub workflow can attest the tarball without an npm credential. npm publication and trusted-publisher configuration remain separate maintainer decisions.</p></DocSection>
    <DocSection id="deprecation" title="Deprecation"><p>Deprecated APIs remain documented for at least one minor release after 1.0. Warnings name the replacement and the last supported version.</p></DocSection>
    <DocSection id="support-window" title="Support window"><p>Alpha releases support only the latest version. The first stable release must publish a defined maintenance window before the package is described as production-ready.</p></DocSection>
  </>;
}

function Licensing() {
  return <>
    <DocSection id="license" title="MIT license"><div className="public-doc-callout"><ShieldCheck aria-hidden="true" /><div><strong>Permissive by design</strong><p>The repository includes the MIT license. The full LICENSE file is the legal source of truth.</p></div></div></DocSection>
    <DocSection id="permissions" title="Permissions"><CheckList items={["Use the system in personal and commercial products.", "Copy, modify, merge, publish, distribute, sublicense, and sell copies.", "Keep the copyright and permission notice with substantial copies."]} /></DocSection>
    <DocSection id="attribution" title="Attribution"><p>Attribution does not need to appear inside the product interface. Preserve the license notice in the distributed source or legal notices.</p></DocSection>
    <DocSection id="third-party" title="Third-party work"><p>The MIT license covers Teum source. Dependencies, fonts, icons, and copied registry code retain their own licenses and notices.</p></DocSection>
  </>;
}

const contentById: Record<PublicDocId, (props: { onNavigate: (id: string) => void }) => ReactNode> = {
  introduction: Introduction,
  installation: Installation,
  "choosing-components": ChoosingComponents,
  "product-pilot": ProductPilotPage,
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
  const introduction = id === "introduction";
  const pageMode = introduction ? " public-doc-page--editorial system-editorial-page" : " system-reference-page";
  return <div className={"system-detail__content public-doc-page" + pageMode + (id === "product-pilot" ? " public-doc-page--pilot" : "")}>
    {introduction ? <div className="public-doc-body public-doc-body--entry"><Content onNavigate={onNavigate} /></div> : <><section className="system-overview" id="system-overview"><span className="public-doc-kicker">{doc.group}</span><h1>{doc.label}</h1><p>{doc.description}</p></section><div className="public-doc-body"><Content onNavigate={onNavigate} /></div></>}
    <footer className="system-footer"><span>Teum</span><span>Public system documentation</span></footer>
  </div>;
}
