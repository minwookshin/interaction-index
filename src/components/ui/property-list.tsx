import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type PropertyListItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
};

export type PropertyListProps = HTMLAttributes<HTMLDListElement> & {
  items: readonly PropertyListItem[];
  columns?: 1 | 2;
};

export function PropertyList({ items, columns = 1, className, ...props }: PropertyListProps) {
  return (
    <dl className={cn("whatiuse-property-list", className)} data-columns={columns} {...props}>
      {items.map((item) => (
        <div key={item.id} className="whatiuse-property-list__item">
          <dt>{item.label}</dt>
          <dd>{item.value}{item.description && <small>{item.description}</small>}</dd>
        </div>
      ))}
    </dl>
  );
}
