import { ArrowLeft, ArrowRight, Check, Copy, Play } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, Switch } from "../components/ui";
import { copyText } from "../lib/copy-text";
import { tokenByPath, type TokenPath } from "../tokens/generated";

function token(path: TokenPath) {
  return tokenByPath[path];
}

function resolvedToken(path: TokenPath, mode: "light" | "dark" = "light") {
  return token(path).resolvedValues[mode];
}

function numericToken(path: TokenPath) {
  return resolvedToken(path).replace(/(px|ms)$/, "");
}

export const foundationItems = [
  { id: "color", label: "Color", description: "Cool graphite roles that create hierarchy without decorative color." },
  { id: "typography", label: "Typography", description: "Inter tuned for dense product interfaces, readable metadata, and quiet hierarchy." },
  { id: "spacing", label: "Spacing", description: "A four-pixel base with deliberate exceptions for product rhythm and optical balance." },
  { id: "motion", label: "Motion", description: "Fast feedback for repeated actions and continuity for spatial changes." },
] as const;

export type FoundationId = (typeof foundationItems)[number]["id"];

type FoundationRoute = `foundation-${FoundationId}`;

function CopyValue({ value, label = "Copy value" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(value)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    }
  };
  return (
    <button className="foundation-copy" type="button" aria-label={copied ? "Copied" : label} title={copied ? "Copied" : label} onClick={() => void copy()}>
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </button>
  );
}

export function FoundationOverview({ onSelect }: { onSelect: (id: FoundationRoute) => void }) {
  return (
    <div className="system-detail__content system-foundations system-reference-page">
      <section className="system-overview system-overview--foundation">
        <h1>Foundations</h1>
        <p>The semantic grammar shared by every component and interaction. Quiet enough for dense product work, explicit enough to implement without guessing.</p>
      </section>

      <div className="foundation-index" aria-label="Foundation index">
        {foundationItems.map((item, index) => (
          <a href={`#foundation-${item.id}`} key={item.id} onClick={(event) => { event.preventDefault(); onSelect(`foundation-${item.id}`); }}>
            <span className="foundation-index__number">0{index + 1}</span>
            <div><h2>{item.label}</h2><p>{item.description}</p></div>
            <FoundationIndexPreview id={item.id} />
            <ArrowRight className="foundation-index__arrow" aria-hidden="true" />
          </a>
        ))}
      </div>
      <footer className="system-footer"><span>Teum</span><span>Inter / Divai rhythm</span></footer>
    </div>
  );
}

function FoundationIndexPreview({ id }: { id: FoundationId }) {
  if (id === "color") return <div className="foundation-index__swatches" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (id === "typography") return <div className="foundation-index__type" aria-hidden="true"><strong>Aa</strong><span>Inter Variable</span></div>;
  if (id === "spacing") return <div className="foundation-index__space" aria-hidden="true">{[4, 8, 12, 16].map((value) => <i key={value} style={{ width: value * 2 }} />)}</div>;
  return <div className="foundation-index__motion" aria-hidden="true"><i /><span>{numericToken("foundation.motion.duration.press-duration")}</span><span>{numericToken("foundation.motion.duration.hover-duration")}</span><span>{numericToken("foundation.motion.duration.enter-duration")}</span></div>;
}

export function FoundationDetail({ id, onBack }: { id: FoundationId; onBack: () => void }) {
  const item = foundationItems.find((candidate) => candidate.id === id)!;
  return (
    <div className="system-detail__content foundation-detail system-reference-page">
      <button className="foundation-back" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> All foundations</button>
      <section className="system-overview foundation-detail__intro">
        <h1>{item.label}</h1>
        <p>{item.description}</p>
      </section>
      {id === "color" && <ColorFoundation />}
      {id === "typography" && <TypographyFoundation />}
      {id === "spacing" && <SpacingFoundation />}
      {id === "motion" && <MotionFoundation />}
      <footer className="system-footer"><span>Teum</span><span>{item.label} foundation</span></footer>
    </div>
  );
}

const graphiteScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => {
  const path = `theme.palette.gray-${step}` as TokenPath;
  return [String(step), resolvedToken(path)] as const;
});

const semanticColorRoles = [
  ["theme.surface.canvas", "Canvas", "The root reading surface"],
  ["theme.surface.stage", "Stage", "Live examples and grouped controls"],
  ["theme.surface.bg-float", "Float", "Persistent raised compositions"],
  ["theme.surface.bg-flyout", "Flyout", "Anchored temporary surfaces"],
  ["theme.surface.bg-modal", "Modal", "Focus-trapping tasks"],
  ["theme.foreground.ink", "Primary ink", "Titles, actions, and essential content"],
  ["theme.foreground.ink-secondary", "Secondary ink", "Body copy and supporting labels"],
  ["theme.foreground.ink-tertiary", "Tertiary ink", "Metadata and nonessential hints"],
  ["theme.foreground.fg-danger", "Danger", "Invalid values, errors, and destructive actions only"],
  ["theme.border.border", "Border", "Control definition, not page structure"],
] as const satisfies readonly (readonly [TokenPath, string, string])[];

const semanticColors = semanticColorRoles.map(([path, role, usage]) => [
  token(path).cssVariable,
  role,
  resolvedToken(path, "light"),
  resolvedToken(path, "dark"),
  usage,
] as const);

const elevationContract = [
  ["Canvas", "Page and persistent regions", "--teum-bg-canvas", "none", "document flow"],
  ["Stage", "Specimens and grouped controls", "--teum-bg-stage", "none", "document flow"],
  ["Float", "Persistent raised composition", "--teum-bg-float", "--teum-shadow-float", "document flow"],
  ["Flyout", "Select, Combobox, Context Switcher, Menu, Popover", "--teum-bg-flyout", "--teum-shadow-flyout", "120"],
  ["Modal", "Dialog and Alert Dialog", "--teum-bg-modal", "--teum-shadow-modal", "100 / 110"],
  ["Toast", "Non-blocking outcome feedback", "--teum-bg-flyout", "--teum-shadow-flyout", "130"],
] as const;

const materialDecisionContract = [
  ["Space", "Structure related content", "Page sections, navigation groups, guidance", "No edge by default"],
  ["Tone", "Separate persistent regions", "Sidebar, specimen stage, state tiles", "Surface change only"],
  ["Stroke", "Define a control or clipped boundary", "Inputs, tables, code disclosure", "One semantic pixel"],
  ["Float", "Lift a persistent movable object", "Product composition, draggable item", "Float surface + shadow"],
  ["Flyout", "Anchor temporary content to an origin", "Menu, Popover, Select, Combobox", "Flyout surface + shadow"],
  ["Modal", "Suspend the page for a focused task", "Dialog, Alert Dialog, Sheet", "Scrim + modal surface + shadow"],
] as const;

function ColorFoundation() {
  return (
    <>
      <FoundationSection eyebrow="Principle" title="Hierarchy before decoration" description="Monochrome does not mean flat. Depth comes from role, contrast, spacing, and state; danger red appears only when the interface must communicate risk or failure.">
        <div className="color-composition" aria-label="Layering model">
          <div className="color-composition__canvas"><span>Canvas</span><div className="color-composition__stage"><span>Stage</span><div className="color-composition__surface"><strong>Surface</strong><small>Primary and secondary ink</small><Button size="small" variant="primary">Primary action</Button></div></div></div>
        </div>
      </FoundationSection>

      <FoundationSection eyebrow="Scale" title="Cool graphite" description="Raw values support the semantic layer. Components consume role-based tokens instead of hard-coded steps.">
        <div className="graphite-scale">{graphiteScale.map(([step, value]) => <div key={step}><span style={{ background: value }} /><strong>{step}</strong><small>{value}</small></div>)}</div>
      </FoundationSection>

      <FoundationSection eyebrow="Roles" title="Semantic tokens" description="Light and dark themes share one role set. Opacity carries elevation while contrast remains explicit.">
        <table className="foundation-token-table" aria-label="Semantic color tokens"><tbody>
          {semanticColors.map(([token, role, light, dark, usage]) => <tr key={token}>
            <td><span className="token-swatch" style={{ background: `var(${token})` }} aria-hidden="true" /></td>
            <th scope="row"><strong>{role}</strong><small>{usage}</small></th>
            <td><code>{token}</code></td><td className="foundation-token-values"><span><small>Light</small><code>{light}</code></span><span><small>Dark</small><code>{dark}</code></span></td><td><CopyValue value={token} label={`Copy ${token}`} /></td>
          </tr>)}
        </tbody></table>
      </FoundationSection>

      <FoundationSection eyebrow="Material rule" title="Use the quietest sufficient signal" description="Start with spacing, then tone, then a semantic edge. Shadows are reserved for surfaces that actually sit above another surface; they never decorate ordinary document structure.">
        <ol className="material-decision-contract" aria-label="Surface and elevation decision contract">
          {materialDecisionContract.map(([signal, purpose, examples, treatment], index) => (
            <li key={signal} data-elevated={index > 2 || undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{signal}</strong>
              <p>{purpose}</p>
              <small>{examples}</small>
              <code>{treatment}</code>
            </li>
          ))}
        </ol>
        <p className="foundation-note">Decision order: space → tone → stroke → elevation. Focus and error are state signals, so they may add a temporary ring even when the resting surface has no edge.</p>
      </FoundationSection>

      <FoundationSection eyebrow="Elevation" title="One layer contract" description="Surface, shadow, focus behavior, and stack order move together. Anchored flyouts remain above a modal when a field inside that modal opens; navigation remains above every product layer.">
        <div className="elevation-contract" role="region" aria-label="Elevation layer contract" tabIndex={0}><table><thead><tr><th scope="col">Layer</th><th scope="col">Use</th><th scope="col">Surface</th><th scope="col">Shadow</th><th scope="col">Stack</th></tr></thead><tbody>
          {elevationContract.map(([layer, usage, surface, shadow, stack]) => <tr key={layer}><th scope="row">{layer}</th><td>{usage}</td><td><code>{surface}</code></td><td><code>{shadow}</code></td><td><code>{stack}</code></td></tr>)}
        </tbody></table></div>
        <p className="foundation-note">In dark theme, higher layers become slightly lighter as well as more elevated. Shadow alone is not the hierarchy signal.</p>
      </FoundationSection>

      <FoundationSection eyebrow="Accessibility" title="Contrast is a functional state" description="Primary reading content targets WCAG AA. Disabled content may be quieter, but essential meaning never relies on tone alone.">
        <div className="contrast-pairs">
          <div data-tone="strong"><span>Aa</span><strong>Primary on canvas</strong><small>High contrast · body and controls</small></div>
          <div data-tone="secondary"><span>Aa</span><strong>Secondary on canvas</strong><small>Supporting content only</small></div>
          <div data-tone="inverse"><span>Aa</span><strong>Inverse action</strong><small>White on graphite 900</small></div>
        </div>
      </FoundationSection>
    </>
  );
}

const typeRoleSpecs = [
  ["Page title", "foundation.typography.sizes.type-title", "foundation.typography.sizes.line-title", "foundation.typography.heading-weight", "The single subject of a documentation page"],
  ["Section title", "foundation.typography.sizes.type-section", "foundation.typography.sizes.line-section", "foundation.typography.heading-weight", "Major page sections and guidance"],
  ["Row title", "foundation.typography.sizes.type-row", "foundation.typography.sizes.line-row", "foundation.typography.ui-weight", "Dense lists and object identity"],
  ["Body", "foundation.typography.sizes.type-body", "foundation.typography.sizes.line-body", "foundation.typography.ui-weight", "Reading and explanatory copy"],
  ["UI", "foundation.typography.sizes.type-ui", "foundation.typography.sizes.line-ui", "foundation.typography.ui-weight", "Controls, tabs, and product labels"],
  ["Label", "foundation.typography.sizes.type-label", "foundation.typography.sizes.line-label", "foundation.typography.label-weight", "Compact hierarchy and field labels"],
  ["Metadata", "foundation.typography.sizes.type-metadata", "foundation.typography.sizes.line-metadata", "foundation.typography.ui-weight", "Supporting information with a readable floor"],
] as const satisfies readonly (readonly [string, TokenPath, TokenPath, TokenPath, string])[];

const typeRoles = typeRoleSpecs.map(([role, size, line, weight, usage]) => [role, `${numericToken(size)} / ${numericToken(line)}`, resolvedToken(weight), usage] as const);

function TypographyFoundation() {
  return (
    <>
      <FoundationSection eyebrow="Typeface" title="Inter Variable" description="A neutral product face with optical sizing enabled. Weight, spacing, and hierarchy stay quieter than the content they support.">
        <div className="type-hero"><span>Aa</span><div><strong>Inter Variable</strong><p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 · !?@#$%</p></div></div>
      </FoundationSection>
      <FoundationSection eyebrow="Product scale" title="One compact hierarchy" description="The system has no expressive marketing set. Every role is tuned for software, documentation, and dense B2B workflows.">
        <table className="type-role-table" aria-label="Typography roles"><tbody>
          {typeRoles.map(([role, metrics, weight, usage]) => <tr key={role}><td><span data-role={role}>{role}</span></td><th scope="row"><strong>{role}</strong><small>{usage}</small></th><td><code>{metrics}</code></td><td><code>{weight}</code></td></tr>)}
        </tbody></table>
      </FoundationSection>
      <FoundationSection eyebrow="Application" title="Readable at product density" description="Dense interfaces need a floor, not universally tiny text. Metadata can be quiet without becoming fragile.">
        <div className="type-product-example"><div><small>INT-184 · UPDATED 8M</small><h3>Define motion contract</h3><p>Document origin, continuity, interruption, keyboard behavior, and reduced motion before implementation.</p></div><span>In review</span></div>
      </FoundationSection>
      <FoundationSection eyebrow="Implementation" title="Copy the role, not the number" description="Semantic type tokens keep component decisions stable when optical adjustments change.">
        <div className="foundation-code-line"><code>font: var(--teum-type-ui) / 1.35 "Inter Variable", Inter, sans-serif;</code><CopyValue value={'font: var(--teum-type-ui) / 1.35 "Inter Variable", Inter, sans-serif;'} /></div>
      </FoundationSection>
    </>
  );
}

const spacingScale = ["space-1", "space-2", "space-3", "space-4", "space-5", "space-6", "space-7", "space-8", "space-10", "space-12", "space-16"].map((name) => Number(numericToken(`foundation.layout.${name}` as TokenPath)));

const componentDnaRoles = [
  ["Control geometry", "28 / 32 / 36", "Button, input, trigger, and compact actions share one height scale."],
  ["Shape", "6 / 8 / 10", "Controls, containers, and overlays each use one contextual radius."],
  ["Icon box", "14", "A shared glyph box keeps labels and controls optically aligned."],
  ["Focus", "2 + 1", "A two-pixel keyboard ring sits one pixel from the control edge."],
  ["Surface", "control / raised / overlay", "Elevation follows the component's job instead of adding arbitrary borders."],
  ["Motion", "120 / 180 / 120", "Hover, enter, and exit share one crisp interaction cadence."],
] as const;

function SpacingFoundation() {
  return (
    <>
      <FoundationSection eyebrow="Base unit" title="Four pixels, used deliberately" description="The scale keeps compact components predictable. Optical exceptions stay named and documented instead of becoming accidental magic numbers.">
        <div className="spacing-scale">{spacingScale.map((value) => <div key={value}><span style={{ width: value * 2 }} /><strong>{value}px</strong><code>space-{value / 4}</code></div>)}</div>
      </FoundationSection>
      <FoundationSection eyebrow="Relationships" title="Distance communicates structure" description="Space within a group is smaller than space between groups. Hierarchy should be readable even before dividers are added.">
        <div className="spacing-relationships">
          <article><span>4</span><strong>Label and metadata</strong><small>Closely related information</small></article>
          <article><span>8</span><strong>Control contents</strong><small>Icon, label, and shortcut</small></article>
          <article><span>22</span><strong>Page sections</strong><small>Distinct documentation ideas</small></article>
          <article><span>28</span><strong>Page edge</strong><small>Persistent content breathing room</small></article>
        </div>
      </FoundationSection>
      <FoundationSection eyebrow="Density" title="Compact controls, generous targets" description="Visual density never removes the invisible hit area, focus ring, or space required to scan a task safely.">
        <div className="density-specimen"><div><small>28</small><Button size="small">Small</Button></div><div><small>32</small><Button size="medium">Medium</Button></div><div><small>36</small><Button size="large">Large</Button></div></div>
      </FoundationSection>
      <FoundationSection eyebrow="Component DNA" title="One grammar, six anchor components" description="Button, Text Field, Menu, Dialog, Table, and Shared Detail establish the rules that every other component inherits.">
        <div className="dna-contract" aria-label="Component DNA contract">{componentDnaRoles.map(([role, value, description]) => <article key={role}><span>{role}</span><strong>{value}</strong><p>{description}</p></article>)}</div>
      </FoundationSection>
      <FoundationSection eyebrow="Implementation" title="Layout owns external spacing" description="Components define their internal geometry. Parent stacks and grids decide the space between components.">
        <div className="foundation-code-line"><code>gap: var(--teum-space-section); /* 22px section rhythm */</code><CopyValue value="gap: var(--teum-space-section);" /></div>
      </FoundationSection>
    </>
  );
}

const motionTokens = [
  ["Press", "foundation.motion.duration.press-duration", "Direct physical feedback"],
  ["Hover", "foundation.motion.duration.hover-duration", "Subtle color and border response"],
  ["Enter", "foundation.motion.duration.enter-duration", "Occasional overlay appearance"],
  ["Exit", "foundation.motion.duration.exit-duration", "Faster removal after intent is known"],
] as const satisfies readonly (readonly [string, TokenPath, string])[];

function MotionFoundation() {
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(false);
  return (
    <>
      <FoundationSection eyebrow="Principles" title="Motion explains, then gets out of the way" description="Repeated actions stay nearly instant. Spatial transitions animate only when continuity, state, or feedback would otherwise be unclear.">
        <div className="motion-principles"><article><span>01</span><strong>Responsive</strong><p>Feedback begins immediately after input.</p></article><article><span>02</span><strong>Spatial</strong><p>Overlays emerge from their trigger; dialogs remain centered.</p></article><article><span>03</span><strong>Interruptible</strong><p>Rapid changes retarget instead of restarting.</p></article></div>
      </FoundationSection>
      <FoundationSection eyebrow="Live behavior" title="A purposeful entrance" description="Replay the same state change with and without spatial movement. Reduced motion preserves hierarchy and state.">
        <div className="motion-stage">
          <div className="motion-stage__toolbar"><Button size="small" leadingIcon={<Play />} onClick={() => setReplay((value) => value + 1)}>Replay</Button><Switch label="Reduce motion" checked={reduced} onCheckedChange={setReduced} /></div>
          <div className="motion-stage__canvas"><div key={replay} className="motion-stage__panel" data-reduced={reduced || undefined}><small>Component updated</small><strong>Motion contract</strong><p>Origin and continuity are now documented.</p></div></div>
        </div>
      </FoundationSection>
      <FoundationSection eyebrow="Cadence" title="Fast by default" description="Enter uses a strong ease-out. Movement within the screen uses ease-in-out. Keyboard-initiated repeated actions do not wait for animation.">
        <div className="motion-token-grid">{motionTokens.map(([name, path, usage]) => <div key={name}><span>{name}</span><strong>{resolvedToken(path)}</strong><small>{usage}</small></div>)}</div>
        <div className="easing-list"><div><span>Enter / exit</span><code>{resolvedToken("foundation.motion.easing.ease-out")}</code><CopyValue value={resolvedToken("foundation.motion.easing.ease-out")} /></div><div><span>Spatial change</span><code>{resolvedToken("foundation.motion.easing.ease-in-out")}</code><CopyValue value={resolvedToken("foundation.motion.easing.ease-in-out")} /></div></div>
      </FoundationSection>
      <FoundationSection eyebrow="Accessibility" title="Reduced motion is a behavior contract" description="Remove translation, scaling, and layout choreography. Keep instant state changes, focus movement, and short opacity feedback.">
        <div className="foundation-code-line foundation-code-line--multiline"><code>{`@media (prefers-reduced-motion: reduce) {\n  .overlay { transition: opacity 120ms var(--teum-ease-out); transform: none; }\n}`}</code><CopyValue value={'@media (prefers-reduced-motion: reduce) {\n  .overlay { transition: opacity 120ms var(--teum-ease-out); transform: none; }\n}'} /></div>
      </FoundationSection>
    </>
  );
}

function FoundationSection({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="foundation-section">
      <header><span>{eyebrow}</span><div><h2>{title}</h2><p>{description}</p></div></header>
      <div className="foundation-section__content">{children}</div>
    </section>
  );
}
