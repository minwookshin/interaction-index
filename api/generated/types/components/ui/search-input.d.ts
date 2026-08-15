import { type InputHTMLAttributes } from "react";
export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label?: string;
    loading?: boolean;
    onClear?: () => void;
    shortcut?: string;
};
export declare const SearchInput: import("react").ForwardRefExoticComponent<Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label?: string;
    loading?: boolean;
    onClear?: () => void;
    shortcut?: string;
} & import("react").RefAttributes<HTMLInputElement>>;
