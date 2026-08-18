import { BookOpenText, GithubLogo, Moon, Sun } from "@phosphor-icons/react";
import type { Theme } from "./App";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui";

type PublicHeaderActionsProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

export function PublicHeaderActions({ theme, onThemeChange }: PublicHeaderActionsProps) {
  return (
    <TooltipProvider delay={320}>
      <div className="landing-header__actions">
        <Tooltip>
          <TooltipTrigger render={<a className="landing-icon-action" href="https://github.com/minwookshin/teum" target="_blank" rel="noreferrer" aria-label="View Teum on GitHub"><GithubLogo weight="fill" aria-hidden="true" /></a>} />
          <TooltipContent side="bottom" sideOffset={8}>GitHub</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<a className="landing-icon-action" href="#installation" aria-label="Open documentation"><BookOpenText aria-hidden="true" /></a>} />
          <TooltipContent side="bottom" sideOffset={8}>Documentation</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<button type="button" className="landing-icon-action" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button>} />
          <TooltipContent side="bottom" sideOffset={8}>{theme === "light" ? "Dark mode" : "Light mode"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
