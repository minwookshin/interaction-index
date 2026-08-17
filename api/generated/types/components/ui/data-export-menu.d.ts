import { type DataExportArtifact, type DataExportColumn } from "../../lib/data-export";
export type DataExportMenuProps<TData> = {
    rows: readonly TData[];
    selectedRows?: readonly TData[];
    columns: readonly DataExportColumn<TData>[];
    fileName: string;
    label?: string;
    download?: boolean;
    disabled?: boolean;
    onExport?: (artifact: DataExportArtifact, scope: "visible" | "selected") => void;
};
export declare function DataExportMenu<TData>({ rows, selectedRows, columns, fileName, label, download, disabled, onExport, }: DataExportMenuProps<TData>): import("react").JSX.Element;
