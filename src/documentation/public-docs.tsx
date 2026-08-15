import { ArrowRight, Check, Copy, ShieldCheck } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { copyText } from "../lib/copy-text";
import { ProductPilot } from "./product-pilot";

export const publicDocItems = [
  { id: "introduction", label: "Introduction", group: "Getting started", description: "The system, its principles, and the shortest path through the documentation." },
  { id: "installation", label: "Installation", group: "Getting started", description: "Add the registry, install a component, and load the shared tokens." },
  { id: "choosing-components", label: "Choosing components", group: "Getting started", description: "Choose adjacent primitives by task, focus, and recovery contract instead of appearance." },
  { id: "product-pilot", label: "Product pilot", group: "Getting started", description: "A real issue-management slice that pressure-tests composition, state, continuity, and recovery." },
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
  return <figure className="public-doc-code"><figcaption>{label}<button type="button" onClick={copy} aria-label={`Copy ${label}`}><Copy aria-hidden="true" />{copied ? "Copied" : "Copy"}</button></figcaption><pre><code>{children}</code></pre></figure>;
}

function CheckList({ items }: { items: readonly string[] }) {
  return <ul className="public-doc-checks">{items.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

function StatusTable({ label, rows }: { label: string; rows: readonly (readonly [string, string, string])[] }) {
  return <div className="public-doc-table-wrap" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr><th scope="col">Target</th><th scope="col">Level</th><th scope="col">Evidence</th></tr></thead><tbody>{rows.map(([target, level, evidence]) => <tr key={target}><th scope="row">{target}</th><td>{level}</td><td>{evidence}</td></tr>)}</tbody></table></div>;
}

function DecisionTable({ label, rows }: { label: string; rows: readonly (readonly [string, string, string])[] }) {
  return <div className="public-doc-table-wrap public-doc-decision-table" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr><th scope="col">User need</th><th scope="col">Choose</th><th scope="col">Do not use it when</th></tr></thead><tbody>{rows.map(([need, choice, boundary]) => <tr key={need}><th scope="row">{need}</th><td><strong>{choice}</strong></td><td>{boundary}</td></tr>)}</tbody></table></div>;
}

function Introduction({ onNavigate }: { onNavigate: (id: string) => void }) {
  return <>
    <DocSection id="what-it-is" title="A product system, not a component gallery">
      <p>Interaction Index combines compact UI primitives with authored behavior patterns. Components define reliable local states. Patterns define origin, continuity, interruption, keyboard behavior, and recovery across a product flow.</p>
    </DocSection>
    <DocSection id="system-map" title="Start with the system area you need">
      <div className="public-doc-links">
        <button type="button" onClick={() => onNavigate("foundations")}><span><strong>Foundations</strong><small>Color, typography, spacing, motion, and Component DNA.</small></span><ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate("button")}><span><strong>Components</strong><small>35 live primitives with states, usage, accessibility, and API contracts.</small></span><ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate("choosing-components")}><span><strong>Choosing components</strong><small>Decision boundaries for controls, temporary surfaces, feedback, and recovery.</small></span><ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate("patterns")}><span><strong>Patterns</strong><small>Four authored interactions for editing, finding, inspecting, and recovery.</small></span><ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate("product-pilot")}><span><strong>Product pilot</strong><small>A live issue workspace that proves components can survive composition.</small></span><ArrowRight aria-hidden="true" /></button>
      </div>
    </DocSection>
    <DocSection id="behavior-signature" title="Three rules make the system recognizable">
      <dl className="public-doc-principles"><div><dt>Stable geometry</dt><dd>Loading and state changes preserve the surrounding layout.</dd></div><div><dt>Shared origin</dt><dd>Overlays and detail surfaces reveal where they came from.</dd></div><div><dt>Reversible completion</dt><dd>Consequential actions expose a clear path back when the product allows it.</dd></div></dl>
    </DocSection>
    <DocSection id="current-status" title="Current status">
      <StatusTable label="Current system status" rows={[["Components", "35 documented", "Live product and locked state specimens"], ["Themes", "Light and dark", "1280 x 720 route review"], ["Distribution", "Public preview", "GitHub source and HTTPS shadcn registry; npm unpublished"], ["License", "MIT", "License text included in the repository"]]} />
    </DocSection>
  </>;
}

function ProductPilotPage() {
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="pilot-workspace" aria-labelledby="pilot-workspace-title"><h2 id="pilot-workspace-title">Live workspace</h2><p>Search, create, edit, complete, archive, and undo. The composition uses the same public components documented in the catalog.</p><ProductPilot /></section>
    <DocSection id="pilot-purpose" title="Prove the system inside a product">
      <p>This is not a showcase dashboard. It is a compact issue-management task with search, creation, selection, editing, status changes, table density, feedback, and recovery sharing one state model.</p>
    </DocSection>
    <DocSection id="pilot-coverage" title="System coverage"><CheckList items={["Button, Icon Button, Text Field, Search Input, Select, Menu, Dialog, Tabs, Badge, Table, Toast, Inline Edit, Shared Detail, and Undo Stack compose in one task.", "Pointer and keyboard paths share the same selected issue and recovery state.", "Light, dark, reduced-motion, narrow viewport, and content-pressure states remain part of the release matrix."]} /></DocSection>
    <DocSection id="pilot-findings" title="API findings"><p>The pilot exposed one concrete composition gap: Shared Detail previously owned its entire detail body. Its new renderDetail slot preserves the shared title and focus contract while allowing a real product to compose status, priority, metadata, editing, menus, and recovery beneath it.</p></DocSection>
  </>;
}

function Installation() {
  return <>
    <DocSection id="requirements" title="Requirements"><p>Use React 19, TypeScript, and a CSS pipeline that supports modern custom properties and color functions. The lockfile records the exact alpha verification stack.</p></DocSection>
    <DocSection id="add-registry" title="Add the registry namespace"><CodeBlock label="Terminal">{"npx shadcn@latest registry add @index=https://minwookshin.github.io/interaction-index/r/{name}.json"}</CodeBlock><p>The HTTPS registry exposes the same generated items verified in this repository. Consumers may also install the complete system directly from GitHub with <code>minwookshin/interaction-index/interaction-index</code>.</p></DocSection>
    <DocSection id="add-component" title="Add one component"><CodeBlock label="Terminal">npx shadcn@latest add @index/button</CodeBlock><p>Install only what the product needs. The complete item remains available for evaluation and internal prototypes.</p></DocSection>
    <DocSection id="source-ownership" title="Know what enters the product"><p>The registry copies component source, its scoped stylesheet, shared tokens and utilities, and declared package dependencies. The product owns those files after installation: review them, adapt them deliberately, and keep local changes visible during updates.</p></DocSection>
    <DocSection id="load-styles" title="Styles load with the component"><CodeBlock label="Component source">{'import "../../styles/index-base.css";\nimport "../../styles/components/button.css";'}</CodeBlock><p>Each generated component loads the shared contract and only its own CSS. The complete-system item also includes <code>styles/interaction-index.css</code> as a stable application-root entry for tokens and global defaults. Documentation workbench styles never enter the registry.</p></DocSection>
    <DocSection id="theme-contract" title="Set theme once, then override semantic roles"><CodeBlock label="Theme control">document.documentElement.dataset.theme = "dark";</CodeBlock><p>Light is the default. Set <code>data-theme="dark"</code> on the root element and override public <code>--ix-*</code> semantic roles after the shared stylesheet. Components should never require product-specific raw gray values.</p></DocSection>
    <DocSection id="cascade-contract" title="Override without specificity fights"><CodeBlock label="Public layer order">@layer index.tokens, index.base, index.components;</CodeBlock><p>Tokens, global defaults, and component rules have an explicit order. Ordinary unlayered product CSS takes precedence, so adopters can customize copied components without escalating selector specificity or depending on accidental import order.</p></DocSection>
    <DocSection id="update-safely" title="Update with evidence"><CheckList items={["Review the changelog before replacing copied source.", "Diff public props, tokens, focus behavior, and motion contracts.", "Run the product's browser and accessibility checks after every update."]} /></DocSection>
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
    <DocSection id="baseline-contract" title="Baseline contract"><CheckList items={["Semantic HTML and Base UI primitives provide the starting behavior.", "Every icon-only control requires an accessible name.", "Disabled, validation, loading, empty, and recovery states remain perceivable.", "Automated checks support manual review. They never replace it."]} /></DocSection>
    <DocSection id="keyboard-focus" title="Keyboard and focus"><p>Keyboard input must complete the same task as pointer input. Focus appears for keyboard navigation and explicit focus specimens, returns to the initiating control after dismissal, and never gets trapped outside a modal contract.</p></DocSection>
    <DocSection id="motion-contrast" title="Motion and contrast"><p>Reduced motion removes spatial travel while preserving state feedback. Light, dark, increased-contrast, and forced-color modes keep structure and meaning without depending on a brand accent.</p></DocSection>
    <DocSection id="manual-review" title="Manual release review"><StatusTable label="Accessibility release review" rows={[["Keyboard", "Required", "Tab order, activation, dismissal, and focus return"], ["Screen reader", "Required", "Names, roles, states, announcements, and reading order"], ["Contrast", "Required", "Text, controls, focus, disabled, and validation states"], ["Motion", "Required", "Reduced-motion path and interruption behavior"]]} /></DocSection>
  </>;
}

function BrowserSupport() {
  return <>
    <DocSection id="support-policy" title="Support the engines people ship"><p>The automated matrix now covers Chromium, Firefox, and WebKit on desktop, plus mobile Chromium and mobile WebKit emulation. Branded browsers and physical mobile devices remain manual release gates; a browser is supported only after both layers pass.</p></DocSection>
    <DocSection id="browser-matrix" title="Browser matrix"><StatusTable label="Browser support matrix" rows={[["Chromium", "Automated verified", "Desktop route, disclosure, theme, and overflow coverage"], ["Firefox", "Automated verified", "Desktop route, disclosure, theme, and overflow coverage"], ["WebKit", "Automated verified", "Desktop route, disclosure, theme, and overflow coverage"], ["Mobile engines", "Automated verified", "Pixel 5 and iPhone 12 emulation; drawer, route, and overflow coverage"], ["Branded browsers", "Manual target", "Chrome, Edge, and Safari smoke tests on shipping applications and devices"]]} /></DocSection>
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
    <DocSection id="release-evidence" title="Release evidence"><CheckList items={["All tests, types, registry checks, clean-consumer and production builds pass.", "Cross-browser and accessibility matrices match the support claim.", "Representative light, dark, focus, loading, error, and product visual baselines are reviewed.", "Bundle and interaction budgets pass in the Product pilot.", "The changelog, migration note, compatibility table, maintainer ownership, and security status are current."]} /></DocSection>
    <DocSection id="deprecation" title="Deprecation"><p>Deprecated APIs remain documented for at least one minor release after 1.0. Warnings name the replacement and the last supported version.</p></DocSection>
    <DocSection id="support-window" title="Support window"><p>Alpha releases support only the latest version. The first stable release must publish a defined maintenance window before the package is described as production-ready.</p></DocSection>
  </>;
}

function Licensing() {
  return <>
    <DocSection id="license" title="MIT license"><div className="public-doc-callout"><ShieldCheck aria-hidden="true" /><div><strong>Permissive by design</strong><p>The repository includes the MIT license. The full LICENSE file is the legal source of truth.</p></div></div></DocSection>
    <DocSection id="permissions" title="Permissions"><CheckList items={["Use the system in personal and commercial products.", "Copy, modify, merge, publish, distribute, sublicense, and sell copies.", "Keep the copyright and permission notice with substantial copies."]} /></DocSection>
    <DocSection id="attribution" title="Attribution"><p>Attribution does not need to appear inside the product interface. Preserve the license notice in the distributed source or legal notices.</p></DocSection>
    <DocSection id="third-party" title="Third-party work"><p>The MIT license covers Interaction Index source. Dependencies, fonts, icons, and copied registry code retain their own licenses and notices.</p></DocSection>
  </>;
}

const contentById: Record<PublicDocId, (props: { onNavigate: (id: string) => void }) => ReactNode> = {
  introduction: Introduction,
  installation: Installation,
  "choosing-components": ChoosingComponents,
  "product-pilot": ProductPilotPage,
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
  return <div className={"system-detail__content public-doc-page" + (id === "product-pilot" ? " public-doc-page--pilot" : "")}><section className="system-overview" id="system-overview"><span className="public-doc-kicker">{doc.group}</span><h1>{doc.label}</h1><p>{doc.description}</p></section><div className="public-doc-body"><Content onNavigate={onNavigate} /></div><footer className="system-footer"><span>Interaction Index</span><span>Public system documentation</span></footer></div>;
}
