export type DataGroupOption = {
    id: string;
    label: string;
    disabled?: boolean;
};
export type DataGroupMenuProps = {
    options: readonly DataGroupOption[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    label?: string;
    className?: string;
};
export declare function DataGroupMenu({ options, value, onValueChange, label, className }: DataGroupMenuProps): import("react").JSX.Element;
