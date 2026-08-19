"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/row-actions-menu.css";
import { DotsThree } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "./menu";

export type RowAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
};

export type RowActionsMenuProps = {
  label: string;
  actions: readonly RowAction[];
  onAction: (action: RowAction) => void;
  className?: string;
};

export function RowActionsMenu({ label, actions, onAction, className }: RowActionsMenuProps) {
  return (
    <span className={cn("whatiuse-row-actions-menu", className)}>
      <Menu>
        <MenuTrigger render={<IconButton size="small" variant="ghost" aria-label={label}><DotsThree weight="bold" /></IconButton>} />
        <MenuContent className="whatiuse-row-actions-menu__menu" align="end">
          {actions.map((action) => (
            <span key={action.id} className="whatiuse-row-actions-menu__entry">
              {action.separatorBefore && <MenuSeparator />}
              <MenuItem className={action.destructive ? "whatiuse-menu__item--danger" : undefined} disabled={action.disabled} onClick={() => onAction(action)}>
                {action.icon && <span aria-hidden="true">{action.icon}</span>}
                {action.label}
              </MenuItem>
            </span>
          ))}
        </MenuContent>
      </Menu>
    </span>
  );
}
