import { type ReactNode } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
export declare const undoStackContract: BehaviorContract;
export type UndoAction = {
    id?: string;
    label: string;
    undo: () => void;
};
export type UndoContextValue = {
    pushUndo: (action: UndoAction) => void;
    undoLatest: () => void;
    canUndo: boolean;
    latestLabel?: string;
    count: number;
};
export declare function UndoStackProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useUndoStack(): UndoContextValue;
export declare function UndoBar(): import("react").JSX.Element | null;
