import type { HTMLAttributes, ReactNode } from "react";
export type AuditLogItem = {
    id: string;
    actor: ReactNode;
    action: ReactNode;
    timestamp: ReactNode;
    metadata?: ReactNode;
    tone?: "neutral" | "danger";
};
export type AuditLogProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
    label: string;
    items: readonly AuditLogItem[];
    activeId?: string;
    onSelect?: (item: AuditLogItem) => void;
};
export declare function AuditLog({ label, items, activeId, onSelect, className, ...props }: AuditLogProps): import("react").JSX.Element;
