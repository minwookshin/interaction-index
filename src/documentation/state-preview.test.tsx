import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { componentGuidance, type ComponentGuidanceId } from "../component-guidance";
import { TooltipProvider } from "../components/ui";
import { ComponentStatePreview, getStateFlags } from "./state-preview";

afterEach(cleanup);

function renderState(id: ComponentGuidanceId, state: string, index = 0) {
  return render(
    <TooltipProvider>
      <ComponentStatePreview id={id} state={state} index={index} />
    </TooltipProvider>,
  );
}

describe("component state documentation", () => {
  it("renders every documented state for every public component", () => {
    for (const [id, guidance] of Object.entries(componentGuidance) as [ComponentGuidanceId, (typeof componentGuidance)[ComponentGuidanceId]][]) {
      guidance.states.forEach((state, index) => {
        const { container, unmount } = renderState(id, state, index);
        expect(container.firstElementChild, `${id}: ${state}`).not.toBeNull();
        expect(container.querySelector(".state-preview__fallback"), `${id}: ${state}`).toBeNull();
        unmount();
      });
    }
  });

  it("shows one radio option per state without substring state collisions", () => {
    const unchecked = renderState("radio-group", "Unchecked");
    expect(screen.getAllByRole("radio")).toHaveLength(1);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "false");
    unchecked.unmount();

    const checked = renderState("radio-group", "Checked");
    expect(screen.getAllByRole("radio")).toHaveLength(1);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true");
    checked.unmount();

    const error = renderState("radio-group", "Error");
    expect(screen.getAllByRole("radio")).toHaveLength(1);
    expect(screen.getByText("Choose one option.")).toBeInTheDocument();
    error.unmount();

    const disabled = renderState("radio-group", "Disabled item");
    expect(screen.getAllByRole("radio")).toHaveLength(1);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-disabled", "true");
  });

  it("uses exact state names when deriving selected-state flags", () => {
    expect(getStateFlags("Checked")).toContain("selected");
    expect(getStateFlags("Unchecked")).not.toContain("selected");
    expect(getStateFlags("Active")).toContain("selected");
    expect(getStateFlags("Inactive")).not.toContain("selected");
    expect(getStateFlags("Long label")).not.toContain("selected");
  });

  it("keeps disabled form states behaviorally disabled in the live contract", () => {
    const combobox = renderState("combobox", "Disabled");
    expect(screen.getByRole("combobox", { name: "Disabled" })).toBeDisabled();
    combobox.unmount();

    renderState("search-input", "Disabled");
    expect(screen.getByRole("searchbox", { name: "Disabled" })).toBeDisabled();
  });
});
