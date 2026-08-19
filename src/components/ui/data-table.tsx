import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretUpDown,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  functionalUpdate,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { DataViewColumnPinning, DataViewSort } from "../../lib/data-view-state";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export const whatiuseDataTableFeatures = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export type DataTableSort = DataViewSort;
export type DataTableColumnPinning = DataViewColumnPinning;

export type DataTableColumn<TData extends object> = {
  id: string;
  header: ReactNode;
  accessor?: keyof TData | ((row: TData) => unknown);
  cell?: (row: TData) => ReactNode;
  sortable?: boolean;
  sortType?: "alphanumeric" | "basic" | "datetime";
  hideable?: boolean;
  resizable?: boolean;
  pinnable?: boolean;
  align?: "start" | "center" | "end";
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
};

export type DataTableVirtualization = {
  height?: number;
  estimateRowHeight?: number;
  overscan?: number;
};

export type DataTableProps<TData extends object> = {
  ariaLabel: string;
  data: readonly TData[];
  columns: readonly DataTableColumn<TData>[];
  getRowId: (row: TData, index: number) => string;
  getRowLabel?: (row: TData) => string;
  className?: string;
  selectable?: boolean;
  selectedRowIds?: readonly string[];
  defaultSelectedRowIds?: readonly string[];
  onSelectedRowIdsChange?: (ids: readonly string[], rows: readonly TData[]) => void;
  sorting?: readonly DataTableSort[];
  defaultSorting?: readonly DataTableSort[];
  onSortingChange?: (sorting: readonly DataTableSort[]) => void;
  manualSorting?: boolean;
  columnVisibility?: ColumnVisibilityState;
  defaultColumnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void;
  columnSizing?: ColumnSizingState;
  defaultColumnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  columnPinning?: DataTableColumnPinning;
  defaultColumnPinning?: DataTableColumnPinning;
  onColumnPinningChange?: (pinning: DataTableColumnPinning) => void;
  resizable?: boolean;
  resizeDirection?: "ltr" | "rtl";
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  paginate?: boolean;
  manualPagination?: boolean;
  rowCount?: number;
  pageCount?: number;
  hasNextPage?: boolean;
  virtualize?: boolean | DataTableVirtualization;
  loading?: boolean;
  isFetching?: boolean;
  loadingRows?: number;
  error?: ReactNode;
  onRetry?: () => void;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  onRowActivate?: (row: TData) => void;
};

function toSelection(ids: readonly string[] | undefined): RowSelectionState {
  return Object.fromEntries((ids ?? []).map((id) => [id, true])) as RowSelectionState;
}

function toSorting(value: readonly DataTableSort[] | undefined): SortingState {
  return (value ?? []).map((item) => ({ id: item.id, desc: item.direction === "desc" }));
}

function fromSorting(value: SortingState): readonly DataTableSort[] {
  return value.map((item) => ({ id: item.id, direction: item.desc ? "desc" : "asc" }));
}

function toPinning(value: DataTableColumnPinning | undefined): ColumnPinningState {
  return { start: [...(value?.start ?? [])], end: [...(value?.end ?? [])] };
}

function fromPinning(value: ColumnPinningState): DataTableColumnPinning {
  return { start: value.start, end: value.end };
}

function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return <span className="whatiuse-data-table__empty-value">—</span>;
  if (typeof value === "string" || typeof value === "number") return value;
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

function resolvedColumnStyle<TData extends object>(
  column: Column<typeof whatiuseDataTableFeatures, TData, unknown>,
  source: DataTableColumn<TData> | undefined,
  selectionOffset: number,
): CSSProperties | undefined {
  const pinned = column.getIsPinned();
  const hasWidth = typeof source?.width === "number"
    || typeof source?.width === "string"
    || source?.resizable
    || pinned;
  if (!hasWidth && !pinned) return undefined;
  const width = typeof source?.width === "string" && !source.resizable ? source.width : `${column.getSize()}px`;
  const style: CSSProperties = {
    width,
    minWidth: source?.minWidth ? `${source.minWidth}px` : pinned ? `${column.getSize()}px` : undefined,
    maxWidth: source?.maxWidth ? `${source.maxWidth}px` : undefined,
  };
  if (pinned === "start") {
    style.position = "sticky";
    style.insetInlineStart = `${column.getStart("start") + selectionOffset}px`;
    style.zIndex = 2;
  }
  if (pinned === "end") {
    style.position = "sticky";
    style.insetInlineEnd = `${column.getAfter("end")}px`;
    style.zIndex = 2;
  }
  return style;
}

function clampWidth(value: number, column: { minWidth?: number; maxWidth?: number } | undefined): number {
  return Math.min(column?.maxWidth ?? 1_200, Math.max(column?.minWidth ?? 48, Math.round(value)));
}

export function DataTable<TData extends object>({
  ariaLabel,
  data,
  columns,
  getRowId,
  getRowLabel,
  className,
  selectable = false,
  selectedRowIds,
  defaultSelectedRowIds,
  onSelectedRowIdsChange,
  sorting,
  defaultSorting,
  onSortingChange,
  manualSorting = false,
  columnVisibility,
  defaultColumnVisibility,
  onColumnVisibilityChange,
  columnSizing,
  defaultColumnSizing,
  onColumnSizingChange,
  columnPinning,
  defaultColumnPinning,
  onColumnPinningChange,
  resizable = false,
  resizeDirection = "ltr",
  page,
  defaultPage = 1,
  pageSize = 10,
  onPageChange,
  paginate = true,
  manualPagination = false,
  rowCount,
  pageCount,
  hasNextPage,
  virtualize = false,
  loading = false,
  isFetching = false,
  loadingRows = 5,
  error,
  onRetry,
  emptyTitle = "No results",
  emptyDescription = "Try changing the search or active filters.",
  onRowActivate,
}: DataTableProps<TData>) {
  const controlledSelection = selectedRowIds === undefined ? undefined : toSelection(selectedRowIds);
  const [internalSelection, setInternalSelection] = useState<RowSelectionState>(() => toSelection(defaultSelectedRowIds));
  const selectionState = controlledSelection ?? internalSelection;

  const controlledSorting = sorting === undefined ? undefined : toSorting(sorting);
  const [internalSorting, setInternalSorting] = useState<SortingState>(() => toSorting(defaultSorting));
  const sortingState = controlledSorting ?? internalSorting;

  const [internalVisibility, setInternalVisibility] = useState<ColumnVisibilityState>(defaultColumnVisibility ?? {});
  const visibilityState = columnVisibility ?? internalVisibility;

  const [internalSizing, setInternalSizing] = useState<ColumnSizingState>(defaultColumnSizing ?? {});
  const sizingState = columnSizing ?? internalSizing;

  const controlledPinning = columnPinning === undefined ? undefined : toPinning(columnPinning);
  const [internalPinning, setInternalPinning] = useState<ColumnPinningState>(() => toPinning(defaultColumnPinning));
  const pinningState = controlledPinning ?? internalPinning;

  const controlledPage = page === undefined ? undefined : Math.max(0, page - 1);
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: Math.max(0, defaultPage - 1),
    pageSize: paginate ? pageSize : Number.MAX_SAFE_INTEGER,
  });
  const paginationState = {
    pageIndex: controlledPage ?? internalPagination.pageIndex,
    pageSize: paginate ? pageSize : Number.MAX_SAFE_INTEGER,
  };

  const columnsById = useMemo(() => new Map(columns.map((column) => [column.id, column])), [columns]);
  const tableColumns = useMemo<ColumnDef<typeof whatiuseDataTableFeatures, TData, unknown>[]>(() => columns.map((column) => ({
    id: column.id,
    header: typeof column.header === "string" ? column.header : column.id,
    accessorFn: typeof column.accessor === "function"
      ? column.accessor
      : column.accessor
        ? (row: TData) => row[column.accessor as keyof TData]
        : (row: TData) => row,
    cell: ({ row, getValue }) => column.cell ? column.cell(row.original) : renderValue(getValue()),
    enableSorting: column.sortable ?? false,
    enableHiding: column.hideable ?? true,
    enableResizing: column.resizable ?? resizable,
    enablePinning: column.pinnable ?? true,
    size: typeof column.width === "number" ? column.width : undefined,
    minSize: column.minWidth,
    maxSize: column.maxWidth,
    sortFn: column.sortType ?? "alphanumeric",
    meta: { align: column.align ?? "start", width: column.width },
  })), [columns, resizable]);

  const updateSelection = (updater: Updater<RowSelectionState>) => {
    const next = functionalUpdate(updater, selectionState);
    if (selectedRowIds === undefined) setInternalSelection(next);
    const ids = Object.entries(next).filter(([, selected]) => selected).map(([id]) => id);
    const rowsById = new Map(data.map((row, index) => [getRowId(row, index), row]));
    onSelectedRowIdsChange?.(ids, ids.flatMap((id) => rowsById.get(id) ?? []));
  };

  const updateSorting = (updater: Updater<SortingState>) => {
    const next = functionalUpdate(updater, sortingState);
    if (sorting === undefined) setInternalSorting(next);
    onSortingChange?.(fromSorting(next));
  };

  const updateVisibility = (updater: Updater<ColumnVisibilityState>) => {
    const next = functionalUpdate(updater, visibilityState);
    if (columnVisibility === undefined) setInternalVisibility(next);
    onColumnVisibilityChange?.(next);
  };

  const updateSizing = (updater: Updater<ColumnSizingState>) => {
    const next = functionalUpdate(updater, sizingState);
    if (columnSizing === undefined) setInternalSizing(next);
    onColumnSizingChange?.(next);
  };

  const updatePinning = (updater: Updater<ColumnPinningState>) => {
    const next = functionalUpdate(updater, pinningState);
    if (columnPinning === undefined) setInternalPinning(next);
    onColumnPinningChange?.(fromPinning(next));
  };

  const updatePagination = (updater: Updater<PaginationState>) => {
    const next = functionalUpdate(updater, paginationState);
    if (page === undefined) setInternalPagination(next);
    onPageChange?.(next.pageIndex + 1);
  };

  const table = useTable({
    features: whatiuseDataTableFeatures,
    data: data as TData[],
    columns: tableColumns,
    getRowId,
    enableRowSelection: selectable,
    enableMultiRowSelection: selectable,
    enableColumnResizing: resizable || columns.some((column) => column.resizable),
    columnResizeMode: "onEnd",
    columnResizeDirection: resizeDirection,
    manualSorting,
    manualPagination: manualPagination || !paginate,
    rowCount,
    pageCount,
    state: {
      rowSelection: selectionState,
      sorting: sortingState,
      columnVisibility: visibilityState,
      columnSizing: sizingState,
      columnPinning: pinningState,
      pagination: paginationState,
    },
    onRowSelectionChange: updateSelection,
    onSortingChange: updateSorting,
    onColumnVisibilityChange: updateVisibility,
    onColumnSizingChange: updateSizing,
    onColumnPinningChange: updatePinning,
    onPaginationChange: updatePagination,
  });

  const visibleColumns = columns.filter((column) => visibilityState[column.id] !== false);
  const colSpan = Math.max(1, visibleColumns.length + (selectable ? 1 : 0));
  const rows = table.getRowModel().rows;
  const totalPages = table.getPageCount();
  const knownPageCount = Number.isFinite(totalPages) && totalPages >= 0;
  const currentPage = knownPageCount ? Math.min(Math.max(1, totalPages), paginationState.pageIndex + 1) : paginationState.pageIndex + 1;
  const selectedOnPage = table.getIsSomePageRowsSelected();
  const allSelectedOnPage = rows.length > 0 && table.getIsAllPageRowsSelected();
  const selectionOffset = selectable && (pinningState.start.length > 0 || pinningState.end.length > 0) ? 40 : 0;
  const virtualization = typeof virtualize === "object" ? virtualize : {};
  const virtualized = Boolean(virtualize);
  const virtualHeight = virtualization.height ?? 420;
  const virtualRowHeight = virtualization.estimateRowHeight ?? 39;
  const virtualOverscan = virtualization.overscan ?? 8;
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: virtualized ? rows.length : 0,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => virtualRowHeight,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: virtualOverscan,
    enabled: virtualized,
    initialRect: virtualized ? { width: 0, height: virtualHeight } : undefined,
  });
  const measuredVirtualRows = virtualized ? rowVirtualizer.getVirtualItems() : [];
  const virtualRows = measuredVirtualRows.length > 0 ? measuredVirtualRows : virtualized
    ? Array.from(
      { length: Math.min(rows.length, Math.ceil(virtualHeight / virtualRowHeight) + virtualOverscan * 2) },
      (_, index) => ({ index, key: rows[index]?.id ?? index, start: index * virtualRowHeight, end: (index + 1) * virtualRowHeight, size: virtualRowHeight, lane: 0 }),
    )
    : [];
  const topPadding = virtualRows.length ? virtualRows[0].start : 0;
  const totalVirtualSize = measuredVirtualRows.length > 0 ? rowVirtualizer.getTotalSize() : rows.length * virtualRowHeight;
  const bottomPadding = virtualRows.length
    ? Math.max(0, totalVirtualSize - virtualRows[virtualRows.length - 1].end)
    : 0;

  const renderRow = (row: (typeof rows)[number], virtualIndex?: number) => (
    <TableRow
      key={row.id}
      data-selected={row.getIsSelected() || undefined}
      data-activatable={onRowActivate ? "" : undefined}
      aria-rowindex={virtualIndex === undefined ? undefined : virtualIndex + 2}
      tabIndex={onRowActivate ? 0 : undefined}
      onDoubleClick={onRowActivate ? () => onRowActivate(row.original) : undefined}
      onKeyDown={onRowActivate ? (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        onRowActivate(row.original);
      } : undefined}
    >
      {selectable && (
        <TableCell
          className="whatiuse-data-table__selection-cell"
          data-pinned={selectionOffset ? "start" : undefined}
        >
          <Checkbox
            aria-label={`Select ${getRowLabel?.(row.original) ?? `row ${row.id}`}`}
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(checked)}
          />
        </TableCell>
      )}
      {row.getVisibleCells().map((cell) => {
        const source = columnsById.get(cell.column.id);
        const pinned = cell.column.getIsPinned();
        return (
          <TableCell
            key={cell.id}
            data-align={source?.align ?? "start"}
            data-pinned={pinned || undefined}
            style={resolvedColumnStyle(cell.column, source, selectionOffset)}
          >
            {cell.column.columnDef.cell ? <table.FlexRender cell={cell} /> : renderValue(cell.getValue())}
          </TableCell>
        );
      })}
    </TableRow>
  );

  const tableNode = (
    <Table
      aria-label={ariaLabel}
      aria-busy={loading || isFetching || undefined}
      aria-rowcount={(rowCount ?? data.length) + 1}
      containerClassName={virtualized ? "whatiuse-data-table__virtual-table" : undefined}
      style={{ minWidth: Math.max(560, table.getTotalSize() + (selectable ? 40 : 0)) }}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {selectable && (
              <TableHead
                className="whatiuse-data-table__selection-head"
                data-pinned={selectionOffset ? "start" : undefined}
              >
                <Checkbox
                  aria-label="Select all rows on this page"
                  checked={allSelectedOnPage}
                  indeterminate={selectedOnPage && !allSelectedOnPage}
                  onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                />
              </TableHead>
            )}
            {headerGroup.headers.map((header) => {
              const source = columnsById.get(header.column.id);
              const direction = header.column.getIsSorted();
              const pinned = header.column.getIsPinned();
              const ariaSort = direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none";
              const label = String(source?.header ?? header.column.id);
              return (
                <TableHead
                  key={header.id}
                  aria-sort={header.column.getCanSort() ? ariaSort : undefined}
                  data-align={source?.align ?? "start"}
                  data-pinned={pinned || undefined}
                  style={resolvedColumnStyle(header.column, source, selectionOffset)}
                >
                  <div className="whatiuse-data-table__header-content">
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="whatiuse-data-table__sort"
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label={`Sort ${label}${direction ? direction === "asc" ? ", descending next" : ", clear sorting" : ", ascending"}`}
                      >
                        <span>{source?.header}</span>
                        {direction === "asc" ? <CaretUp aria-hidden="true" /> : direction === "desc" ? <CaretDown aria-hidden="true" /> : <CaretUpDown aria-hidden="true" />}
                      </button>
                    ) : <span>{source?.header}</span>}
                    {header.column.getCanResize() && (
                      <div
                        className="whatiuse-data-table__resize"
                        data-resizing={header.column.getIsResizing() || undefined}
                        role="separator"
                        aria-label={`Resize ${label} column`}
                        aria-orientation="vertical"
                        aria-valuemin={source?.minWidth ?? 48}
                        aria-valuemax={source?.maxWidth ?? 1_200}
                        aria-valuenow={header.column.getSize()}
                        tabIndex={0}
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onKeyDown={(event) => {
                          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home") return;
                          event.preventDefault();
                          const next = event.key === "Home"
                            ? typeof source?.width === "number" ? source.width : 150
                            : header.column.getSize() + (event.key === "ArrowRight" ? 12 : -12);
                          table.setColumnSizing((current) => ({ ...current, [header.column.id]: clampWidth(next, source) }));
                        }}
                      />
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? Array.from({ length: Math.max(1, loadingRows) }, (_, rowIndex) => (
          <TableRow key={`loading-${rowIndex}`} aria-hidden="true">
            {selectable && <TableCell className="whatiuse-data-table__selection-cell"><Skeleton width={16} height={16} /></TableCell>}
            {visibleColumns.map((column, columnIndex) => <TableCell key={column.id} data-align={column.align ?? "start"}><Skeleton width={columnIndex === 0 ? "68%" : "48%"} height={10} /></TableCell>)}
          </TableRow>
        )) : error ? (
          <TableRow><TableCell className="whatiuse-data-table__state" colSpan={colSpan}><EmptyState size="compact" icon={<WarningCircle />} title="Could not load data" description={error} primaryAction={onRetry ? <Button size="small" onClick={onRetry}>Try again</Button> : undefined} /></TableCell></TableRow>
        ) : rows.length === 0 ? (
          <TableRow><TableCell className="whatiuse-data-table__state" colSpan={colSpan}><EmptyState size="compact" title={emptyTitle} description={emptyDescription} /></TableCell></TableRow>
        ) : virtualized ? (
          <>
            {topPadding > 0 && <TableRow className="whatiuse-data-table__virtual-spacer" aria-hidden="true"><TableCell colSpan={colSpan} style={{ height: topPadding }} /></TableRow>}
            {virtualRows.map((virtualRow) => renderRow(rows[virtualRow.index], virtualRow.index))}
            {bottomPadding > 0 && <TableRow className="whatiuse-data-table__virtual-spacer" aria-hidden="true"><TableCell colSpan={colSpan} style={{ height: bottomPadding }} /></TableRow>}
          </>
        ) : rows.map((row) => renderRow(row))}
      </TableBody>
    </Table>
  );

  const displayedCount = rowCount ?? data.length;
  const showPagination = paginate && !loading && !error && (knownPageCount ? totalPages > 1 : currentPage > 1 || Boolean(hasNextPage));
  return (
    <div
      className={cn("whatiuse-data-table", className)}
      data-loading={loading || undefined}
      data-fetching={isFetching || undefined}
      data-virtualized={virtualized || undefined}
    >
      {virtualized ? (
        <div ref={viewportRef} className="whatiuse-data-table__virtual-viewport" style={{ height: virtualHeight }}>
          {tableNode}
        </div>
      ) : tableNode}
      {isFetching && !loading && <div className="whatiuse-data-table__fetching"><Spinner size="small" label="Updating data" /><span>Updating</span></div>}
      {showPagination && (
        <footer className="whatiuse-data-table__footer">
          <span>{displayedCount} records</span>
          {knownPageCount ? (
            <Pagination page={currentPage} totalPages={Math.max(1, totalPages)} onPageChange={(nextPage) => table.setPageIndex(nextPage - 1)} label={`${ariaLabel} pages`} />
          ) : (
            <nav className="whatiuse-data-table__unknown-pages" aria-label={`${ariaLabel} pages`}>
              <button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => table.previousPage()}><CaretLeft /></button>
              <span>Page {currentPage}</span>
              <button type="button" aria-label="Next page" disabled={!hasNextPage} onClick={() => table.nextPage()}><CaretRight /></button>
            </nav>
          )}
        </footer>
      )}
      <span className="whatiuse-sr-only" aria-live="polite">{Object.values(selectionState).filter(Boolean).length} rows selected</span>
    </div>
  );
}
