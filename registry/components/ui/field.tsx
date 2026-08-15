import "../../styles/index-base.css";
import "../../styles/components/field.css";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type FieldProps = FieldPrimitive.Root.Props;
export type FieldLabelProps = FieldPrimitive.Label.Props;
export type FieldDescriptionProps = FieldPrimitive.Description.Props;
export type FieldErrorProps = FieldPrimitive.Error.Props;
export type FieldControlProps = FieldPrimitive.Control.Props;
export type FieldsetProps = FieldsetPrimitive.Root.Props;
export type FieldsetLegendProps = FieldsetPrimitive.Legend.Props;

export function Field({ className, ...props }: FieldProps) {
  return <FieldPrimitive.Root className={cn("ix-field-layout", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <FieldPrimitive.Label className={cn("ix-field-layout__label", className)} {...props} />;
}

export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return <FieldPrimitive.Description className={cn("ix-field-layout__description", className)} {...props} />;
}

export function FieldError({ className, match = true, ...props }: FieldErrorProps) {
  return <FieldPrimitive.Error className={cn("ix-field-layout__error", className)} match={match} {...props} />;
}

export function FieldControl({ className, ...props }: FieldControlProps) {
  return <FieldPrimitive.Control className={cn("ix-field-layout__control", className)} {...props} />;
}

export function Fieldset({ className, ...props }: FieldsetProps) {
  return <FieldsetPrimitive.Root className={cn("ix-fieldset", className)} {...props} />;
}

export function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  return <FieldsetPrimitive.Legend className={cn("ix-fieldset__legend", className)} {...props} />;
}

export function FieldGroup({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("ix-field-group", className)} {...props} />;
}
