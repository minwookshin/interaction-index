import { ReorderableList } from "../components/ui/reorderable-list";

const reorderableSeed = [
  { id: "capture", label: "Capture intent", description: "Name the user outcome" },
  { id: "compose", label: "Compose primitives", description: "Build from system contracts" },
  { id: "verify", label: "Verify behavior", description: "Keyboard, motion, and accessibility" },
  { id: "publish", label: "Publish candidate", description: "Ship only after release gates pass" },
] as const;

const has = (state: string, ...parts: string[]) => parts.some((part) => state.toLocaleLowerCase().includes(part));

export function ReorderableListExample() {
  return (
    <div className="react-aria-example" data-react-aria-preview-ready>
      <ReorderableList aria-label="Release sequence" defaultItems={reorderableSeed} />
    </div>
  );
}

export function ReorderableListPrimaryPreview() {
  return (
    <div className="primary-reorderable-preview" data-react-aria-preview-ready>
      <ReorderableList aria-label="Release sequence" defaultItems={reorderableSeed.slice(0, 3)} />
    </div>
  );
}

export function ReorderableListStatePreview({ state }: { state: string }) {
  return (
    <div className="state-reorderable-preview" data-react-aria-preview-ready>
      <ReorderableList
        aria-label={state}
        defaultItems={[
          { id: "capture", label: "Capture intent" },
          { id: "compose", label: "Compose primitives", disabled: has(state, "disabled") },
          { id: "verify", label: "Verify behavior" },
        ]}
        className={has(state, "dragging", "keyboard dragging") ? "state-reorderable--dragging" : has(state, "drop before", "drop after") ? "state-reorderable--drop" : undefined}
      />
    </div>
  );
}
