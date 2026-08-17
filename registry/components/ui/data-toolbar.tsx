"use client";

import "../../styles/teum-base.css";
import "../../styles/components/data-toolbar.css";
import { ArrowCounterClockwise, CaretDown, Check, FloppyDisk, SlidersHorizontal, Trash } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

export type DataToolbarProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  start?: ReactNode;
  end?: ReactNode;
};

export function DataToolbar({ label, start, end, className, ...props }: DataToolbarProps) {
  return <div className={cn("teum-data-toolbar", className)} role="toolbar" aria-label={label} {...props}><div className="teum-data-toolbar__start">{start}</div><div className="teum-data-toolbar__end">{end}</div></div>;
}

export type SavedView = {
  id: string;
  label: string;
  description?: string;
  count?: number;
  scope?: "system" | "personal";
};

export type SavedViewsProps = {
  views: readonly SavedView[];
  value: string;
  onValueChange: (value: string) => void;
  onSaveCurrent?: () => void;
  onUpdateCurrent?: () => void;
  onDeleteCurrent?: () => void;
  label?: string;
};

export function SavedViews({ views, value, onValueChange, onSaveCurrent, onUpdateCurrent, onDeleteCurrent, label = "View" }: SavedViewsProps) {
  const selected = views.find((view) => view.id === value) ?? views[0];
  const canManageCurrent = selected?.scope === "personal";
  return (
    <Menu>
      <MenuTrigger render={<Button size="small" variant="ghost" trailingIcon={<CaretDown />} aria-label={`${label}: ${selected?.label ?? "None"}`} />}>{selected?.label ?? label}</MenuTrigger>
      <MenuContent className="teum-saved-views" align="start">
        <MenuLabel>{label}</MenuLabel>
        <MenuRadioGroup value={value} onValueChange={(nextValue) => onValueChange(nextValue)}>
          {views.map((view) => <MenuRadioItem key={view.id} value={view.id} closeOnClick><span className="teum-saved-views__copy"><strong>{view.label}</strong>{view.description && <small>{view.description}</small>}</span>{typeof view.count === "number" && <small className="teum-saved-views__count">{view.count}</small>}</MenuRadioItem>)}
        </MenuRadioGroup>
        {(onSaveCurrent || (canManageCurrent && (onUpdateCurrent || onDeleteCurrent))) && <MenuSeparator />}
        {onSaveCurrent && <MenuItem onClick={onSaveCurrent}><FloppyDisk aria-hidden="true" />Save as new view</MenuItem>}
        {canManageCurrent && onUpdateCurrent && <MenuItem onClick={onUpdateCurrent}><ArrowCounterClockwise aria-hidden="true" />Update current view</MenuItem>}
        {canManageCurrent && onDeleteCurrent && <MenuItem className="teum-menu__item--danger" onClick={onDeleteCurrent}><Trash aria-hidden="true" />Delete current view</MenuItem>}
      </MenuContent>
    </Menu>
  );
}

export type ColumnManagerColumn = {
  id: string;
  label: string;
  visible: boolean;
  required?: boolean;
};

export type ColumnManagerProps = {
  columns: readonly ColumnManagerColumn[];
  onVisibilityChange: (id: string, visible: boolean) => void;
  onResetSizing?: () => void;
  label?: string;
};

export function ColumnManager({ columns, onVisibilityChange, onResetSizing, label = "Columns" }: ColumnManagerProps) {
  const visibleCount = columns.filter((column) => column.visible).length;
  return (
    <Menu>
      <MenuTrigger render={<Button size="small" variant="ghost" leadingIcon={<SlidersHorizontal />} aria-label={`${visibleCount} of ${columns.length} columns visible`} />}>{label}</MenuTrigger>
      <MenuContent className="teum-column-manager" align="end">
        <MenuLabel>Visible columns</MenuLabel>
        {columns.map((column) => <MenuCheckboxItem key={column.id} checked={column.visible} disabled={column.required} closeOnClick={false} onCheckedChange={(checked) => onVisibilityChange(column.id, checked)}>{column.label}{column.required && <span className="teum-column-manager__required"><Check aria-hidden="true" />Required</span>}</MenuCheckboxItem>)}
        {onResetSizing && <><MenuSeparator /><MenuItem onClick={onResetSizing}><ArrowCounterClockwise aria-hidden="true" />Reset column widths</MenuItem></>}
      </MenuContent>
    </Menu>
  );
}
