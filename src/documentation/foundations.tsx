import { ArrowLeft, ArrowRight, Check, Copy, Play } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, Switch } from "../components/ui";
import { copyText } from "../lib/copy-text";

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
    <div className="system-detail__content system-foundations">
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
      <footer className="system-footer"><span>Interaction Index</span><span>Inter / Divai rhythm</span></footer>
    </div>
  );
}

function FoundationIndexPreview({ id }: { id: FoundationId }) {
  if (id === "color") return <div className="foundation-index__swatches" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (id === "typography") return <div className="foundation-index__type" aria-hidden="true"><strong>Aa</strong><span>Inter Variable</span></div>;
  if (id === "spacing") return <div className="foundation-index__space" aria-hidden="true">{[4, 8, 12, 16].map((value) => <i key={value} style={{ width: value * 2 }} />)}</div>;
  return <div className="foundation-index__motion" aria-hidden="true"><i /><span>110</span><span>150</span><span>220</span></div>;
}

export function FoundationDetail({ id, onBack }: { id: FoundationId; onBack: () => void }) {
  const item = foundationItems.find((candidate) => candidate.id === id)!;
  return (
    <div className="system-detail__content foundation-detail">
      <button className="foundation-back" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> All foundations</button>
      <section className="system-overview foundation-detail__intro">
        <h1>{item.label}</h1>
        <p>{item.description}</p>
      </section>
      {id === "color" && <ColorFoundation />}
      {id === "typography" && <TypographyFoundation />}
      {id === "spacing" && <SpacingFoundation />}
      {id === "motion" && <MotionFoundation />}
      <footer className="system-footer"><span>Interaction Index</span><span>{item.label} foundation</span></footer>
    </div>
  );
}

const graphiteScale = [
  ["50", "#F7F7F8"], ["100", "#F2F2F7"], ["200", "#E5E5EA"], ["300", "#D1D1D6"], ["400", "#AEAEB2"],
  ["500", "#8E8E93"], ["600", "#636366"], ["700", "#48484A"], ["800", "#2C2C2E"], ["900", "#1C1C1E"],
] as const;

const semanticColors = [
  ["--ix-canvas", "Canvas", "#FFFFFF", "#0E0F10", "The root reading surface"],
  ["--ix-stage", "Stage", "rgba(28,28,30,.028)", "rgba(255,255,255,.035)", "Live examples and grouped controls"],
  ["--ix-bg-float", "Float", "#FFFFFF", "#1E1E20", "Persistent raised compositions"],
  ["--ix-bg-flyout", "Flyout", "#FFFFFF", "#262629", "Anchored temporary surfaces"],
  ["--ix-bg-modal", "Modal", "#FFFFFF", "#222225", "Focus-trapping tasks"],
  ["--ix-ink", "Primary ink", "#1C1C1E", "#F2F3F4", "Titles, actions, and essential content"],
  ["--ix-ink-secondary", "Secondary ink", "#636366", "#B4B7BA", "Body copy and supporting labels"],
  ["--ix-ink-tertiary", "Tertiary ink", "#8E8E93", "#85898D", "Metadata and nonessential hints"],
  ["--ix-border", "Border", "rgba(28,28,30,.09)", "rgba(255,255,255,.10)", "Control definition, not page structure"],
] as const;

const elevationContract = [
  ["Canvas", "Page and persistent regions", "--ix-bg-canvas", "none", "document flow"],
  ["Stage", "Specimens and grouped controls", "--ix-bg-stage", "none", "document flow"],
  ["Float", "Persistent raised composition", "--ix-bg-float", "--ix-shadow-float", "document flow"],
  ["Flyout", "Select, Combobox, Context Switcher, Menu, Popover", "--ix-bg-flyout", "--ix-shadow-flyout", "120"],
  ["Modal", "Dialog and Alert Dialog", "--ix-bg-modal", "--ix-shadow-modal", "100 / 110"],
  ["Toast", "Non-blocking outcome feedback", "--ix-bg-flyout", "--ix-shadow-flyout", "130"],
] as const;

function ColorFoundation() {
  return (
    <>
      <FoundationSection eyebrow="Principle" title="Hierarchy before decoration" description="Monochrome does not mean flat. Depth comes from role, contrast, spacing, and state, not from unrelated hues.">
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

const typeRoles = [
  ["Page title", "28 / 32", "580", "The single subject of a documentation page"],
  ["Section title", "20 / 26", "580", "Major page sections and guidance"],
  ["Row title", "14.5 / 20", "470", "Dense lists and object identity"],
  ["Body", "14 / 22", "470", "Reading and explanatory copy"],
  ["UI", "13.5 / 18", "470", "Controls, tabs, and product labels"],
  ["Label", "12 / 16", "560", "Compact hierarchy and field labels"],
  ["Metadata", "11.5 / 16", "470", "Supporting information with a readable floor"],
] as const;

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
        <div className="foundation-code-line"><code>font: var(--ix-type-ui) / 1.35 "Inter Variable", Inter, sans-serif;</code><CopyValue value={'font: var(--ix-type-ui) / 1.35 "Inter Variable", Inter, sans-serif;'} /></div>
      </FoundationSection>
    </>
  );
}

const spacingScale = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64] as const;

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
        <div className="foundation-code-line"><code>gap: var(--ix-space-section); /* 22px section rhythm */</code><CopyValue value="gap: var(--ix-space-section);" /></div>
      </FoundationSection>
    </>
  );
}

const motionTokens = [
  ["Press", "90ms", "Direct physical feedback"],
  ["Hover", "120ms", "Subtle color and border response"],
  ["Enter", "180ms", "Occasional overlay appearance"],
  ["Exit", "120ms", "Faster removal after intent is known"],
] as const;

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
        <div className="motion-token-grid">{motionTokens.map(([name, value, usage]) => <div key={name}><span>{name}</span><strong>{value}</strong><small>{usage}</small></div>)}</div>
        <div className="easing-list"><div><span>Enter / exit</span><code>cubic-bezier(.23, 1, .32, 1)</code><CopyValue value="cubic-bezier(0.23, 1, 0.32, 1)" /></div><div><span>Spatial change</span><code>cubic-bezier(.77, 0, .175, 1)</code><CopyValue value="cubic-bezier(0.77, 0, 0.175, 1)" /></div></div>
      </FoundationSection>
      <FoundationSection eyebrow="Accessibility" title="Reduced motion is a behavior contract" description="Remove translation, scaling, and layout choreography. Keep instant state changes, focus movement, and short opacity feedback.">
        <div className="foundation-code-line foundation-code-line--multiline"><code>{`@media (prefers-reduced-motion: reduce) {\n  .overlay { transition: opacity 120ms var(--ix-ease-out); transform: none; }\n}`}</code><CopyValue value={'@media (prefers-reduced-motion: reduce) {\n  .overlay { transition: opacity 120ms var(--ix-ease-out); transform: none; }\n}'} /></div>
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
