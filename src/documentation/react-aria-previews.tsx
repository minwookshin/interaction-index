import { parseDate } from "@internationalized/date";
import { Folder } from "@phosphor-icons/react";
import { DatePicker } from "../components/ui/date-picker";
import { ReorderableList } from "../components/ui/reorderable-list";
import { Tree, type TreeNode } from "../components/ui/tree";

export type ReactAriaPreviewId = "date-picker" | "tree" | "reorderable-list";

const projectTreeItems: readonly TreeNode[] = [
  {
    id: "workspace",
    label: "Interaction Index",
    description: "Design system workspace",
    icon: <Folder />,
    children: [
      { id: "foundations", label: "Foundations", description: "Color, type, space, motion" },
      {
        id: "components",
        label: "Components",
        description: "Public primitives",
        children: [
          { id: "controls", label: "Controls" },
          { id: "overlays", label: "Overlays" },
          { id: "data-display", label: "Data display" },
        ],
      },
      { id: "patterns", label: "Patterns", description: "Authored interactions" },
    ],
  },
  { id: "archive", label: "Archived drafts", disabled: true },
] as const;

const reorderableSeed = [
  { id: "capture", label: "Capture intent", description: "Name the user outcome" },
  { id: "compose", label: "Compose primitives", description: "Build from system contracts" },
  { id: "verify", label: "Verify behavior", description: "Keyboard, motion, and accessibility" },
  { id: "publish", label: "Publish candidate", description: "Ship only after release gates pass" },
] as const;

const stateTreeItems: readonly TreeNode[] = [
  {
    id: "system",
    label: "Components",
    children: [
      { id: "controls", label: "Controls" },
      { id: "overlays", label: "Overlays", disabled: true },
    ],
  },
];

const has = (state: string, ...parts: string[]) => parts.some((part) => state.toLocaleLowerCase().includes(part));

export function ReactAriaExample({ id }: { id: ReactAriaPreviewId }) {
  if (id === "date-picker") {
    return (
      <div className="date-picker-demo-grid" data-react-aria-preview-ready>
        <DatePicker label="Due date" defaultValue={parseDate("2026-08-21")} description="Dates follow the current locale and calendar." />
        <DatePicker label="Review date" defaultValue={parseDate("2026-08-28")} minValue={parseDate("2026-08-15")} />
        <DatePicker label="Invalid date" defaultValue={parseDate("2026-08-12")} errorMessage="Choose August 15 or later." isInvalid />
      </div>
    );
  }

  if (id === "tree") {
    return (
      <div className="react-aria-example" data-react-aria-preview-ready>
        <Tree aria-label="Project structure" items={projectTreeItems} defaultExpandedKeys={["workspace", "components"]} />
      </div>
    );
  }

  return (
    <div className="react-aria-example" data-react-aria-preview-ready>
      <ReorderableList aria-label="Release sequence" defaultItems={reorderableSeed} />
    </div>
  );
}

export function ReactAriaPrimaryPreview({ id }: { id: ReactAriaPreviewId }) {
  if (id === "date-picker") {
    return (
      <div className="primary-field-preview" data-react-aria-preview-ready>
        <DatePicker label="Due date" defaultValue={parseDate("2026-08-21")} description="Dates follow the current locale." />
      </div>
    );
  }

  if (id === "tree") {
    return (
      <div className="primary-tree-preview" data-react-aria-preview-ready>
        <Tree aria-label="Project structure" items={projectTreeItems} defaultExpandedKeys={["workspace"]} />
      </div>
    );
  }

  return (
    <div className="primary-reorderable-preview" data-react-aria-preview-ready>
      <ReorderableList aria-label="Release sequence" defaultItems={reorderableSeed.slice(0, 3)} />
    </div>
  );
}

export function ReactAriaStatePreview({ id, state }: { id: ReactAriaPreviewId; state: string }) {
  if (id === "date-picker") {
    const empty = has(state, "empty");
    const open = has(state, "open", "selected date", "unavailable date");
    return (
      <div className="state-date-picker" data-react-aria-preview-ready>
        <DatePicker
          aria-label={state}
          defaultValue={empty ? undefined : parseDate("2026-08-21")}
          isDisabled={has(state, "disabled")}
          isInvalid={has(state, "error")}
          errorMessage={has(state, "error") ? "Choose August 15 or later." : undefined}
          className={has(state, "focus") ? "state-forced-focus-within" : undefined}
        />
        {open && (
          <div className="state-calendar-card" aria-hidden="true">
            <strong>August 2026</strong>
            <div>
              {[17, 18, 19, 20, 21, 22, 23].map((day) => (
                <span
                  key={day}
                  data-selected={(day === 21 && !has(state, "unavailable")) || undefined}
                  data-unavailable={(day === 21 && has(state, "unavailable")) || undefined}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (id === "tree") {
    return (
      <div className="state-tree-preview" data-react-aria-preview-ready>
        <Tree
          aria-label={state}
          items={stateTreeItems}
          defaultExpandedKeys={has(state, "expanded", "selected", "hover", "focus", "disabled", "long") ? ["system"] : []}
          defaultSelectedKeys={has(state, "selected") ? ["controls"] : []}
        />
      </div>
    );
  }

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
