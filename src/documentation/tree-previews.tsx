import { Folder } from "@phosphor-icons/react";
import { Tree, type TreeNode } from "../components/ui/tree";

const projectTreeItems: readonly TreeNode[] = [
  {
    id: "workspace",
    label: "whatiuse",
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
        ],
      },
      { id: "patterns", label: "Patterns", description: "Interaction patterns" },
    ],
  },
  { id: "archive", label: "Archived drafts", disabled: true },
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

export function TreeExample() {
  return (
    <div className="react-aria-example" data-react-aria-preview-ready>
      <Tree aria-label="Project structure" items={projectTreeItems} defaultExpandedKeys={["workspace", "components"]} />
    </div>
  );
}

export function TreePrimaryPreview() {
  return (
    <div className="primary-tree-preview" data-react-aria-preview-ready>
      <Tree aria-label="Project structure" items={projectTreeItems} defaultExpandedKeys={["workspace"]} />
    </div>
  );
}

export function TreeStatePreview({ state }: { state: string }) {
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
