import { parseDate } from "@internationalized/date";
import { DatePicker } from "../components/ui/date-picker";

const has = (state: string, ...parts: string[]) => parts.some((part) => state.toLocaleLowerCase().includes(part));

export function DatePickerExample() {
  return (
    <div className="date-picker-demo-grid" data-react-aria-preview-ready>
      <DatePicker label="Due date" defaultValue={parseDate("2026-08-21")} description="Dates follow the current locale and calendar." />
      <DatePicker label="Review date" defaultValue={parseDate("2026-08-28")} minValue={parseDate("2026-08-15")} />
      <DatePicker label="Invalid date" defaultValue={parseDate("2026-08-12")} errorMessage="Choose August 15 or later." isInvalid />
    </div>
  );
}

export function DatePickerPrimaryPreview() {
  return (
    <div className="primary-field-preview" data-react-aria-preview-ready>
      <DatePicker label="Due date" defaultValue={parseDate("2026-08-21")} description="Dates follow the current locale." />
    </div>
  );
}

export function DatePickerStatePreview({ state }: { state: string }) {
  const empty = has(state, "empty");
  const open = has(state, "open", "selected date", "unavailable date");
  return (
    <div className="state-date-picker" data-react-aria-preview-ready>
      <DatePicker
        aria-label={state}
        defaultValue={empty ? undefined : parseDate("2026-08-21")}
        isDisabled={has(state, "disabled")}
        isInvalid={has(state, "error")}
        errorMessage={has(state, "error") ? "Choose August 15 or later." : undefined}
        className={has(state, "focus") ? "state-forced-focus-within" : undefined}
      />
      {open && (
        <div className="state-calendar-card" aria-hidden="true">
          <strong>August 2026</strong>
          <div>
            {[17, 18, 19, 20, 21, 22, 23].map((day) => (
              <span
                key={day}
                data-selected={(day === 21 && !has(state, "unavailable")) || undefined}
                data-unavailable={(day === 21 && has(state, "unavailable")) || undefined}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
