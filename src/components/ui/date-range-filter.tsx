import { getLocalTimeZone, parseDate, today, CalendarDate, type DateValue } from "@internationalized/date";
import { CalendarBlank } from "@phosphor-icons/react";
import { useState } from "react";
import type { DataDateRange } from "../../lib/data-view-state";
import { Button } from "./button";
import { DatePicker } from "./date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DateRangePreset = {
  id: string;
  label: string;
  getValue: () => DataDateRange;
};

export type DateRangeFilterProps = {
  value: DataDateRange;
  onValueChange: (value: DataDateRange) => void;
  label?: string;
  presets?: readonly DateRangePreset[];
  minValue?: DateValue;
  maxValue?: DateValue;
  disabled?: boolean;
};

const DEFAULT_DATE_RANGE_PRESETS: readonly DateRangePreset[] = [
  {
    id: "last-7-days",
    label: "Last 7 days",
    getValue: () => {
      const end = today(getLocalTimeZone());
      return { from: end.subtract({ days: 6 }).toString(), to: end.toString() };
    },
  },
  {
    id: "last-30-days",
    label: "Last 30 days",
    getValue: () => {
      const end = today(getLocalTimeZone());
      return { from: end.subtract({ days: 29 }).toString(), to: end.toString() };
    },
  },
  {
    id: "this-month",
    label: "This month",
    getValue: () => {
      const current = today(getLocalTimeZone());
      const start = new CalendarDate(current.year, current.month, 1);
      const end = start.add({ months: 1 }).subtract({ days: 1 });
      return { from: start.toString(), to: end.toString() };
    },
  },
];

function toDate(value: string | null): CalendarDate | null {
  if (!value) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

function formatRange(value: DataDateRange, label: string): string {
  if (!value.from && !value.to) return label;
  const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
  const format = (date: string | null) => date ? formatter.format(new Date(`${date}T12:00:00`)) : "Any time";
  return `${format(value.from)} – ${format(value.to)}`;
}

export function DateRangeFilter({
  value,
  onValueChange,
  label = "Date range",
  presets = DEFAULT_DATE_RANGE_PRESETS,
  minValue,
  maxValue,
  disabled = false,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DataDateRange>(value);
  const invalid = Boolean(draft.from && draft.to && draft.from > draft.to);

  const setOpenState = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const apply = () => {
    if (invalid) return;
    onValueChange(draft);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpenState}>
      <PopoverTrigger
        render={<Button size="small" variant="secondary" leadingIcon={<CalendarBlank />} disabled={disabled} aria-label={`${label}: ${formatRange(value, "Any time")}`} />}
      >
        {formatRange(value, label)}
      </PopoverTrigger>
      <PopoverContent className="whatiuse-date-range" align="start">
        <div className="whatiuse-date-range__heading">
          <strong>{label}</strong>
          {invalid && <span role="alert">Start must be before end.</span>}
        </div>
        {presets.length > 0 && (
          <div className="whatiuse-date-range__presets" aria-label="Date range presets">
            {presets.map((preset) => {
              const presetValue = preset.getValue();
              const selected = presetValue.from === draft.from && presetValue.to === draft.to;
              return <Button key={preset.id} size="small" variant="ghost" aria-pressed={selected} onClick={() => setDraft(presetValue)}>{preset.label}</Button>;
            })}
          </div>
        )}
        <div className="whatiuse-date-range__fields">
          <DatePicker
            label="From"
            value={toDate(draft.from)}
            minValue={minValue}
            maxValue={toDate(draft.to) ?? maxValue}
            onChange={(date) => setDraft((current) => ({ ...current, from: date?.toString() ?? null }))}
            errorMessage={invalid ? "Choose an earlier date." : undefined}
          />
          <DatePicker
            label="To"
            value={toDate(draft.to)}
            minValue={toDate(draft.from) ?? minValue}
            maxValue={maxValue}
            onChange={(date) => setDraft((current) => ({ ...current, to: date?.toString() ?? null }))}
          />
        </div>
        <div className="whatiuse-date-range__actions">
          {(draft.from || draft.to) && <Button size="small" variant="ghost" onClick={() => setDraft({ from: null, to: null })}>Clear</Button>}
          <span />
          <Button size="small" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="primary" disabled={invalid} onClick={apply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
