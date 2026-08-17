export type DataExportFormat = "csv" | "json";

export type DataExportColumn<TData> = {
  id: string;
  header: string;
  value: keyof TData | ((row: TData) => unknown);
  format?: (value: unknown, row: TData) => string | number | boolean | null;
};

export type DataExportOptions<TData> = {
  rows: readonly TData[];
  columns: readonly DataExportColumn<TData>[];
  format: DataExportFormat;
  fileName: string;
  includeBom?: boolean;
};

export type DataExportArtifact = {
  content: string;
  fileName: string;
  mimeType: string;
  rowCount: number;
  format: DataExportFormat;
};

function readColumnValue<TData>(row: TData, column: DataExportColumn<TData>): unknown {
  return typeof column.value === "function" ? column.value(row) : row[column.value];
}

function normalizeExportValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  return JSON.stringify(value);
}

function protectSpreadsheetFormula(value: string): string {
  return /^[\t\r ]*[=+\-@]/.test(value) ? `'${value}` : value;
}

function escapeCsv(value: string | number | boolean | null): string {
  const normalized = protectSpreadsheetFormula(value === null ? "" : String(value));
  return /[",\r\n]/.test(normalized) ? `"${normalized.replaceAll('"', '""')}"` : normalized;
}

function safeFileName(value: string, extension: DataExportFormat): string {
  const base = value.trim().replace(/\.(csv|json)$/i, "").replace(/[\\/:*?"<>|]+/g, "-").slice(0, 120) || "export";
  return `${base}.${extension}`;
}

export function buildDataExport<TData>({
  rows,
  columns,
  format,
  fileName,
  includeBom = format === "csv",
}: DataExportOptions<TData>): DataExportArtifact {
  const records = rows.map((row) => Object.fromEntries(columns.map((column) => {
    const raw = readColumnValue(row, column);
    return [column.header, column.format ? column.format(raw, row) : normalizeExportValue(raw)];
  })));
  const content = format === "json"
    ? JSON.stringify(records, null, 2)
    : `${includeBom ? "\uFEFF" : ""}${[
      columns.map((column) => escapeCsv(column.header)).join(","),
      ...records.map((record) => columns.map((column) => escapeCsv(record[column.header] ?? null)).join(",")),
    ].join("\r\n")}`;
  return {
    content,
    fileName: safeFileName(fileName, format),
    mimeType: format === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8",
    rowCount: rows.length,
    format,
  };
}

export function downloadDataExport(artifact: DataExportArtifact): void {
  if (typeof document === "undefined" || typeof URL === "undefined") return;
  const url = URL.createObjectURL(new Blob([artifact.content], { type: artifact.mimeType }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = artifact.fileName;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
