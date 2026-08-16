import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Button,
  ButtonGroup,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Fieldset,
  FieldsetLegend,
  InputGroup,
  InputGroupButton,
  InputGroupInput,
  Kbd,
  KbdGroup,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Toolbar,
  ToolbarButton,
} from ".";

describe("form composition and action grouping", () => {
  it("keeps a field label, description, and error associated with its control", () => {
    render(
      <Field invalid>
        <FieldLabel>Project name</FieldLabel>
        <FieldControl />
        <FieldDescription>Visible to everyone.</FieldDescription>
        <FieldError>Use a unique name.</FieldError>
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Project name" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Visible to everyone. Use a unique name.");
  });

  it("exposes a fieldset legend as the related-control group name", () => {
    render(
      <Fieldset>
        <FieldsetLegend>Project metadata</FieldsetLegend>
        <Field><FieldLabel>Identifier</FieldLabel><FieldControl /></Field>
      </Fieldset>,
    );
    expect(screen.getByRole("group", { name: "Project metadata" })).toBeInTheDocument();
  });

  it("propagates disabled and invalid state through an input group", () => {
    render(
      <InputGroup disabled invalid>
        <InputGroupInput aria-label="Repository" />
        <InputGroupButton>Copy</InputGroupButton>
      </InputGroup>,
    );
    expect(screen.getByRole("textbox", { name: "Repository" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Repository" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled();
  });

  it("keeps keyboard hints presentational and outside the tab order", () => {
    const { container } = render(<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>);
    expect(container.querySelectorAll("kbd")).toHaveLength(2);
    expect(container.querySelector("[tabindex]")).toBeNull();
  });

  it("groups buttons without replacing their ordinary tab behavior", async () => {
    const user = userEvent.setup();
    render(<ButtonGroup aria-label="Issue actions" attached><Button>Preview</Button><Button>Open</Button></ButtonGroup>);
    expect(screen.getByRole("group", { name: "Issue actions" })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: "Preview" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("uses roving arrow-key focus inside a toolbar", async () => {
    const user = userEvent.setup();
    render(<Toolbar aria-label="Formatting"><ToolbarButton>Bold</ToolbarButton><ToolbarButton>Italic</ToolbarButton></Toolbar>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
  });

  it("opens a labelled edge sheet and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(<Sheet><SheetTrigger>Properties</SheetTrigger><SheetContent><SheetTitle>Issue properties</SheetTitle></SheetContent></Sheet>);
    const trigger = screen.getByRole("button", { name: "Properties" });
    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Issue properties" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await expect.poll(() => screen.queryByRole("dialog", { name: "Issue properties" })).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
