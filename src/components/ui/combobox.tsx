import { CaretDown, Check, X } from "@phosphor-icons/react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { useId } from "react";
import { cn } from "../../lib/cn";

export type ComboboxOption = { label: string; value: string; description?: string; disabled?: boolean };

export type ComboboxProps = Omit<ComboboxPrimitive.Root.Props<ComboboxOption>, "children" | "items" | "aria-label"> & {
  label?: string;
  "aria-label"?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  options: readonly ComboboxOption[];
  className?: string;
  ref?: ComboboxPrimitive.Input.Props["ref"];
};

export function Combobox({ label, "aria-label": ariaLabel, description, error, placeholder = "Search options…", options, className, ref, ...props }: ComboboxProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="teum-field teum-combobox-field" data-invalid={Boolean(error) || undefined}>
      {label && <label className="teum-field__label" htmlFor={id}>{label}</label>}
      <ComboboxPrimitive.Root items={[...options]} itemToStringLabel={(option) => option.label} itemToStringValue={(option) => option.value} {...props}>
        <ComboboxPrimitive.InputGroup className={cn("teum-combobox", className)}>
          <ComboboxPrimitive.Input ref={ref} id={id} className="teum-combobox__input" placeholder={placeholder} aria-label={label ? undefined : ariaLabel} aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined} aria-invalid={Boolean(error) || undefined} />
          <ComboboxPrimitive.Clear className="teum-combobox__action" aria-label="Clear selection"><X /></ComboboxPrimitive.Clear>
          <ComboboxPrimitive.Trigger className="teum-combobox__action teum-combobox__trigger" aria-label="Show options"><CaretDown /></ComboboxPrimitive.Trigger>
        </ComboboxPrimitive.InputGroup>
        <ComboboxPrimitive.Portal>
          <ComboboxPrimitive.Positioner className="teum-positioner" sideOffset={5} align="start">
            <ComboboxPrimitive.Popup className="teum-combobox-popup" data-layer="flyout">
              <ComboboxPrimitive.Empty className="teum-combobox-empty">No matching options</ComboboxPrimitive.Empty>
              <ComboboxPrimitive.List className="teum-combobox-list" aria-label={`${label ?? ariaLabel ?? "Combobox"} options`}>
                {(option: ComboboxOption, index: number) => (
                  <ComboboxPrimitive.Item className="teum-combobox-item" key={option.value} value={option} index={index} disabled={option.disabled}>
                    <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
                    <ComboboxPrimitive.ItemIndicator className="teum-combobox-item__indicator"><Check weight="bold" /></ComboboxPrimitive.ItemIndicator>
                  </ComboboxPrimitive.Item>
                )}
              </ComboboxPrimitive.List>
            </ComboboxPrimitive.Popup>
          </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
      </ComboboxPrimitive.Root>
      {description && <div id={descriptionId} className="teum-field__description">{description}</div>}
      {error && <div id={errorId} className="teum-field__error">{error}</div>}
    </div>
  );
}
