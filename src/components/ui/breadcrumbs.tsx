import { CaretRight, DotsThree } from "@phosphor-icons/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BreadcrumbItem = { label: string; href?: string; icon?: ReactNode };
export type BreadcrumbsProps = ComponentPropsWithRef<"nav"> & { items: readonly BreadcrumbItem[]; maxItems?: number; label?: string };

export function Breadcrumbs({ items, maxItems = 4, label = "Breadcrumb", className, ...props }: BreadcrumbsProps) {
  const collapsed = items.length > maxItems;
  const visibleItems = collapsed ? [items[0], { label: "More" }, ...items.slice(-(maxItems - 2))] : items;
  return (
    <nav className={cn("teum-breadcrumbs", className)} aria-label={label} {...props}>
      <ol>
        {visibleItems.map((item, index) => {
          const current = index === visibleItems.length - 1;
          const collapsedItem = collapsed && index === 1;
          return (
            <li key={`${item.label}-${index}`}>
              {index > 0 && <CaretRight className="teum-breadcrumbs__separator" aria-hidden="true" />}
              {collapsedItem ? <span className="teum-breadcrumbs__ellipsis" role="img" aria-label="Collapsed breadcrumbs"><DotsThree weight="bold" /></span> : item.href && !current ? <a href={item.href}>{item.icon}{item.label}</a> : <span aria-current={current ? "page" : undefined}>{item.icon}{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
