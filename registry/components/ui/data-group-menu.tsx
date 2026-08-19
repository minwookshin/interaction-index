"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/data-group-menu.css";
import { Rows, X } from "@phosphor-icons/react";
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

export type DataGroupOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type DataGroupMenuProps = {
  options: readonly DataGroupOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  label?: string;
  className?: string;
};

export function DataGroupMenu({ options, value, onValueChange, label = "Group", className }: DataGroupMenuProps) {
  const selected = options.find((option) => option.id === value);
  return (
    <span className={cn("whatiuse-data-group-menu", className)}>
      <Menu>
        <MenuTrigger render={<Button size="small" variant={value ? "secondary" : "ghost"} leadingIcon={<Rows />} aria-label={value ? `${label}: ${selected?.label}` : label} />}>
          {selected?.label ?? label}
        </MenuTrigger>
        <MenuContent className="whatiuse-data-group-menu__menu" align="start">
          <MenuLabel>Group by</MenuLabel>
          <MenuRadioGroup value={value ?? ""} onValueChange={(nextValue) => onValueChange(nextValue)}>
            {options.map((option) => <MenuRadioItem key={option.id} value={option.id} disabled={option.disabled}>{option.label}</MenuRadioItem>)}
          </MenuRadioGroup>
          {value && <><MenuSeparator /><MenuItem onClick={() => onValueChange(null)}><X aria-hidden="true" />Remove grouping</MenuItem></>}
        </MenuContent>
      </Menu>
    </span>
  );
}
