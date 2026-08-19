"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/data-sort-menu.css";
import { ArrowDown, ArrowUp, ArrowsDownUp, X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

export type DataSortOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type DataSortValue = {
  id: string;
  direction: "asc" | "desc";
};

export type DataSortMenuProps = {
  options: readonly DataSortOption[];
  value: DataSortValue | null;
  onValueChange: (value: DataSortValue | null) => void;
  label?: string;
  className?: string;
};

export function DataSortMenu({ options, value, onValueChange, label = "Sort", className }: DataSortMenuProps) {
  const selected = options.find((option) => option.id === value?.id);
  const direction = value?.direction ?? "asc";
  return (
    <span className={cn("whatiuse-data-sort-menu", className)}>
      <Menu>
        <MenuTrigger
          render={<Button size="small" variant={value ? "secondary" : "ghost"} leadingIcon={<ArrowsDownUp />} aria-label={value ? `${label}: ${selected?.label}, ${direction === "asc" ? "ascending" : "descending"}` : label} />}
        >
          {selected?.label ?? label}
        </MenuTrigger>
        <MenuContent className="whatiuse-data-sort-menu__menu" align="start">
          <MenuLabel>Sort by</MenuLabel>
          <MenuRadioGroup
            value={value?.id ?? ""}
            onValueChange={(id) => onValueChange({ id, direction })}
          >
            {options.map((option) => (
              <MenuRadioItem key={option.id} value={option.id} disabled={option.disabled} closeOnClick={false}>
                {option.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuLabel>Direction</MenuLabel>
          <MenuRadioGroup
            value={direction}
            onValueChange={(nextDirection) => onValueChange({ id: value?.id ?? options[0]?.id ?? "", direction: nextDirection as "asc" | "desc" })}
          >
            <MenuRadioItem value="asc" closeOnClick={false}><ArrowUp aria-hidden="true" />Ascending</MenuRadioItem>
            <MenuRadioItem value="desc" closeOnClick={false}><ArrowDown aria-hidden="true" />Descending</MenuRadioItem>
          </MenuRadioGroup>
          {value && <><MenuSeparator /><MenuItem onClick={() => onValueChange(null)}><X aria-hidden="true" />Clear sort</MenuItem></>}
        </MenuContent>
      </Menu>
    </span>
  );
}
