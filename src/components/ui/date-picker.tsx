import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog as AriaDialog,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  type CalendarProps as AriaCalendarProps,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
} from "react-aria-components";
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type CalendarProps<T extends DateValue> = Omit<AriaCalendarProps<T>, "children" | "className"> & {
  className?: string;
};

export function Calendar<T extends DateValue>({ className, ...props }: CalendarProps<T>) {
  return (
    <AriaCalendar className={cn("teum-calendar", className)} {...props}>
      <header className="teum-calendar__header">
        <AriaButton slot="previous" className="teum-calendar__nav" aria-label="Previous month">
          <CaretLeft aria-hidden="true" />
        </AriaButton>
        <Heading className="teum-calendar__heading" />
        <AriaButton slot="next" className="teum-calendar__nav" aria-label="Next month">
          <CaretRight aria-hidden="true" />
        </AriaButton>
      </header>
      <CalendarGrid className="teum-calendar__grid" weekdayStyle="short">
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell className="teum-calendar__weekday">{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell className="teum-calendar__cell" date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}

export type DatePickerProps<T extends DateValue> = Omit<AriaDatePickerProps<T>, "children" | "className"> & {
  label?: ReactNode;
  "aria-label"?: string;
  description?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
};

export function DatePicker<T extends DateValue>({
  label,
  "aria-label": ariaLabel,
  description,
  errorMessage,
  className,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      aria-label={label ? undefined : ariaLabel}
      className={cn("teum-date-picker", className)}
      isInvalid={Boolean(errorMessage) || props.isInvalid}
      {...props}
    >
      {label && <Label className="teum-field__label">{label}</Label>}
      <Group className="teum-date-picker__group">
        <DateInput className="teum-date-picker__input">
          {(segment) => <DateSegment className="teum-date-picker__segment" segment={segment} />}
        </DateInput>
        <AriaButton className="teum-date-picker__button" aria-label="Open calendar">
          <CalendarBlank aria-hidden="true" />
        </AriaButton>
      </Group>
      {description && <Text slot="description" className="teum-field__description">{description}</Text>}
      {errorMessage && <Text slot="errorMessage" className="teum-field__error">{errorMessage}</Text>}
      <Popover className="teum-date-picker__popover" placement="bottom" data-layer="flyout">
        <AriaDialog className="teum-date-picker__dialog">
          <Calendar />
        </AriaDialog>
      </Popover>
    </AriaDatePicker>
  );
}
