import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { components } from "./App";
import { libraryComponents } from "./component-catalog";
import App from "./legacy-app";
import { componentGuidance } from "./component-guidance";

describe("design system workspace", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "#button");
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("shows design-system information architecture without product inbox chrome", () => {
    render(<App />);

    expect(screen.getByRole("complementary", { name: "Design system navigation" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Component catalog" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Page outline" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Button" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Install component" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete notification" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Inbox" })).not.toBeInTheDocument();
  });

  it("opens the live component Library as the default route", async () => {
    window.history.replaceState(null, "", window.location.pathname);
    render(<App />);

    expect(window.location.hash).toBe("");
    expect(screen.getByRole("heading", { level: 1, name: "components i use." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Library" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open documentation" })).toHaveAttribute("href", "#installation");
    expect(screen.getByRole("link", { name: "made by minwook" })).toHaveAttribute("href", "https://www.minwookshin.com/");
    expect(screen.queryByRole("complementary", { name: "Design system navigation" })).not.toBeInTheDocument();
  });

  it("keeps ownership visible while the text wordmark remains inert", () => {
    window.history.replaceState(null, "", "#components");
    const { container } = render(<App />);

    expect(screen.getByRole("link", { name: "made by minwook" })).toHaveAttribute("href", "https://www.minwookshin.com/");
    expect(screen.getByRole("link", { name: "MIT license" })).toHaveAttribute("href", "#licensing");
    const wordmark = container.querySelector<HTMLElement>(".whatiuse-wordmark");
    expect(wordmark).not.toBeNull();
    expect(wordmark).toHaveTextContent(/^whatiuse$/);
    expect(wordmark?.tagName).toBe("DIV");
    expect(wordmark).not.toHaveAttribute("href");
    expect(screen.queryByRole("link", { name: "whatiuse home" })).not.toBeInTheDocument();
    expect(container.querySelector(".whatiuse-wordmark svg")).toBeNull();
    expect(screen.getByRole("link", { name: "@minwook — portfolio" })).toHaveAttribute("href", "https://www.minwookshin.com/");
    expect(screen.getByRole("link", { name: "@minwook — portfolio" })).toHaveTextContent("@minwook");
    expect(container.querySelectorAll(".component-index-author__portraits img")).toHaveLength(3);
  });

  it("lists every component with an interactive preview and opens a URL-backed code inspector", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "#components");
    const { container } = render(<App />);

    expect(screen.getByRole("heading", { level: 2, name: "Library" })).toBeInTheDocument();
    expect(container.querySelectorAll(".component-index-row")).toHaveLength(libraryComponents.length);
    expect(container.querySelector('.component-index-row[data-component="kbd"]')).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Interaction$/ })).not.toBeInTheDocument();
    expect(container.querySelector('.component-index-row[data-component="shared-detail"]')).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy Button install command" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Button code" })).toHaveAttribute("href", "#components/button");
    expect(screen.getByRole("textbox", { name: "Search components" })).toHaveAttribute("placeholder", "Search components");
    expect(screen.queryByRole("group", { name: "Filter components by group" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Controls$/ })).not.toBeInTheDocument();
    expect(within(container.querySelector<HTMLElement>('.component-index-row[data-component="button"]')!).queryByText("Controls")).not.toBeInTheDocument();
    expect(container.querySelector("a button")).not.toBeInTheDocument();

    const search = screen.getByRole("textbox", { name: "Search components" });
    await user.type(search, "toast");
    expect(container.querySelectorAll(".component-index-row")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Open Toast code" })).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "table");
    expect(container.querySelectorAll(".component-index-row")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Open Table code" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open Button code" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Open Table code" }));
    expect(window.location.hash).toBe("#components/table");
    const inspector = screen.getByRole("dialog", { name: "Table" });
    expect(within(inspector).getByRole("tab", { name: "Source" })).toHaveAttribute("aria-selected", "true");
    expect(within(inspector).getByRole("button", { name: "React" })).toHaveAttribute("aria-pressed", "true");
    expect(await within(inspector).findByText("table.tsx", { exact: true })).toBeInTheDocument();
    expect(within(inspector).getByRole("button", { name: "Copy Table React source" })).toBeInTheDocument();
    await user.click(within(inspector).getByRole("button", { name: "CSS" }));
    expect(within(inspector).getByText("table.css", { exact: true })).toBeInTheDocument();
    expect(within(inspector).getByRole("region", { name: "Table CSS source" })).toHaveTextContent(".whatiuse-table");
    expect(within(inspector).getByRole("link", { name: "Accessibility & API" })).toHaveAttribute("href", "#table");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Table" })).not.toBeInTheDocument();
    expect(window.location.hash).toBe("#components");
  });

  it("keeps Data and Analytics as focused Library collections", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "#components");
    const { container } = render(<App />);

    await user.click(screen.getByRole("tab", { name: "Data" }));
    expect(container.querySelectorAll(".component-index-row")).toHaveLength(18);
    expect(screen.getByRole("link", { name: "Open Data Table code" })).toHaveAttribute("href", "#components/data-table");
    expect(screen.queryByRole("button", { name: "Controls" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Analytics" }));
    expect(container.querySelectorAll(".component-index-row")).toHaveLength(17);
    expect(screen.getByRole("link", { name: "Open Chart code" })).toHaveAttribute("href", "#components/chart");

    await user.click(screen.getByRole("link", { name: "Open Chart code" }));
    expect(window.location.hash).toBe("#components/chart");
    expect(within(screen.getByRole("dialog", { name: "Chart" })).getByRole("link", { name: "Accessibility & API" })).toHaveAttribute("href", "#analytics");
  });

  it("switches the live documentation when a component is selected", async () => {
    const user = userEvent.setup();
    render(<App />);
    const catalog = screen.getByRole("region", { name: "Component catalog" });

    await user.click(within(catalog).getByRole("link", { name: /^Menu$/ }));

    expect(screen.getByRole("heading", { level: 1, name: "Menu" })).toBeInTheDocument();
    expect(window.location.hash).toBe("#menu");
    expect(screen.queryByText("Authored behavior")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Menu reference summary")).toHaveTextContent("Base UI");
    expect(screen.getAllByText("Typeahead").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Accessibility" })).toBeInTheDocument();
  });

  it("keeps direct component routes inside the same system workspace", () => {
    window.history.replaceState(null, "", "#toast");
    render(<App />);

    expect(screen.getByRole("complementary", { name: "Design system navigation" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Component catalog" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Toast" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Full docs" })).not.toBeInTheDocument();
  });

  it("keeps a public foundation overview inside the same persistent shell", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^Foundations/ }));
    const catalog = screen.getByRole("region", { name: "Foundation catalog" });
    await user.click(within(catalog).getByRole("link", { name: "Overview" }));

    expect(window.location.hash).toBe("#foundations");
    expect(screen.getByRole("complementary", { name: "Design system navigation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Foundations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Typography" })).toBeInTheDocument();
    expect(screen.queryByText("Perception Lab")).not.toBeInTheDocument();
  });

  it("keeps navigation disclosures mounted while exposing only the open section", async () => {
    const user = userEvent.setup();
    render(<App />);

    const componentsTrigger = screen.getByRole("button", { name: /^Components/ });
    const componentCatalog = screen.getByRole("region", { name: "Component catalog" });
    expect(componentsTrigger).toHaveAttribute("aria-expanded", "true");
    expect(componentsTrigger).toHaveAttribute("aria-controls", componentCatalog.parentElement?.parentElement?.id);
    expect(componentCatalog.parentElement?.parentElement).not.toHaveAttribute("aria-hidden", "true");

    await user.click(screen.getByRole("button", { name: /^Foundations/ }));

    expect(componentsTrigger).toHaveAttribute("aria-expanded", "false");
    expect(componentCatalog.parentElement?.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(componentCatalog.parentElement?.parentElement).toHaveAttribute("inert");
    expect(screen.getByRole("region", { name: "Foundation catalog" })).toBeInTheDocument();
  });

  it("opens each foundation as a dedicated document route", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^Foundations/ }));
    const catalog = screen.getByRole("region", { name: "Foundation catalog" });
    await user.click(within(catalog).getByRole("link", { name: "Color" }));

    expect(window.location.hash).toBe("#foundation-color");
    expect(screen.getByRole("heading", { level: 1, name: "Color" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Semantic color tokens" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All foundations" })).toBeInTheDocument();
  });

  it("publishes one explicit surface and elevation decision contract", () => {
    window.history.replaceState(null, "", "#foundation-color");
    render(<App />);

    const contract = screen.getByRole("list", { name: "Surface and elevation decision contract" });
    expect(within(contract).getAllByRole("listitem")).toHaveLength(6);
    expect(contract).toHaveTextContent("Space");
    expect(contract).toHaveTextContent("Tone");
    expect(contract).toHaveTextContent("Stroke");
    expect(contract).toHaveTextContent("Flyout");
    expect(screen.getByText(/space → tone → stroke → elevation/i)).toBeInTheDocument();
  });

  it("gives authored interaction patterns their own index and detail structure", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^Patterns/ }));
    const patternCatalog = screen.getByRole("region", { name: "Pattern catalog" });
    await user.click(within(patternCatalog).getByRole("link", { name: "Overview" }));

    expect(window.location.hash).toBe("#patterns");
    expect(screen.getByRole("heading", { level: 1, name: "Patterns" })).toBeInTheDocument();
    const patternIndex = screen.getByLabelText("Interaction pattern index");
    await user.click(within(patternIndex).getByRole("link", { name: /Shared Detail/ }));

    expect(window.location.hash).toBe("#preserve-context");
    expect(screen.getByRole("heading", { level: 1, name: "Preserve context" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Preserve context playground" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay" })).toBeInTheDocument();
    expect(screen.getByText("Retarget a neighboring row")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Preserve context guidance" })).toBeInTheDocument();
    expect(screen.getAllByText("Behavior contract").length).toBeGreaterThan(0);
  });

  it("filters the component catalog from the keyboard search", async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole("textbox", { name: "Search documentation" });

    await user.type(search, "toast");

    const results = screen.getByRole("region", { name: "Documentation search results" });
    expect(within(results).getByRole("link", { name: /Toast/ })).toBeInTheDocument();
    expect(within(results).queryByRole("link", { name: /Button/ })).not.toBeInTheDocument();
  });

  it("keeps the complete component document sequential and readable", () => {
    const { container } = render(<App />);

    expect(screen.getByText("The user needs to start or confirm a discrete action.")).toBeInTheDocument();
    expect(screen.getAllByText("Tab to focus").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".guidance-marker")).toHaveLength(6);
    expect(screen.getByLabelText("Button reference summary")).toHaveTextContent("Button");
    expect(screen.getByLabelText("Button reference summary")).toHaveTextContent("whatiuse");
    expect(screen.getByLabelText("Button reference summary")).toHaveTextContent("Base UI");
    expect(screen.getByLabelText("Button reference summary")).toHaveTextContent("7 states");
    expect(screen.getByRole("table", { name: "Button API" })).toBeInTheDocument();
    expect(screen.getByLabelText("Button compatibility and confidence")).toHaveTextContent("React^18.2.0 || ^19.0.0");
    expect(screen.getByLabelText("Button compatibility and confidence")).toHaveTextContent("Not published");
    expect(screen.queryByRole("tab", { name: "Preview" })).not.toBeInTheDocument();
  });

  it("uses one location signal and keeps implementation metadata in Reference", () => {
    render(<App />);

    const actions = screen.getByRole("banner", { name: "Workspace actions" });
    const catalog = screen.getByRole("region", { name: "Component catalog" });
    expect(actions).toHaveTextContent("whatiuse");
    expect(actions).not.toHaveTextContent("Components");
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(within(catalog).getByRole("link", { name: "Button" })).toHaveAttribute("aria-current", "page");
    expect(within(catalog).getByRole("link", { name: "Icon Button" })).not.toHaveAttribute("aria-current");
    expect(screen.getByLabelText("Button reference summary")).toHaveTextContent("Base UI");
    expect(screen.getByLabelText("Button reference summary")).toHaveTextContent("whatiuse");
  });

  it("keeps a Library return, centered identity, GitHub, and theme in the documentation header", () => {
    const { container } = render(<App />);

    const outline = screen.getByRole("complementary", { name: "Page outline" });
    const headerActions = container.querySelector(".system-topbar__actions");
    expect(screen.queryByRole("button", { name: "Copy page link" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to component library" })).toHaveAttribute("href", "/");
    expect(headerActions).toContainElement(screen.getByRole("link", { name: "Back to component library" }));
    expect(container.querySelector(".system-brand")).not.toContainElement(screen.getByRole("link", { name: "Back to component library" }));
    expect(screen.getByRole("link", { name: "View whatiuse on GitHub" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open documentation" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "made by minwook" })).toHaveAttribute("href", "https://www.minwookshin.com/");
    expect(within(outline).getByRole("button", { name: "MIT license" })).toBeInTheDocument();
  });

  it("switches and persists the workspace theme", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    await user.click(screen.getByRole("button", { name: "Current theme: light. Switch to dark theme" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("whatiuse-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Current theme: dark. Switch to light theme" })).toBeInTheDocument();
  });

  it("reserves persistent focus treatment for keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.documentElement).toHaveAttribute("data-input-modality", "pointer");
    await user.tab();
    expect(document.documentElement).toHaveAttribute("data-input-modality", "keyboard");
    await user.click(screen.getByRole("textbox", { name: "Search documentation" }));
    expect(document.documentElement).toHaveAttribute("data-input-modality", "pointer");
  });

  it("renders exactly one radio specimen inside every radio-group state tile", () => {
    window.history.replaceState(null, "", "#radio-group");
    const { container } = render(<App />);
    const tiles = Array.from(container.querySelectorAll<HTMLElement>(".state-tile"));

    expect(tiles).toHaveLength(componentGuidance["radio-group"].states.length);
    for (const tile of tiles) expect(within(tile).getAllByRole("radio")).toHaveLength(1);
    expect(within(tiles[0]).getByRole("radio")).toHaveAttribute("aria-checked", "false");
    expect(within(tiles[1]).getByRole("radio")).toHaveAttribute("aria-checked", "true");
    const errorTile = container.querySelector<HTMLElement>('.state-tile[data-state="error"]')!;
    expect(within(errorTile).getByText("Choose one option.")).toBeInTheDocument();
  });

  it("pairs every live preview with collapsed implementation code", async () => {
    const user = userEvent.setup();
    render(<App />);

    const disclosure = screen.getByText("Show code").closest("details")!;
    expect(disclosure).not.toHaveAttribute("open");
    await user.click(screen.getByText("Show code"));
    expect(disclosure).toHaveAttribute("open");
    expect(await screen.findByText(/import \{ Button \} from "whatiuse"/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("keeps documentation copy controls visually icon-only", () => {
    render(<App />);

    const installCopy = screen.getByRole("button", { name: "Copy Button install command" });
    expect(installCopy).toHaveTextContent("");
    expect(installCopy.querySelector("svg")).toBeInTheDocument();
  });

  it("supports keyboard disclosure for implementation code", async () => {
    const user = userEvent.setup();
    render(<App />);
    const disclosure = screen.getByText("Show code").closest("summary")!;
    disclosure.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText(/import \{ Button \} from "whatiuse"/)).toBeInTheDocument();
  });

  it("returns to the preview when the user moves to another component", async () => {
    const user = userEvent.setup();
    render(<App />);
    const catalog = screen.getByRole("region", { name: "Component catalog" });

    await user.click(screen.getByText("Show code"));
    expect(screen.getByText("Show code").closest("details")).toHaveAttribute("open");
    await user.click(within(catalog).getByRole("link", { name: /^Dialog$/ }));

    expect(screen.getByRole("heading", { level: 1, name: "Dialog" })).toBeInTheDocument();
    expect(screen.getByText("Show code").closest("details")).not.toHaveAttribute("open");
  });

  it("documents the public API beside every component", () => {
    render(<App />);

    expect(screen.getByRole("table", { name: "Button API" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "variant" })).toBeInTheDocument();
    expect(screen.getByText('"primary" | "secondary" | "ghost" | "quiet"')).toBeInTheDocument();
  });

  it("publishes every component route with a component-specific state contract", () => {
    const { container } = render(<App />);
    const catalog = screen.getByRole("region", { name: "Component catalog" });
    const componentIds = new Set(components.map((component) => `#${component.id}`));
    expect(within(catalog).getAllByRole("link").filter((link) => componentIds.has(link.getAttribute("href") ?? ""))).toHaveLength(libraryComponents.length);
    expect(container.querySelectorAll(".state-tile")).toHaveLength(componentGuidance.button.states.length);
    expect(Object.keys(componentGuidance)).toHaveLength(components.length);
    for (const guidance of Object.values(componentGuidance)) {
      expect(guidance.states.length).toBeGreaterThanOrEqual(5);
      expect(guidance.states.length).toBeLessThanOrEqual(9);
      expect(new Set(guidance.states).size).toBe(guidance.states.length);
    }
  });

  it("switches the live specimen between product and truthful state modes", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const specimen = screen.getByRole("region", { name: "Live component specimen" });

    expect(within(specimen).getByRole("button", { name: "Product" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".live-specimen__preview")).toHaveAttribute("data-specimen", "context");
    await user.click(within(specimen).getByRole("button", { name: "State" }));
    expect(within(specimen).queryByRole("combobox", { name: "Preview state" })).not.toBeInTheDocument();
    await user.click(within(specimen).getByRole("button", { name: "Preview state: Default" }));
    const stateMenu = await screen.findByRole("menu");
    await user.click(within(stateMenu).getByRole("menuitemradio", { name: "Disabled" }));
    expect(within(specimen).getByLabelText("Disabled state preview")).toBeInTheDocument();
    expect(within(specimen).getByRole("button", { name: "Preview state: Disabled" })).toBeInTheDocument();
    expect(container.querySelector(".live-specimen__preview")).toHaveAttribute("data-specimen", "compact");
  });

  it("keeps state-contract examples inert and reserves focus styling for explicit focus states", () => {
    const { container } = render(<App />);
    const previews = Array.from(container.querySelectorAll<HTMLElement>(".state-tile__preview"));

    expect(previews).toHaveLength(componentGuidance.button.states.length);
    for (const preview of previews) expect(preview).toHaveAttribute("inert");
    expect(container.querySelector('.state-tile[data-state="default"]')).not.toHaveAttribute("data-state-flags", expect.stringContaining("focus"));
    expect(container.querySelector('.state-tile[data-state="focus"]')).toHaveAttribute("data-state-flags", expect.stringContaining("focus"));
  });

  it("uses one ordered two-column-ready state board without subgroup singleton rows", () => {
    window.history.replaceState(null, "", "#icon-button");
    const { container } = render(<App />);
    const gallery = screen.getByRole("list", { name: "Icon Button state contract" });
    const tiles = within(gallery).getAllByRole("listitem");

    expect(container.querySelector(".state-contract-group")).not.toBeInTheDocument();
    expect(tiles).toHaveLength(componentGuidance["icon-button"].states.length);
    expect(tiles.map((tile) => tile.getAttribute("data-state"))).toEqual(["default", "hover", "pressed", "focus", "loading", "disabled", "tooltip"]);
  });

  it("models trigger-and-surface states as one centered documentation composition", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "#context-switcher");
    const { container } = render(<App />);
    const catalog = screen.getByRole("region", { name: "Component catalog" });

    expect(container.querySelectorAll(".state-control-stack > .state-inline-surface")).toHaveLength(3);
    expect(container.querySelector(".whatiuse-context-switcher__popup")).not.toBeInTheDocument();

    await user.click(within(catalog).getByRole("link", { name: "Popover" }));
    expect(container.querySelectorAll('.state-overlay-stack[data-composition="compound"]')).toHaveLength(componentGuidance.popover.states.length);

    await user.click(within(catalog).getByRole("link", { name: "Tooltip" }));
    expect(container.querySelector('.state-overlay-stack[data-composition="compound"]')).not.toBeInTheDocument();
  });

  it("publishes the shared component DNA in the spacing foundation", () => {
    window.history.replaceState(null, "", "#foundation-spacing");
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Spacing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "One grammar, six anchor components" })).toBeInTheDocument();
    expect(screen.getByLabelText("Component DNA contract")).toHaveTextContent("28 / 32 / 36");
    expect(screen.getByLabelText("Component DNA contract")).toHaveTextContent("control / raised / overlay");
  });

  it("keeps overlay specimens closed until the user presses a trigger", async () => {
    const user = userEvent.setup();
    render(<App />);
    const catalog = screen.getByRole("region", { name: "Component catalog" });
    await user.click(within(catalog).getByRole("link", { name: "Popover" }));
    expect(screen.queryByRole("dialog", { name: "View options" })).not.toBeInTheDocument();
  });

  it("keeps authored specimen ids unique when the same component appears more than once", () => {
    window.history.replaceState(null, "", "#shared-detail");
    const { container } = render(<App />);
    const ids = Array.from(container.querySelectorAll<HTMLElement>("[id]"), (element) => element.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(within(screen.getByRole("region", { name: "Live component specimen" })).getByRole("region", { name: "Shared Detail product context" })).toBeInTheDocument();
  });

  it("keeps the table recipe truthful across sorting, paging, and empty filtering", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "#table");
    render(<App />);
    const specimen = screen.getByRole("region", { name: "Live component specimen" });
    const table = within(specimen).getByRole("table", { name: "Interaction quality issues" });
    const issueHeader = within(table).getByRole("columnheader", { name: "Issue" });

    expect(issueHeader).toHaveAttribute("aria-sort", "descending");
    await user.click(within(issueHeader).getByRole("button", { name: "Sort issues ascending" }));
    expect(issueHeader).toHaveAttribute("aria-sort", "ascending");

    const pagination = within(specimen).getByRole("navigation", { name: "Issue table preview pages" });
    await user.click(within(pagination).getByRole("button", { name: "Next page" }));
    expect(within(specimen).getByText("Page 2 of 3")).toBeInTheDocument();

    await user.type(within(specimen).getByRole("searchbox", { name: "Filter issues" }), "no-such-issue");
    expect(within(specimen).getByText("No matching issues")).toBeInTheDocument();
    expect(within(specimen).getByText("Page 1 of 1")).toBeInTheDocument();
  });
});
