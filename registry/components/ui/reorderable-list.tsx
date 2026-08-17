"use client";

import "../../styles/teum-base.css";
import "../../styles/components/reorderable-list.css";
import {
  Button as AriaButton,
  DropIndicator,
  GridList,
  GridListItem,
  useDragAndDrop,
  type DroppableCollectionReorderEvent,
  type GridListProps,
  type Key,
} from "react-aria-components";
import { DotsSixVertical } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "../../lib/cn";

export type ReorderableItem = {
  id: Key;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type ReorderableListProps = Omit<GridListProps<ReorderableItem>, "children" | "className" | "dragAndDropHooks" | "items"> & {
  items?: readonly ReorderableItem[];
  defaultItems?: readonly ReorderableItem[];
  onItemsChange?: (items: ReorderableItem[]) => void;
  className?: string;
};

function reorder(items: readonly ReorderableItem[], event: DroppableCollectionReorderEvent) {
  const moving = items.filter((item) => event.keys.has(item.id));
  const remaining = items.filter((item) => !event.keys.has(item.id));
  const targetIndex = remaining.findIndex((item) => item.id === event.target.key);
  const insertIndex = targetIndex < 0
    ? remaining.length
    : targetIndex + (event.target.dropPosition === "before" ? 0 : 1);
  return [...remaining.slice(0, insertIndex), ...moving, ...remaining.slice(insertIndex)];
}

export function ReorderableList({ items: controlledItems, defaultItems = [], onItemsChange, className, layout = "stack", ...props }: ReorderableListProps) {
  const [uncontrolledItems, setUncontrolledItems] = useState<ReorderableItem[]>([...defaultItems]);
  const items = controlledItems ?? uncontrolledItems;
  const { dragAndDropHooks } = useDragAndDrop<ReorderableItem>({
    getItems: (keys, sourceItems) => sourceItems
      .filter((item) => keys.has(item.id))
      .map((item) => ({ "text/plain": item.label, "application/x-teum-item": String(item.id) })),
    onReorder: (event) => {
      const nextItems = reorder(items, event);
      if (!controlledItems) setUncontrolledItems(nextItems);
      onItemsChange?.(nextItems);
    },
    renderDropIndicator: (target) => <DropIndicator className="teum-reorderable__drop-indicator" target={target} />,
    renderDragPreview: (draggedItems) => (
      <div className="teum-reorderable__preview">{draggedItems.length > 1 ? `${draggedItems.length} items` : draggedItems[0]?.["text/plain"]}</div>
    ),
  });

  return (
    <GridList
      className={cn("teum-reorderable", className)}
      dragAndDropHooks={dragAndDropHooks}
      items={items}
      layout={layout}
      selectionMode="multiple"
      {...props}
    >
      {(item) => (
        <GridListItem className="teum-reorderable__item" id={item.id} textValue={item.label} isDisabled={item.disabled}>
          <AriaButton slot="drag" className="teum-reorderable__handle" aria-label={`Move ${item.label}`}>
            <DotsSixVertical aria-hidden="true" />
          </AriaButton>
          <span className="teum-reorderable__copy">
            <span className="teum-reorderable__label">{item.label}</span>
            {item.description && <span className="teum-reorderable__description">{item.description}</span>}
          </span>
        </GridListItem>
      )}
    </GridList>
  );
}
