export type FacetFilterOption = {
    value: string;
    label: string;
    count?: number;
    disabled?: boolean;
};
export type FacetFilterProps = {
    label: string;
    options: readonly FacetFilterOption[];
    values: readonly string[];
    onValuesChange: (values: readonly string[]) => void;
    className?: string;
};
export declare function FacetFilter({ label, options, values, onValuesChange, className }: FacetFilterProps): import("react").JSX.Element;
