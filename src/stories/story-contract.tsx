import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { PrimaryPreviewFor, components, type ComponentId } from "../App";
import { componentGuidance } from "../component-guidance";
import { toast } from "../components/ui";
import { ComponentStatePreview, getStateFlags } from "../documentation/state-preview";

const catalog = new Map(components.map((component) => [component.id, component]));

export function ComponentStoryContract({ id }: { id: ComponentId }) {
  const component = catalog.get(id)!;
  const guidance = componentGuidance[id];
  return (
    <main className="story-contract" data-component-id={id}>
      <header className="story-contract__header">
        <div>
          <span>{component.group}</span>
          <h1>{component.name}</h1>
          <p>{component.description}</p>
        </div>
        <dl aria-label={`${component.name} contract summary`}>
          <div><dt>Source</dt><dd>{guidance.source}</dd></div>
          <div><dt>Maturity</dt><dd>{guidance.maturity}</dd></div>
          <div><dt>States</dt><dd>{guidance.states.length}</dd></div>
        </dl>
      </header>

      <section className="story-contract__product" aria-labelledby={`${id}-product-title`}>
        <div className="story-contract__section-heading">
          <div><span>Product preview</span><h2 id={`${id}-product-title`}>Interactive composition</h2></div>
          <p>Use pointer and keyboard input here. State proofs below stay inert and deterministic.</p>
        </div>
        <div className="story-contract__stage" role="group" aria-label={`${component.name} product preview`}>
          <PrimaryPreviewFor id={id} />
        </div>
      </section>

      <section className="story-contract__states" aria-labelledby={`${id}-states-title`}>
        <div className="story-contract__section-heading">
          <div><span>State contract</span><h2 id={`${id}-states-title`}>Behaviorally distinct proofs</h2></div>
          <p>{guidance.states.length} documented states share the same executable source used by the public docs.</p>
        </div>
        <div className="story-contract__state-grid" aria-hidden="true" inert>
          {guidance.states.map((state, index) => (
            <article className="story-contract__state" data-story-state={state} data-state-flags={getStateFlags(state)} key={state}>
              <span>{state}</span>
              <div><ComponentStatePreview id={id} state={state} index={index} /></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="story-contract__footer">
        <div><span>Keyboard</span><ul>{guidance.keyboard.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><span>Checks</span><ul>{guidance.quality.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </footer>
    </main>
  );
}

type PlayContext = { canvasElement: HTMLElement };

async function assertContract(id: ComponentId, canvasElement: HTMLElement) {
  const component = catalog.get(id)!;
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("heading", { level: 1, name: component.name })).toBeVisible();
  await expect(canvas.getByLabelText(`${component.name} product preview`)).toBeVisible();
  await expect(canvasElement.querySelectorAll("[data-story-state]")).toHaveLength(componentGuidance[id].states.length);
}

async function exerciseRiskyInteraction(id: ComponentId, canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const page = within(document.body);
  const productElement = canvas.getByLabelText(`${catalog.get(id)!.name} product preview`);
  const product = within(productElement);

  if (id === "date-picker" || id === "tree" || id === "reorderable-list") {
    await waitFor(
      () => expect(productElement.querySelector("[data-react-aria-preview-ready]")).not.toBeNull(),
      { timeout: 5_000 },
    );
  }

  if (id === "button") {
    const button = product.getByRole("button", { name: "Create issue" });
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  } else if (id === "icon-button") {
    const button = product.getByRole("button", { name: "Create item" });
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  } else if (id === "field") {
    const input = product.getByRole("textbox", { name: "Project name" });
    await userEvent.clear(input);
    await userEvent.type(input, "Teum");
    await expect(input).toHaveAccessibleDescription("Visible to everyone in the workspace.");
  } else if (id === "input-group") {
    const input = product.getByRole("textbox", { name: "Repository path" });
    await userEvent.clear(input);
    await userEvent.type(input, "minwook/teum");
    await expect(input).toHaveValue("minwook/teum");
    await expect(product.getByRole("button", { name: "Copy repository path" })).toBeEnabled();
  } else if (id === "kbd") {
    await expect(product.getByText("⌘")).toBeVisible();
    await expect(product.queryByRole("button")).toBeNull();
  } else if (id === "button-group") {
    const open = product.getByRole("button", { name: "Open" });
    await userEvent.click(open);
    await expect(open).toHaveFocus();
  } else if (id === "toolbar") {
    const bold = product.getByRole("button", { name: "Bold" });
    const italic = product.getByRole("button", { name: "Italic" });
    await userEvent.click(bold);
    await userEvent.keyboard("{ArrowRight}");
    await expect(italic).toHaveFocus();
  } else if (id === "text-field") {
    const input = product.getByRole("textbox", { name: "Handle" });
    await userEvent.clear(input);
    await userEvent.type(input, "teum");
    await expect(input).toHaveValue("teum");
  } else if (id === "textarea") {
    const input = product.getByRole("textbox", { name: "Description" });
    await userEvent.clear(input);
    await userEvent.type(input, "Document the interaction contract.");
    await expect(input).toHaveValue("Document the interaction contract.");
  } else if (id === "checkbox") {
    const input = product.getByRole("checkbox", { name: /Include interaction notes/ });
    await userEvent.click(input);
    await expect(input).not.toBeChecked();
    await userEvent.click(input);
    await expect(input).toBeChecked();
  } else if (id === "radio-group") {
    const input = product.getByRole("radio", { name: "Immediately" });
    await userEvent.click(input);
    await expect(input).toBeChecked();
  } else if (id === "switch") {
    const input = product.getByRole("switch", { name: /Interaction previews/ });
    await userEvent.click(input);
    await expect(input).not.toBeChecked();
    await userEvent.click(input);
    await expect(input).toBeChecked();
  } else if (id === "select") {
    const trigger = product.getByRole("combobox", { name: "Priority" });
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("option", { name: "Low" }));
    await expect(trigger).toHaveTextContent("Low");
    await waitFor(() => expect(document.querySelector("[data-base-ui-focus-guard]")).toBeNull());
  } else if (id === "context-switcher") {
    const trigger = product.getByRole("combobox", { name: "Preview platform" });
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("option", { name: /Native/ }));
    await expect(trigger).toHaveTextContent("Native");
    await waitFor(() => expect(document.querySelector("[data-base-ui-focus-guard]")).toBeNull());
  } else if (id === "combobox") {
    const input = product.getByRole("combobox", { name: "Assignee" });
    await userEvent.clear(input);
    await userEvent.type(input, "Avery");
    await userEvent.click(await page.findByRole("option", { name: /Avery Stone/ }));
    await expect(input).toHaveValue("Avery Stone");
    await waitFor(() => expect(document.querySelector("[data-base-ui-focus-guard]")).toBeNull());
  } else if (id === "search-input") {
    const input = product.getByRole("searchbox", { name: "Search" });
    await userEvent.type(input, "button");
    await expect(input).toHaveValue("button");
    await userEvent.clear(input);
  } else if (id === "number-field") {
    const input = product.getByRole("textbox", { name: "Quantity" });
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    await expect(input).toHaveValue("25");
  } else if (id === "date-picker") {
    await userEvent.click(product.getByRole("button", { name: /Open calendar/ }));
    const dialog = await page.findByRole("dialog");
    await waitFor(() => {
      expect(dialog.closest(".teum-date-picker__popover")).not.toHaveAttribute("data-entering");
      expect(dialog).toBeVisible();
    });
    await userEvent.keyboard("{Escape}");
  } else if (id === "context-menu") {
    const trigger = canvasElement.querySelector<HTMLElement>("[aria-label='Context Menu product preview'] .teum-context-menu__trigger");
    expect(trigger).not.toBeNull();
    fireEvent.contextMenu(trigger!);
    const menu = await page.findByRole("menu");
    await waitFor(() => {
      expect(menu).not.toHaveAttribute("data-starting-style");
      expect(menu).toBeVisible();
    });
    await userEvent.keyboard("{Escape}");
  } else if (id === "segmented-control") {
    const board = product.getByRole("button", { name: "Board" });
    await userEvent.click(board);
    await expect(board).toHaveAttribute("aria-pressed", "true");
  } else if (id === "tooltip") {
    const trigger = product.getByRole("button", { name: "Add to favorites" });
    await userEvent.hover(trigger);
    await waitFor(() => expect(document.querySelector(".teum-tooltip")).toHaveTextContent("Add to favorites"), { timeout: 2_000 });
    await userEvent.unhover(trigger);
    await waitFor(() => expect(document.querySelector(".teum-tooltip")).toBeNull());
  } else if (id === "popover") {
    await userEvent.click(product.getByRole("button", { name: "View" }));
    await waitFor(() => {
      const popup = document.querySelector<HTMLElement>(".teum-popover[data-open]");
      expect(popup).not.toBeNull();
      expect(popup).not.toHaveAttribute("data-starting-style");
      expect(within(popup!).getByRole("heading", { name: "View options" })).toBeVisible();
      expect(within(popup!).getByRole("switch", { name: "Show contracts" })).toBeVisible();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".teum-popover")).toBeNull());
  } else if (id === "menu") {
    await userEvent.click(product.getByRole("button", { name: "Actions" }));
    await waitFor(() => {
      const popup = document.querySelector<HTMLElement>(".teum-menu[data-open]");
      expect(popup).not.toBeNull();
      expect(popup).not.toHaveAttribute("data-starting-style");
      expect(within(popup!).getByRole("menuitem", { name: /Duplicate/ })).toBeVisible();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".teum-menu")).toBeNull());
  } else if (id === "dialog") {
    await userEvent.click(product.getByRole("button", { name: "Edit details" }));
    const dialog = await page.findByRole("dialog", { name: "Edit component details" });
    await waitFor(() => { expect(dialog).not.toHaveAttribute("data-starting-style"); expect(dialog).toBeVisible(); });
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Edit component details" })).toBeNull());
  } else if (id === "sheet") {
    await userEvent.click(product.getByRole("button", { name: "Properties" }));
    const dialog = await page.findByRole("dialog", { name: "Issue properties" });
    await waitFor(() => { expect(dialog).not.toHaveAttribute("data-starting-style"); expect(dialog).toBeVisible(); });
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Issue properties" })).toBeNull());
  } else if (id === "alert-dialog") {
    await userEvent.click(product.getByRole("button", { name: "Discard" }));
    const dialog = await page.findByRole("alertdialog", { name: "Discard this draft?" });
    await waitFor(() => { expect(dialog).not.toHaveAttribute("data-starting-style"); expect(dialog).toBeVisible(); });
    await userEvent.click(within(dialog).getByRole("button", { name: "Keep draft" }));
    await waitFor(() => expect(page.queryByRole("alertdialog", { name: "Discard this draft?" })).toBeNull());
  } else if (id === "tabs") {
    await userEvent.click(product.getByRole("tab", { name: "Activity" }));
    await expect(product.getByText("Recent activity")).toBeVisible();
  } else if (id === "pagination") {
    const next = product.getByRole("button", { name: "Next page" });
    await userEvent.click(next);
    await expect(product.getByRole("button", { name: "Page 4" })).toHaveAttribute("aria-current", "page");
  } else if (id === "collapsible") {
    const trigger = product.getByRole("button", { name: "Advanced filter rules" });
    await userEvent.click(trigger);
    await expect(product.getByText("State is ready")).toBeVisible();
    await expect(product.getByText("Owner is assigned")).toBeVisible();
    await userEvent.click(trigger);
  } else if (id === "toast") {
    await userEvent.click(product.getByRole("button", { name: "Show toast" }));
    await waitFor(() => expect(document.querySelector(".teum-toast__title")).toHaveTextContent("Component saved"));
    toast.dismiss();
    await waitFor(() => expect(document.querySelector(".teum-toast")).toBeNull());
  } else if (id === "badge") {
    await expect(product.getByText("In review")).toBeVisible();
  } else if (id === "avatar") {
    await expect(product.getByRole("group", { name: "Project members" })).toBeVisible();
  } else if (id === "tree") {
    const tree = product.getByRole("treegrid", { name: "Project structure" });
    await expect(tree).toBeVisible();
    await userEvent.click(await within(tree).findByText("whatiuse"));
    await expect(await within(tree).findByText("Foundations")).toBeVisible();
  } else if (id === "reorderable-list") {
    const handle = await product.findByRole("button", { name: "Move Capture intent" });
    handle.focus();
    await expect(handle).toHaveFocus();
  } else if (id === "inline-edit") {
    await userEvent.click(product.getByRole("button", { name: /Edit value: whatiuse/ }));
    const input = product.getByRole("textbox", { name: "Edit value" });
    await userEvent.clear(input);
    await userEvent.type(input, "Interaction System{Enter}");
    await waitFor(() => expect(product.getByRole("button", { name: /Interaction System/ })).toBeVisible());
  } else if (id === "action-list") {
    const input = product.getByRole("combobox", { name: "Search actions" });
    await userEvent.type(input, "archive");
    await expect(product.getByRole("option", { name: /Archive component/ })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Escape}");
  } else if (id === "shared-detail") {
    await userEvent.click(product.getByRole("button", { name: /Density audit/ }));
    await waitFor(() => expect(product.getByRole("heading", { name: "Density audit" })).toBeVisible());
    await userEvent.click(product.getByRole("button", { name: "Close detail" }));
    await waitFor(() => expect(product.queryByRole("heading", { name: "Density audit" })).toBeNull());
  } else if (id === "undo-stack") {
    await userEvent.click(product.getByRole("button", { name: "Archive" }));
    await userEvent.click(product.getByRole("button", { name: "Undo" }));
    await expect(product.getByText("INT-184 · In review")).toBeVisible();
  }
}

export function componentStory(id: ComponentId) {
  const component = catalog.get(id)!;
  return {
    name: component.name,
    render: () => <ComponentStoryContract id={id} />,
    parameters: {
      teum: {
        componentId: id,
      },
      docs: {
        description: {
          story: `${component.description} The product preview, distinct state contract, keyboard behavior, and review criteria are rendered from the same source as the public documentation.`,
        },
      },
    },
    play: async ({ canvasElement }: PlayContext) => {
      await assertContract(id, canvasElement);
      await exerciseRiskyInteraction(id, canvasElement);
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      canvasElement.dataset.storyReady = "true";
    },
  };
}
