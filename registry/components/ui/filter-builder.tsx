"use client";

import "../../styles/teum-base.css";
import "../../styles/components/filter-builder.css";
import { Funnel, Plus, X } from "@phosphor-icons/react";
import { useId, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import type {
  DataFilterOperator,
  DataFilterValue,
  DataViewFilter,
} from "../../lib/data-view-state";
import { Badge } from "./badge";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select } from "./select";
import { TextField } from "./text-field";

export type FilterOperator = DataFilterOperator;

export type FilterField = {
  id: string;
  label: string;
  kind?: "option" | "text" | "number";
  values?: readonly { label: string; value: string }[];
  operators?: readonly FilterOperator[];
  placeholder?: string;
};

export type DataFilter = DataViewFilter;

export type FilterBuilderProps = {
  fields: readonly FilterField[];
  filters: readonly DataFilter[];
  onFiltersChange: (filters: readonly DataFilter[]) => void;
  className?: string;
  label?: string;
};

const operatorLabels: Record<FilterOperator, string> = {
  is: "is",
  "is-not": "is not",
  contains: "contains",
  "does-not-contain": "does not contain",
  "greater-than": "is greater than",
  "less-than": "is less than",
  "is-empty": "is empty",
  "is-not-empty": "is not empty",
};

function defaultOperators(field: FilterField | undefined): readonly FilterOperator[] {
  if (field?.kind === "text") return ["contains", "does-not-contain", "is", "is-not", "is-empty", "is-not-empty"];
  if (field?.kind === "number") return ["is", "is-not", "greater-than", "less-than", "is-empty", "is-not-empty"];
  return ["is", "is-not"];
}

function needsValue(operator: FilterOperator): boolean {
  return operator !== "is-empty" && operator !== "is-not-empty";
}

function formatFilterValue(field: FilterField | undefined, value: DataFilterValue): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value && !Array.isArray(value)) {
    const range = value as { from: string | null; to: string | null };
    return [range.from, range.to].filter(Boolean).join(" – ");
  }
  const option = field?.values?.find((item) => item.value === String(value));
  return option?.label ?? String(value ?? "");
}

export function FilterBuilder({ fields, filters, onFiltersChange, className, label = "Filter" }: FilterBuilderProps) {
  const generatedId = useId();
  const [open, setOpen] = useState(false);
  const [fieldId, setFieldId] = useState(fields[0]?.id ?? "");
  const [operator, setOperator] = useState<FilterOperator>("is");
  const [value, setValue] = useState("");
  const activeField = fields.find((field) => field.id === fieldId) ?? fields[0];
  const values = activeField?.values ?? [];
  const operators = activeField?.operators ?? defaultOperators(activeField);

  const fieldOptions = fields.map((field) => ({ label: field.label, value: field.id }));
  const operatorOptions = operators.map((item) => ({ label: operatorLabels[item], value: item }));
  const filterDescriptions = useMemo(() => new Map(filters.map((filter) => {
    const field = fields.find((item) => item.id === filter.fieldId);
    const valueLabel = needsValue(filter.operator) ? ` ${formatFilterValue(field, filter.value)}` : "";
    return [filter.id, `${field?.label ?? filter.fieldId} ${operatorLabels[filter.operator]}${valueLabel}`];
  })), [fields, filters]);

  const resetDraft = (nextFieldId = fields[0]?.id ?? "") => {
    setFieldId(nextFieldId);
    setOperator("is");
    setValue("");
  };

  const addFilter = () => {
    if (!activeField || (needsValue(operator) && !value.trim())) return;
    const id = `${activeField.id}:${operator}`;
    const filterValue: DataFilterValue = activeField.kind === "number" && needsValue(operator) ? Number(value) : needsValue(operator) ? value : null;
    if (activeField.kind === "number" && needsValue(operator) && !Number.isFinite(filterValue)) return;
    const next = [...filters.filter((filter) => filter.id !== id), { id, fieldId: activeField.id, operator, value: filterValue }];
    onFiltersChange(next);
    setOpen(false);
    resetDraft();
  };

  const removeFilter = (id: string) => onFiltersChange(filters.filter((filter) => filter.id !== id));

  return (
    <div className={cn("teum-filter-builder", className)} aria-label="Active data filters">
      <Popover open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) resetDraft(); }}>
        <PopoverTrigger render={<Button size="small" variant="secondary" leadingIcon={<Funnel />} />}>{label}{filters.length ? <span className="teum-filter-builder__count">{filters.length}</span> : null}</PopoverTrigger>
        <PopoverContent className="teum-filter-builder__popover" aria-labelledby={`${generatedId}-title`}>
          <div className="teum-filter-builder__heading"><strong id={`${generatedId}-title`}>Add filter</strong><span>Keep each active condition visible.</span></div>
          <div className="teum-filter-builder__form">
            <Select label="Field" options={fieldOptions} value={fieldId} onValueChange={(next) => { if (next) resetDraft(next); }} />
            <Select label="Operator" options={operatorOptions} value={operator} onValueChange={(next) => { if (next) setOperator(next as FilterOperator); }} />
            {needsValue(operator) && (activeField?.kind === "text" || activeField?.kind === "number" ? (
              <TextField
                label="Value"
                type={activeField.kind === "number" ? "number" : "text"}
                value={value}
                placeholder={activeField.placeholder ?? (activeField.kind === "number" ? "Enter a number" : "Enter text")}
                onChange={(event) => setValue(event.target.value)}
              />
            ) : (
              <Select label="Value" options={values} value={value} placeholder="Choose value" onValueChange={(next) => setValue(next ?? "")} />
            ))}
          </div>
          <div className="teum-filter-builder__actions"><Button size="small" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button size="small" variant="primary" leadingIcon={<Plus />} disabled={needsValue(operator) && !value.trim()} onClick={addFilter}>Add filter</Button></div>
        </PopoverContent>
      </Popover>
      {filters.map((filter) => <Badge key={filter.id} variant="outline" removable removeLabel={`Remove ${filterDescriptions.get(filter.id)}`} onRemove={() => removeFilter(filter.id)}>{filterDescriptions.get(filter.id)}</Badge>)}
      {filters.length > 1 && <button type="button" className="teum-filter-builder__clear" onClick={() => onFiltersChange([])}><X aria-hidden="true" />Clear</button>}
      <span className="teum-sr-only" aria-live="polite">{filters.length} active filters</span>
    </div>
  );
}
