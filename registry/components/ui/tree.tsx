"use client";

import "../../styles/teum-base.css";
import "../../styles/components/tree.css";
import {
  Button as AriaButton,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent,
  type Key,
  type TreeProps as AriaTreeProps,
} from "react-aria-components";
import { CaretRight, File, Folder } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TreeNode = {
  id: Key;
  label: string;
  description?: string;
  icon?: ReactNode;
  children?: readonly TreeNode[];
  disabled?: boolean;
};

export type TreeProps = Omit<AriaTreeProps<TreeNode>, "children" | "className" | "items"> & {
  items: readonly TreeNode[];
  className?: string;
};

function TreeNodeItem({ node }: { node: TreeNode }) {
  const hasChildren = Boolean(node.children?.length);
  return (
    <AriaTreeItem id={node.id} textValue={node.label} isDisabled={node.disabled}>
      <TreeItemContent>
        {({ isExpanded, level }) => (
          <div className="teum-tree__row" style={{ "--teum-tree-indent": `${Math.max(0, level - 1) * 18}px` } as React.CSSProperties}>
            {hasChildren ? (
              <AriaButton slot="chevron" className="teum-tree__chevron" data-visible data-expanded={isExpanded || undefined}>
                <CaretRight aria-hidden="true" />
              </AriaButton>
            ) : <span className="teum-tree__chevron" aria-hidden="true"><CaretRight /></span>}
            <span className="teum-tree__icon" aria-hidden="true">{node.icon ?? (hasChildren ? <Folder /> : <File />)}</span>
            <span className="teum-tree__copy">
              <span className="teum-tree__label">{node.label}</span>
              {node.description && <span className="teum-tree__description">{node.description}</span>}
            </span>
          </div>
        )}
      </TreeItemContent>
      {node.children?.map((child) => <TreeNodeItem key={child.id} node={child} />)}
    </AriaTreeItem>
  );
}

export function Tree({ items, className, selectionMode = "single", ...props }: TreeProps) {
  return (
    <AriaTree className={cn("teum-tree", className)} selectionMode={selectionMode} {...props}>
      {items.map((item) => <TreeNodeItem key={item.id} node={item} />)}
    </AriaTree>
  );
}
