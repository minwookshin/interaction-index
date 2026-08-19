export type DataSortOption = {
    id: string;
    label: string;
    disabled?: boolean;
};
export type DataSortValue = {
    id: string;
    direction: "asc" | "desc";
};
export type DataSortMenuProps = {
    options: readonly DataSortOption[];
    value: DataSortValue | null;
    onValueChange: (value: DataSortValue | null) => void;
    label?: string;
    className?: string;
};
export declare function DataSortMenu({ options, value, onValueChange, label, className }: DataSortMenuProps): import("react").JSX.Element;
