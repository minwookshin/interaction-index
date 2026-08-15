import type { BehaviorContract } from "../../lib/behavior-contract";
export declare const inlineEditContract: BehaviorContract;
export type InlineEditProps = {
    value: string;
    onSave: (value: string) => void | Promise<void>;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    validate?: (value: string) => string | undefined;
};
export declare function InlineEdit({ value, onSave, label, placeholder, className, disabled, validate }: InlineEditProps): import("react").JSX.Element;
