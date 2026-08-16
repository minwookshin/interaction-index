import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { UndoBar, UndoStackProvider, useUndoStack } from "./undo-stack";

function Harness() {
  const [items, setItems] = useState(["Alpha", "Beta"]);
  const { pushUndo } = useUndoStack();
  const archive = (label: string) => {
    const index = items.indexOf(label);
    setItems((current) => current.filter((item) => item !== label));
    pushUndo({ label: `Archived ${label}`, undo: () => setItems((current) => [...current.slice(0, index), label, ...current.slice(index)]) });
  };
  return <><div>{items.map((item) => <button key={item} onClick={() => archive(item)}>Archive {item}</button>)}</div><UndoBar /></>;
}

describe("UndoStack", () => {
  it("restores exactly one mutation and does not duplicate under Strict Mode", async () => {
    const user = userEvent.setup();
    render(<UndoStackProvider><Harness /></UndoStackProvider>);
    await user.click(screen.getByRole("button", { name: "Archive Alpha" }));
    expect(screen.queryByRole("button", { name: "Archive Alpha" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getAllByRole("button", { name: "Archive Alpha" })).toHaveLength(1);
  });

  it("supports the Cmd/Ctrl+Z recovery path", async () => {
    const user = userEvent.setup();
    render(<UndoStackProvider><Harness /></UndoStackProvider>);
    await user.click(screen.getByRole("button", { name: "Archive Beta" }));
    await user.keyboard("{Control>}z{/Control}");
    expect(screen.getByRole("button", { name: "Archive Beta" })).toBeInTheDocument();
  });

  it("pops one LIFO entry even when product-supplied identifiers repeat", async () => {
    const user = userEvent.setup();
    const undoFirst = vi.fn();
    const undoSecond = vi.fn();

    function DuplicateIdHarness() {
      const { pushUndo } = useUndoStack();
      return <>
        <button onClick={() => pushUndo({ id: "archive", label: "First", undo: undoFirst })}>Push first</button>
        <button onClick={() => pushUndo({ id: "archive", label: "Second", undo: undoSecond })}>Push second</button>
        <UndoBar />
      </>;
    }

    render(<UndoStackProvider><DuplicateIdHarness /></UndoStackProvider>);
    await user.click(screen.getByRole("button", { name: "Push first" }));
    await user.click(screen.getByRole("button", { name: "Push second" }));
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(undoSecond).toHaveBeenCalledOnce();
    expect(undoFirst).not.toHaveBeenCalled();
    expect(screen.getByRole("region", { name: "Undo history" })).toHaveTextContent("First");
  });
});
