import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export const DATA_VIEW_STATE_VERSION = 1 as const;

export type DataViewSort = {
  id: string;
  direction: "asc" | "desc";
};

export type DataDateRange = {
  from: string | null;
  to: string | null;
};

export type DataFilterOperator =
  | "is"
  | "is-not"
  | "contains"
  | "does-not-contain"
  | "greater-than"
  | "less-than"
  | "is-empty"
  | "is-not-empty";

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

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 500;
const MIN_COLUMN_WIDTH = 48;
const MAX_COLUMN_WIDTH = 1_200;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FILTER_OPERATORS = new Set<DataFilterOperator>([
  "is",
  "is-not",
  "contains",
  "does-not-contain",
  "greater-than",
  "less-than",
  "is-empty",
  "is-not-empty",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finiteInteger(value: unknown, fallback: number, minimum: number, maximum: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function cleanId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= 120 ? trimmed : null;
}

function cleanDate(value: unknown): string | null {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : value;
}

function cleanDateRange(value: unknown, fallback: DataDateRange = { from: null, to: null }): DataDateRange {
  if (!isRecord(value)) return fallback;
  const from = cleanDate(value.from);
  const to = cleanDate(value.to);
  if (from && to && from > to) return { from: to, to: from };
  return { from, to };
}

function cleanStringList(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.flatMap((item) => cleanId(item) ?? []))];
}

function cleanFilterValue(value: unknown): DataFilterValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string").slice(0, 100);
  if (isRecord(value) && ("from" in value || "to" in value)) return cleanDateRange(value);
  return null;
}

function cleanFilters(value: unknown): readonly DataViewFilter[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const fieldId = cleanId(item.fieldId);
    const operator = typeof item.operator === "string" && FILTER_OPERATORS.has(item.operator as DataFilterOperator)
      ? item.operator as DataFilterOperator
      : null;
    if (!fieldId || !operator) return [];
    const id = cleanId(item.id) ?? `${fieldId}:${operator}`;
    if (seen.has(id)) return [];
    seen.add(id);
    return [{ id, fieldId, operator, value: cleanFilterValue(item.value) }];
  });
}

function cleanSorting(value: unknown): readonly DataViewSort[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = cleanId(item.id);
    if (!id || seen.has(id) || (item.direction !== "asc" && item.direction !== "desc")) return [];
    seen.add(id);
    return [{ id, direction: item.direction }];
  });
}

function cleanVisibility(value: unknown): Readonly<Record<string, boolean>> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([id, visible]) => {
    const clean = cleanId(id);
    return clean && typeof visible === "boolean" ? [[clean, visible]] : [];
  }));
}

function cleanSizing(value: unknown): Readonly<Record<string, number>> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([id, width]) => {
    const clean = cleanId(id);
    const parsed = Number(width);
    return clean && Number.isFinite(parsed)
      ? [[clean, finiteInteger(parsed, MIN_COLUMN_WIDTH, MIN_COLUMN_WIDTH, MAX_COLUMN_WIDTH)]]
      : [];
  }));
}

export function createDataViewState(input: DataViewStateInput = {}): DataViewState {
  const pinning = input.columnPinning ?? {};
  const dateRange = input.dateRange ?? {};
  return {
    version: DATA_VIEW_STATE_VERSION,
    query: typeof input.query === "string" ? input.query.slice(0, 500) : "",
    filters: cleanFilters(input.filters),
    sorting: cleanSorting(input.sorting),
    pagination: {
      page: finiteInteger(input.pagination?.page, 1, 1, Number.MAX_SAFE_INTEGER),
      pageSize: finiteInteger(input.pagination?.pageSize, DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
    },
    columnVisibility: cleanVisibility(input.columnVisibility),
    columnSizing: cleanSizing(input.columnSizing),
    columnPinning: {
      start: cleanStringList(pinning.start),
      end: cleanStringList(pinning.end).filter((id) => !cleanStringList(pinning.start).includes(id)),
    },
    dateRange: cleanDateRange(dateRange),
    viewId: cleanId(input.viewId),
  };
}

export function patchDataViewState(
  current: DataViewState,
  patch: DataViewStateInput,
  options: { resetPage?: boolean } = {},
): DataViewState {
  const resetPage = options.resetPage ?? (
    patch.query !== undefined
    || patch.filters !== undefined
    || patch.sorting !== undefined
    || patch.dateRange !== undefined
  );
  return createDataViewState({
    ...current,
    ...patch,
    pagination: {
      ...current.pagination,
      ...patch.pagination,
      page: resetPage ? 1 : patch.pagination?.page ?? current.pagination.page,
    },
    columnPinning: { ...current.columnPinning, ...patch.columnPinning },
    dateRange: { ...current.dateRange, ...patch.dateRange },
  });
}

export function toDataRequest(state: DataViewState): DataRequest {
  return {
    query: state.query,
    filters: state.filters,
    sorting: state.sorting,
    pagination: state.pagination,
    dateRange: state.dateRange,
  };
}

export function getDataRequestKey(state: DataViewState): string {
  return JSON.stringify(toDataRequest(state));
}

export type DataViewCodecOptions = {
  prefix?: string;
  baseline?: DataViewStateInput;
};

function key(prefix: string, name: string): string {
  return `${prefix}${name}`;
}

export function serializeDataViewState(state: DataViewState, options: DataViewCodecOptions = {}): string {
  const prefix = options.prefix ?? "teum-";
  const baseline = createDataViewState(options.baseline);
  const params = new URLSearchParams();
  const changed = (left: unknown, right: unknown) => JSON.stringify(left) !== JSON.stringify(right);
  if (state.query !== baseline.query) params.set(key(prefix, "q"), state.query);
  if (changed(state.filters, baseline.filters)) params.set(key(prefix, "filter"), JSON.stringify(state.filters));
  if (changed(state.sorting, baseline.sorting)) params.set(key(prefix, "sort"), JSON.stringify(state.sorting));
  if (state.pagination.page !== baseline.pagination.page) params.set(key(prefix, "page"), String(state.pagination.page));
  if (state.pagination.pageSize !== baseline.pagination.pageSize) params.set(key(prefix, "size"), String(state.pagination.pageSize));
  if (changed(state.columnVisibility, baseline.columnVisibility)) params.set(key(prefix, "visibility"), JSON.stringify(state.columnVisibility));
  if (changed(state.columnSizing, baseline.columnSizing)) params.set(key(prefix, "width"), JSON.stringify(Object.entries(state.columnSizing).map(([id, width]) => ({ id, width }))));
  if (changed(state.columnPinning.start, baseline.columnPinning.start)) params.set(key(prefix, "pin-start"), JSON.stringify(state.columnPinning.start));
  if (changed(state.columnPinning.end, baseline.columnPinning.end)) params.set(key(prefix, "pin-end"), JSON.stringify(state.columnPinning.end));
  if (state.dateRange.from !== baseline.dateRange.from) params.set(key(prefix, "from"), state.dateRange.from ?? "");
  if (state.dateRange.to !== baseline.dateRange.to) params.set(key(prefix, "to"), state.dateRange.to ?? "");
  if (state.viewId !== baseline.viewId) params.set(key(prefix, "view"), state.viewId ?? "");
  return params.toString();
}

function parseJsonValues(params: URLSearchParams, name: string): unknown[] {
  return params.getAll(name).flatMap((value) => {
    try {
      return [JSON.parse(value) as unknown];
    } catch {
      return [];
    }
  });
}

function parseJsonArray(params: URLSearchParams, name: string): unknown[] {
  const values = parseJsonValues(params, name);
  return values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
}

function parseJsonRecord(params: URLSearchParams, name: string): Record<string, unknown> | null {
  const values = parseJsonValues(params, name);
  return values.length === 1 && isRecord(values[0]) ? values[0] : null;
}

export function parseDataViewState(
  search: string,
  fallback: DataViewStateInput = {},
  options: DataViewCodecOptions = {},
): DataViewState {
  const prefix = options.prefix ?? "teum-";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const base = createDataViewState(fallback);
  const hidden = cleanStringList(parseJsonArray(params, key(prefix, "hidden")));
  const widths = parseJsonArray(params, key(prefix, "width")).flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = cleanId(item.id);
    return id ? [[id, item.width] as const] : [];
  });
  const pinStart = cleanStringList(parseJsonArray(params, key(prefix, "pin-start")));
  const pinEnd = cleanStringList(parseJsonArray(params, key(prefix, "pin-end")));
  const visibility = parseJsonRecord(params, key(prefix, "visibility"));
  return createDataViewState({
    ...base,
    query: params.has(key(prefix, "q")) ? params.get(key(prefix, "q")) ?? "" : base.query,
    filters: params.has(key(prefix, "filter")) ? parseJsonArray(params, key(prefix, "filter")) as DataViewFilter[] : base.filters,
    sorting: params.has(key(prefix, "sort")) ? parseJsonArray(params, key(prefix, "sort")) as DataViewSort[] : base.sorting,
    pagination: {
      page: params.get(key(prefix, "page")) ?? base.pagination.page,
      pageSize: params.get(key(prefix, "size")) ?? base.pagination.pageSize,
    } as unknown as DataViewPagination,
    columnVisibility: visibility ? cleanVisibility(visibility) : hidden.length ? Object.fromEntries(hidden.map((id) => [id, false])) : base.columnVisibility,
    columnSizing: params.has(key(prefix, "width")) ? cleanSizing(Object.fromEntries(widths)) : base.columnSizing,
    columnPinning: {
      start: params.has(key(prefix, "pin-start")) ? pinStart : base.columnPinning.start,
      end: params.has(key(prefix, "pin-end")) ? pinEnd : base.columnPinning.end,
    },
    dateRange: {
      from: params.has(key(prefix, "from")) ? params.get(key(prefix, "from")) : base.dateRange.from,
      to: params.has(key(prefix, "to")) ? params.get(key(prefix, "to")) : base.dateRange.to,
    },
    viewId: params.has(key(prefix, "view")) ? params.get(key(prefix, "view")) : base.viewId,
  });
}

export function mergeDataViewSearch(
  currentSearch: string,
  state: DataViewState,
  options: DataViewCodecOptions = {},
): string {
  const prefix = options.prefix ?? "teum-";
  const params = new URLSearchParams(currentSearch.startsWith("?") ? currentSearch.slice(1) : currentSearch);
  for (const name of [...params.keys()]) if (name.startsWith(prefix)) params.delete(name);
  const next = new URLSearchParams(serializeDataViewState(state, options));
  next.forEach((value, name) => params.append(name, value));
  return params.toString();
}

export type DataViewLocationAdapter = {
  read: () => string;
  write: (search: string, mode: "push" | "replace") => void;
  subscribe: (listener: () => void) => () => void;
};

export function createBrowserDataViewLocationAdapter(): DataViewLocationAdapter | null {
  if (typeof window === "undefined") return null;
  return {
    read: () => window.location.search,
    write: (search, mode) => {
      const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
      window.history[mode === "push" ? "pushState" : "replaceState"](null, "", next);
    },
    subscribe: (listener) => {
      window.addEventListener("popstate", listener);
      return () => window.removeEventListener("popstate", listener);
    },
  };
}

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
  patchState: (patch: DataViewStateInput, options?: { resetPage?: boolean }) => void;
  resetState: () => void;
  isHydrated: boolean;
};

export function useDataViewState({
  initialState,
  syncToUrl = false,
  location,
  historyMode = "replace",
  parameterPrefix = "teum-",
  onStateChange,
}: UseDataViewStateOptions = {}): UseDataViewStateResult {
  const initialRef = useRef(createDataViewState(initialState));
  const locationRef = useRef<DataViewLocationAdapter | null>(location ?? (syncToUrl ? createBrowserDataViewLocationAdapter() : null));
  const [state, setState] = useState<DataViewState>(initialRef.current);
  const [isHydrated, setHydrated] = useState(!syncToUrl || !locationRef.current);
  const lastSearchRef = useRef<string | null>(null);

  useEffect(() => {
    const adapter = locationRef.current;
    if (!syncToUrl || !adapter) return;
    const read = () => {
      const search = adapter.read();
      lastSearchRef.current = search.startsWith("?") ? search.slice(1) : search;
      setState(parseDataViewState(search, initialRef.current, { prefix: parameterPrefix }));
      setHydrated(true);
    };
    read();
    return adapter.subscribe(read);
  }, [parameterPrefix, syncToUrl]);

  useEffect(() => {
    onStateChange?.(state);
    const adapter = locationRef.current;
    if (!syncToUrl || !adapter || !isHydrated) return;
    const next = mergeDataViewSearch(adapter.read(), state, { prefix: parameterPrefix, baseline: initialRef.current });
    if (next === lastSearchRef.current) return;
    lastSearchRef.current = next;
    adapter.write(next, historyMode);
  }, [historyMode, isHydrated, onStateChange, parameterPrefix, state, syncToUrl]);

  const patchState = useCallback((patch: DataViewStateInput, options?: { resetPage?: boolean }) => {
    setState((current) => patchDataViewState(current, patch, options));
  }, []);
  const resetState = useCallback(() => setState(initialRef.current), []);

  return { state, setState, patchState, resetState, isHydrated };
}

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

export function createBrowserDataViewStorageAdapter(): DataViewStorageAdapter | null {
  if (typeof window === "undefined") return null;
  return {
    read: (storageKey) => window.localStorage.getItem(storageKey),
    write: (storageKey, value) => window.localStorage.setItem(storageKey, value),
    remove: (storageKey) => window.localStorage.removeItem(storageKey),
  };
}

export function serializeSavedViews(views: readonly DataSavedView[]): string {
  return JSON.stringify({ version: DATA_VIEW_STATE_VERSION, views });
}

export function parseSavedViews(serialized: string | null): readonly DataSavedView[] {
  if (!serialized) return [];
  try {
    const parsed = JSON.parse(serialized) as unknown;
    if (!isRecord(parsed) || parsed.version !== DATA_VIEW_STATE_VERSION || !Array.isArray(parsed.views)) return [];
    return parsed.views.flatMap((item) => {
      if (!isRecord(item)) return [];
      const id = cleanId(item.id);
      const label = cleanId(item.label);
      if (!id || !label || item.scope !== "personal" || !isRecord(item.state)) return [];
      const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date(0).toISOString();
      const updatedAt = typeof item.updatedAt === "string" ? item.updatedAt : createdAt;
      return [{
        id,
        label,
        description: typeof item.description === "string" ? item.description.slice(0, 240) : undefined,
        state: createDataViewState(item.state as DataViewStateInput),
        scope: "personal" as const,
        createdAt,
        updatedAt,
      }];
    });
  } catch {
    return [];
  }
}

export type UseSavedViewsOptions = {
  storageKey: string;
  systemViews?: readonly DataSavedView[];
  storage?: DataViewStorageAdapter | null;
  now?: () => Date;
  createId?: () => string;
  onStorageError?: (error: unknown) => void;
};

const EMPTY_SAVED_VIEWS: readonly DataSavedView[] = [];
const defaultSavedViewNow = () => new Date();
const defaultSavedViewId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `view-${Date.now()}`;

export function useSavedViews({
  storageKey,
  systemViews = EMPTY_SAVED_VIEWS,
  storage,
  now = defaultSavedViewNow,
  createId = defaultSavedViewId,
  onStorageError,
}: UseSavedViewsOptions) {
  const storageRef = useRef<DataViewStorageAdapter | null>(storage ?? createBrowserDataViewStorageAdapter());
  const onStorageErrorRef = useRef(onStorageError);
  const [personalViews, setPersonalViews] = useState<readonly DataSavedView[]>([]);
  const personalViewsRef = useRef<readonly DataSavedView[]>([]);
  const [isHydrated, setHydrated] = useState(!storageRef.current);

  useEffect(() => {
    onStorageErrorRef.current = onStorageError;
  }, [onStorageError]);

  useEffect(() => {
    try {
      const hydratedViews = parseSavedViews(storageRef.current?.read(storageKey) ?? null);
      personalViewsRef.current = hydratedViews;
      setPersonalViews(hydratedViews);
    } catch (error) {
      onStorageErrorRef.current?.(error);
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  const persist = useCallback((next: readonly DataSavedView[]) => {
    personalViewsRef.current = next;
    setPersonalViews(next);
    try {
      if (next.length) storageRef.current?.write(storageKey, serializeSavedViews(next));
      else storageRef.current?.remove(storageKey);
    } catch (error) {
      onStorageErrorRef.current?.(error);
    }
  }, [storageKey]);

  const saveView = useCallback((label: string, state: DataViewState, id = createId()) => {
    const timestamp = now().toISOString();
    const view: DataSavedView = {
      id,
      label: label.trim().slice(0, 120) || "Untitled view",
      state: createDataViewState({ ...state, viewId: id }),
      scope: "personal",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    persist([...personalViewsRef.current.filter((item) => item.id !== id), view]);
    return view;
  }, [createId, now, persist]);

  const updateView = useCallback((id: string, state: DataViewState, label?: string) => {
    const current = personalViewsRef.current.find((view) => view.id === id);
    if (!current) return null;
    const next: DataSavedView = {
      ...current,
      label: label?.trim().slice(0, 120) || current.label,
      state: createDataViewState({ ...state, viewId: id }),
      updatedAt: now().toISOString(),
    };
    persist(personalViewsRef.current.map((view) => view.id === id ? next : view));
    return next;
  }, [now, persist]);

  const removeView = useCallback((id: string) => {
    if (!personalViewsRef.current.some((view) => view.id === id)) return false;
    persist(personalViewsRef.current.filter((view) => view.id !== id));
    return true;
  }, [persist]);

  const views = useMemo(() => [...systemViews, ...personalViews], [personalViews, systemViews]);
  return { views, personalViews, isHydrated, saveView, updateView, removeView };
}
