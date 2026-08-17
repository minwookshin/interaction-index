import type { DataFilterOperator, DataViewFilter } from "../../lib/data-view-state";
export type FilterOperator = DataFilterOperator;
export type FilterField = {
    id: string;
    label: string;
    kind?: "option" | "text" | "number";
    values?: readonly {
        label: string;
        value: string;
    }[];
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
export declare function FilterBuilder({ fields, filters, onFiltersChange, className, label }: FilterBuilderProps): import("react").JSX.Element;
