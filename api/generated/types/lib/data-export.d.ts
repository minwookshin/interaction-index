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
export declare function buildDataExport<TData>({ rows, columns, format, fileName, includeBom, }: DataExportOptions<TData>): DataExportArtifact;
export declare function downloadDataExport(artifact: DataExportArtifact): void;
