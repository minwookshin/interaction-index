"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/data-state.css";
import { MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./spinner";

export type DataStateProps = HTMLAttributes<HTMLDivElement> & {
  state: "loading" | "empty" | "error";
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function DataState({ state, title, description, action, className, ...props }: DataStateProps) {
  const defaults = state === "loading"
    ? { title: "Loading data", description: "This view will update when the data is ready." }
    : state === "error"
      ? { title: "Data could not be loaded", description: "Try again or change the active filters." }
      : { title: "No results", description: "Try changing the search or active filters." };
  return (
    <div
      className={cn("whatiuse-data-state", className)}
      data-state={state}
      role={state === "error" ? "alert" : "status"}
      aria-live={state === "loading" ? "polite" : undefined}
      {...props}
    >
      <span className="whatiuse-data-state__icon" aria-hidden="true">
        {state === "loading" ? <Spinner label="Loading" role="presentation" aria-hidden="true" /> : state === "error" ? <WarningCircle /> : <MagnifyingGlass />}
      </span>
      <strong>{title ?? defaults.title}</strong>
      <p>{description ?? defaults.description}</p>
      {action && <div className="whatiuse-data-state__action">{action}</div>}
    </div>
  );
}
