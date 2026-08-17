import { type Dispatch, type SetStateAction } from "react";
export declare const DATA_VIEW_STATE_VERSION: 1;
export type DataViewSort = {
    id: string;
    direction: "asc" | "desc";
};
export type DataDateRange = {
    from: string | null;
    to: string | null;
};
export type DataFilterOperator = "is" | "is-not" | "contains" | "does-not-contain" | "greater-than" | "less-than" | "is-empty" | "is-not-empty";
export type DataFilterValue = string | number | boolean | readonly string[] | DataDateRange | null;
export type DataViewFilter = {
    id: string;
    fieldId: string;
    operator: DataFilterOperator;
    value: DataFilterValue;
};
export type DataViewPagination = {
    page: number;
    pageSize: number;
};
export type DataViewColumnPinning = {
    start: readonly string[];
    end: readonly string[];
};
export type DataViewState = {
    version: typeof DATA_VIEW_STATE_VERSION;
    query: string;
    filters: readonly DataViewFilter[];
    sorting: readonly DataViewSort[];
    pagination: DataViewPagination;
    columnVisibility: Readonly<Record<string, boolean>>;
    columnSizing: Readonly<Record<string, number>>;
    columnPinning: DataViewColumnPinning;
    dateRange: DataDateRange;
    viewId: string | null;
};
export type DataRequest = Pick<DataViewState, "query" | "filters" | "sorting" | "pagination" | "dateRange">;
export type DataViewStateInput = Partial<Omit<DataViewState, "version" | "pagination" | "columnPinning" | "dateRange">> & {
    pagination?: Partial<DataViewPagination>;
    columnPinning?: Partial<DataViewColumnPinning>;
    dateRange?: Partial<DataDateRange>;
};
export declare function createDataViewState(input?: DataViewStateInput): DataViewState;
export declare function patchDataViewState(current: DataViewState, patch: DataViewStateInput, options?: {
    resetPage?: boolean;
}): DataViewState;
export declare function toDataRequest(state: DataViewState): DataRequest;
export declare function getDataRequestKey(state: DataViewState): string;
export type DataViewCodecOptions = {
    prefix?: string;
    baseline?: DataViewStateInput;
};
export declare function serializeDataViewState(state: DataViewState, options?: DataViewCodecOptions): string;
export declare function parseDataViewState(search: string, fallback?: DataViewStateInput, options?: DataViewCodecOptions): DataViewState;
export declare function mergeDataViewSearch(currentSearch: string, state: DataViewState, options?: DataViewCodecOptions): string;
export type DataViewLocationAdapter = {
    read: () => string;
    write: (search: string, mode: "push" | "replace") => void;
    subscribe: (listener: () => void) => () => void;
};
export declare function createBrowserDataViewLocationAdapter(): DataViewLocationAdapter | null;
export type UseDataViewStateOptions = {
    initialState?: DataViewStateInput;
    syncToUrl?: boolean;
    location?: DataViewLocationAdapter | null;
    historyMode?: "push" | "replace";
    parameterPrefix?: string;
    onStateChange?: (state: DataViewState) => void;
};
export type UseDataViewStateResult = {
    state: DataViewState;
    setState: Dispatch<SetStateAction<DataViewState>>;
    patchState: (patch: DataViewStateInput, options?: {
        resetPage?: boolean;
    }) => void;
    resetState: () => void;
    isHydrated: boolean;
};
export declare function useDataViewState({ initialState, syncToUrl, location, historyMode, parameterPrefix, onStateChange, }?: UseDataViewStateOptions): UseDataViewStateResult;
export type DataSavedView = {
    id: string;
    label: string;
    description?: string;
    state: DataViewState;
    scope: "system" | "personal";
    createdAt: string;
    updatedAt: string;
};
export type DataViewStorageAdapter = {
    read: (key: string) => string | null;
    write: (key: string, value: string) => void;
    remove: (key: string) => void;
};
export declare function createBrowserDataViewStorageAdapter(): DataViewStorageAdapter | null;
export declare function serializeSavedViews(views: readonly DataSavedView[]): string;
export declare function parseSavedViews(serialized: string | null): readonly DataSavedView[];
export type UseSavedViewsOptions = {
    storageKey: string;
    systemViews?: readonly DataSavedView[];
    storage?: DataViewStorageAdapter | null;
    now?: () => Date;
    createId?: () => string;
    onStorageError?: (error: unknown) => void;
};
export declare function useSavedViews({ storageKey, systemViews, storage, now, createId, onStorageError, }: UseSavedViewsOptions): {
    views: DataSavedView[];
    personalViews: readonly DataSavedView[];
    isHydrated: boolean;
    saveView: (label: string, state: DataViewState, id?: string) => DataSavedView;
    updateView: (id: string, state: DataViewState, label?: string) => DataSavedView | null;
    removeView: (id: string) => boolean;
};
