import {
  ArrowRight,
  Command,
} from "@phosphor-icons/react";
import { lazy, Suspense } from "react";
import { PublicHeaderActions } from "./public-header-actions";

type Theme = "light" | "dark";

const LandingCollectionPreview = lazy(() => import("./landing-preview").then((module) => ({ default: module.LandingCollectionPreview })));

function Brand() {
  return <div className="whatiuse-wordmark" aria-hidden="true"><strong>whatiuse</strong></div>;
}

export type LandingPageProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onOpenComponents: () => void;
};

export function LandingPage({
  theme,
  onThemeChange,
  onOpenComponents,
}: LandingPageProps) {
  return <div className="teum-landing">
    <a className="teum-skip-link" href="#teum-landing-content" onClick={(event) => {
      event.preventDefault();
      document.getElementById("teum-landing-content")?.focus({ preventScroll: true });
    }}>Skip to main content</a>

    <header className="landing-header">
      <Brand />
      <PublicHeaderActions theme={theme} onThemeChange={onThemeChange} />
    </header>

    <main id="teum-landing-content" tabIndex={-1}>
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__intro">
          <div className="landing-hero__mark" aria-hidden="true"><Command weight="bold" /></div>
          <h1 id="landing-title">whatiuse</h1>
          <p>Components for product interfaces.</p>
          <button className="landing-hero__primary" type="button" onClick={onOpenComponents}>
            <span>Browse components</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <Suspense fallback={<div className="landing-collection-preview landing-collection-preview--loading" role="status">Loading components</div>}>
          <LandingCollectionPreview />
        </Suspense>
      </section>
    </main>

    <footer className="landing-footer">
      <a href="https://www.minwookshin.com/" target="_blank" rel="noreferrer">made by minwook</a>
      <nav aria-label="Project links">
        <a href="https://github.com/minwookshin/whatiuse" target="_blank" rel="noreferrer">GitHub</a>
        <a href="#licensing">MIT License</a>
      </nav>
    </footer>
  </div>;
}
