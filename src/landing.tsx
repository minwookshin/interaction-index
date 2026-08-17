import {
  ArrowCounterClockwise,
  ArrowRight,
  Atom,
  BookmarkSimple,
  CaretDown,
  Check,
  Command,
  Copy,
  DotsThree,
  GithubLogo,
  Keyboard,
  LinkSimple,
  Moon,
  Paperclip,
  Plus,
  Scales,
  Sun,
  X,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import packageManifest from "../package.json";
import { copyText } from "./lib/copy-text";

type Theme = "light" | "dark";
type ProofMode = "shared-detail" | "action-list" | "undo-stack";
type LandingStatus = "Open" | "In progress" | "Done";

type LandingIssue = {
  id: string;
  code: string;
  title: string;
  kind: string;
  updated: string;
  status: LandingStatus;
  description: string;
};

const installCommand = `npx shadcn@${packageManifest.devDependencies.shadcn} add minwookshin/teum/teum#v${packageManifest.version}`;

const landingIssues: readonly LandingIssue[] = [
  {
    id: "undo-dismiss",
    code: "#846",
    title: "Undo dismiss fails on fast click",
    kind: "Bug",
    updated: "2m",
    status: "In progress",
    description: "When dismissing a banner and immediately triggering undo, the action sometimes fails and the banner remains hidden.",
  },
  {
    id: "restore-focus",
    code: "#845",
    title: "Restore deleted comment focus",
    kind: "Bug",
    updated: "18m",
    status: "Open",
    description: "Return keyboard focus to the comment origin after a reversible delete is restored.",
  },
  {
    id: "shortcut-conflict",
    code: "#844",
    title: "Keyboard shortcut conflict",
    kind: "Enhancement",
    updated: "1h",
    status: "Open",
    description: "Resolve overlapping shortcuts without changing the geometry of the command surface.",
  },
  {
    id: "bulk-confirmation",
    code: "#843",
    title: "Add bulk close confirmation",
    kind: "Enhancement",
    updated: "3h",
    status: "Open",
    description: "Keep bulk changes deliberate while preserving a clear recovery path after completion.",
  },
  {
    id: "scroll-jank",
    code: "#842",
    title: "Virtual list scroll jank",
    kind: "Bug",
    updated: "5h",
    status: "Open",
    description: "Preserve list position while neighboring rows mount and unmount during fast navigation.",
  },
] as const;

const proofModes: readonly { id: ProofMode; label: string }[] = [
  { id: "shared-detail", label: "Shared Detail" },
  { id: "action-list", label: "Action List" },
  { id: "undo-stack", label: "Undo Stack" },
] as const;

const landingStatusCycle: readonly LandingStatus[] = ["Open", "In progress", "Done"];

function Brand({ onHome }: { onHome?: () => void }) {
  return <a className="teum-wordmark" href="/" aria-label="Teum home" onClick={(event) => {
    if (!onHome) return;
    event.preventDefault();
    onHome();
  }}><span><Command weight="bold" aria-hidden="true" /></span><strong>Teum</strong></a>;
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />;
}

function LandingProductProof() {
  const [mode, setMode] = useState<ProofMode>("shared-detail");
  const [selectedId, setSelectedId] = useState(landingIssues[0].id);
  const [feedback, setFeedback] = useState<"dismissed" | "restored" | "hidden">("dismissed");
  const [statusById, setStatusById] = useState<Partial<Record<string, LandingStatus>>>({});
  const selected = useMemo(() => landingIssues.find((issue) => issue.id === selectedId) ?? landingIssues[0], [selectedId]);
  const statusFor = (issue: LandingIssue) => statusById[issue.id] ?? issue.status;
  const selectedStatus = statusFor(selected);

  const undo = () => setFeedback("restored");
  const restoreFeedback = () => setFeedback("dismissed");
  const cycleSelectedStatus = () => {
    const currentIndex = landingStatusCycle.indexOf(selectedStatus);
    const nextStatus = landingStatusCycle[(currentIndex + 1) % landingStatusCycle.length];
    setStatusById((current) => ({ ...current, [selected.id]: nextStatus }));
  };

  return <section className="landing-proof" aria-label="Teum interaction system preview">
    <header className="landing-proof__tabs" aria-label="Interaction patterns">
      <div role="tablist" aria-label="Preview interaction patterns">
        {proofModes.map((item) => <button type="button" role="tab" aria-selected={mode === item.id} key={item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}
      </div>
    </header>

    <div className="landing-proof__workspace" data-mode={mode}>
      <section className="landing-proof__issues" aria-label="Issues">
        <div className="landing-proof__pane-heading"><strong>Issues</strong><button type="button" aria-label="Create issue"><Plus aria-hidden="true" />New</button></div>
        <button type="button" className="landing-proof__filter">Open <CaretDown aria-hidden="true" /></button>
        <div className="landing-proof__issue-list">
          {landingIssues.map((issue) => <button type="button" key={issue.id} data-selected={selected.id === issue.id || undefined} aria-pressed={selected.id === issue.id} onClick={() => setSelectedId(issue.id)}>
            <strong>{issue.title}</strong>
            <span><span>{issue.code}</span><em>{issue.kind}</em><time>{issue.updated}</time></span>
          </button>)}
        </div>
      </section>

      <article className="landing-proof__detail" aria-live="polite">
        <header><div><h2>{selected.title}</h2><div><span>{selected.code}</span><button type="button" className="landing-proof__status" aria-label={`Change issue status, currently ${selectedStatus}`} onClick={cycleSelectedStatus}>{selectedStatus}<CaretDown aria-hidden="true" /></button></div></div><div className="landing-proof__detail-actions"><button type="button" aria-label="Copy issue link"><LinkSimple aria-hidden="true" /></button><button type="button" aria-label="Bookmark issue"><BookmarkSimple aria-hidden="true" /></button><button type="button" aria-label="More issue options"><DotsThree weight="bold" aria-hidden="true" /></button></div></header>
        <p>{selected.description}</p>
        <section className="landing-proof__activity"><h3>Activity</h3><div><span className="landing-proof__avatar">AM</span><p><strong>Alex M.</strong><small>Reproduced on Chrome 124 and Safari 17.</small></p><time>2m</time></div><div><span className="landing-proof__avatar">JP</span><p><strong>Jordan P.</strong><small>Root cause: race between animation end and state commit.</small></p><time>1m</time></div></section>
        <label className="landing-proof__comment"><span className="teum-sr-only">Add a comment</span><input placeholder="Add a comment…" /><button type="button" aria-label="Attach file"><Paperclip aria-hidden="true" /></button></label>
      </article>

      <aside className="landing-proof__actions" aria-label={mode === "undo-stack" ? "Undo history" : "Action List"}>
        <header><strong>{mode === "undo-stack" ? "Recent changes" : "Action List (3)"}</strong><button type="button" aria-label="Close action list"><X aria-hidden="true" /></button></header>
        <div className="landing-proof__action-list">
          {landingIssues.slice(0, 3).map((issue) => <button type="button" key={issue.id} data-selected={selected.id === issue.id || undefined} onClick={() => setSelectedId(issue.id)}><strong>{issue.title}</strong><span><span>{issue.code}</span><em>{issue.kind}</em>{selected.id === issue.id && <em>{statusFor(issue)}</em>}<time>{issue.updated}</time></span></button>)}
        </div>
        {feedback !== "hidden" && <div className="landing-proof__undo" data-restored={feedback === "restored" || undefined} role="status"><ArrowCounterClockwise aria-hidden="true" /><span>{feedback === "restored" ? "Comment restored" : "Comment dismissed"}</span>{feedback === "dismissed" ? <button type="button" onClick={undo}>Undo</button> : <button type="button" onClick={restoreFeedback}>Dismiss again</button>}<button type="button" aria-label="Dismiss feedback" onClick={() => setFeedback("hidden")}><X aria-hidden="true" /></button></div>}
      </aside>
    </div>
  </section>;
}

type LandingPageProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onOpenDocumentation: () => void;
  onOpenComponents: () => void;
  onOpenPatterns: () => void;
};

export function LandingPage({ theme, onThemeChange, onOpenDocumentation, onOpenComponents, onOpenPatterns }: LandingPageProps) {
  const [copied, setCopied] = useState(false);
  const copyInstall = () => void copyText(installCommand).then((result) => {
    setCopied(result);
    window.setTimeout(() => setCopied(false), 1400);
  });

  return <div className="teum-landing">
    <a className="teum-skip-link" href="#teum-landing-content" onClick={(event) => { event.preventDefault(); document.getElementById("teum-landing-content")?.focus({ preventScroll: true }); }}>Skip to main content</a>
    <header className="landing-header">
      <Brand />
      <a className="landing-header__documentation" href="#installation" onClick={(event) => { event.preventDefault(); onOpenDocumentation(); }}>Documentation</a>
      <div className="landing-header__actions">
        <a className="landing-icon-action" href="https://github.com/minwookshin/teum" target="_blank" rel="noreferrer" aria-label="View Teum on GitHub"><GithubLogo weight="fill" aria-hidden="true" /></a>
        <button type="button" className="landing-icon-action" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}><ThemeIcon theme={theme} /></button>
      </div>
    </header>

    <main id="teum-landing-content" tabIndex={-1}>
      <section className="landing-hero" aria-labelledby="landing-title">
        <h1 id="landing-title" aria-label="Interfaces that stay clear through change.">Interfaces that stay<br />clear through change.</h1>
        <p>Accessible React + TypeScript components<br className="landing-hero__desktop-break" /> and interaction patterns.</p>
        <button type="button" className="landing-install" onClick={copyInstall} aria-label="Copy Teum install command"><span aria-hidden="true">$</span><code>{installCommand}</code><span className="landing-install__copy">{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</span></button>
        <a href="#installation" className="landing-hero__documentation" onClick={(event) => { event.preventDefault(); onOpenDocumentation(); }}>Open documentation <ArrowRight aria-hidden="true" /></a>
      </section>

      <LandingProductProof />

      <ul className="landing-trust" aria-label="Project compatibility"><li><Scales aria-hidden="true" />MIT licensed</li><li><Atom aria-hidden="true" />React 18 &amp; 19</li><li><Keyboard aria-hidden="true" />Keyboard and reduced motion</li></ul>

      <section className="landing-behavior" aria-labelledby="landing-behavior-title">
        <div className="landing-behavior__intro"><h2 id="landing-behavior-title">Motion, focus, and recovery are part of every component.</h2></div>
        <dl>
          <div><dt>01</dt><dd><strong>Stable geometry</strong><span>Layouts stay in place as states change.</span></dd></div>
          <div><dt>02</dt><dd><strong>Shared origin</strong><span>Surfaces open from their control and return focus there.</span></dd></div>
          <div><dt>03</dt><dd><strong>Undo</strong><span>Complete an action, then reverse it if needed.</span></dd></div>
        </dl>
      </section>

      <section className="landing-explore" aria-labelledby="landing-explore-title">
        <div><h2 id="landing-explore-title">Explore the system</h2></div>
        <nav aria-label="Explore Teum">
          <a href="#installation" onClick={(event) => { event.preventDefault(); onOpenDocumentation(); }}><span>01</span><strong>Start building</strong><ArrowRight aria-hidden="true" /></a>
          <a href="#button" onClick={(event) => { event.preventDefault(); onOpenComponents(); }}><span>02</span><strong>Choose a component</strong><ArrowRight aria-hidden="true" /></a>
          <a href="#patterns" onClick={(event) => { event.preventDefault(); onOpenPatterns(); }}><span>03</span><strong>Explore patterns</strong><ArrowRight aria-hidden="true" /></a>
        </nav>
      </section>
    </main>

    <footer className="landing-footer">
      <Brand />
      <div className="landing-footer__meta">
        <a href="https://www.minwookshin.com/" target="_blank" rel="noreferrer">made by minwook</a>
        <span>MIT licensed</span>
      </div>
    </footer>
  </div>;
}
