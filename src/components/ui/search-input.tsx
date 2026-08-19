import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  loading?: boolean;
  onClear?: () => void;
  shortcut?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({ id: providedId, label = "Search", loading, onClear, shortcut, className, value, defaultValue, onChange, ...props }, ref) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const controlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => String(defaultValue ?? ""));
  const currentValue = controlled ? String(value ?? "") : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  return (
    <div className="whatiuse-search-field">
      <label className="whatiuse-sr-only" htmlFor={id}>{label}</label>
      <div className={cn("whatiuse-search", className)} data-loading={loading || undefined}>
        {loading ? <span className="whatiuse-spinner whatiuse-search__spinner" aria-hidden="true" /> : <MagnifyingGlass className="whatiuse-search__icon" aria-hidden="true" />}
        <input
          ref={ref}
          id={id}
          type="search"
          value={controlled ? value : uncontrolledValue}
          aria-busy={loading || undefined}
          onChange={(event) => {
            if (!controlled) setUncontrolledValue(event.currentTarget.value);
            onChange?.(event);
          }}
          {...props}
        />
        {hasValue && onClear ? <button type="button" aria-label="Clear search" onClick={() => { if (!controlled) setUncontrolledValue(""); onClear(); }}><X /></button> : shortcut ? <kbd>{shortcut}</kbd> : null}
      </div>
    </div>
  );
});
