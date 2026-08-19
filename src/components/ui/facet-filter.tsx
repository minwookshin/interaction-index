import { FunnelSimple, X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

export type FacetFilterOption = {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type FacetFilterProps = {
  label: string;
  options: readonly FacetFilterOption[];
  values: readonly string[];
  onValuesChange: (values: readonly string[]) => void;
  className?: string;
};

export function FacetFilter({ label, options, values, onValuesChange, className }: FacetFilterProps) {
  const selected = new Set(values);
  const toggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...values.filter((item) => item !== value), value]
      : values.filter((item) => item !== value);
    onValuesChange(next);
  };

  return (
    <span className={cn("whatiuse-facet-filter", className)}>
      <Menu>
        <MenuTrigger
          render={(
            <Button
              size="small"
              variant={values.length > 0 ? "secondary" : "ghost"}
              leadingIcon={<FunnelSimple />}
              aria-label={`${label}: ${values.length > 0 ? `${values.length} selected` : "Any"}`}
            />
          )}
        >
          <span className="whatiuse-facet-filter__trigger-content">
            <span>{label}</span>
            {values.length > 0 && <span className="whatiuse-facet-filter__count" aria-hidden="true">{values.length}</span>}
          </span>
        </MenuTrigger>
        <MenuContent className="whatiuse-facet-filter__menu" align="start">
          <MenuLabel>{label}</MenuLabel>
          {options.map((option) => (
            <MenuCheckboxItem
              key={option.value}
              checked={selected.has(option.value)}
              disabled={option.disabled}
              closeOnClick={false}
              onCheckedChange={(checked) => toggle(option.value, checked)}
            >
              <span className="whatiuse-facet-filter__option">
                <span>{option.label}</span>
                {typeof option.count === "number" && <small>{option.count}</small>}
              </span>
            </MenuCheckboxItem>
          ))}
          {values.length > 0 && (
            <>
              <MenuSeparator />
              <MenuItem onClick={() => onValuesChange([])}>
                <X aria-hidden="true" />Clear {label.toLocaleLowerCase()}
              </MenuItem>
            </>
          )}
        </MenuContent>
      </Menu>
    </span>
  );
}
