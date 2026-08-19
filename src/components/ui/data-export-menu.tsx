import { DownloadSimple, FileCode, FileCsv } from "@phosphor-icons/react";
import { useState } from "react";
import {
  buildDataExport,
  downloadDataExport,
  type DataExportArtifact,
  type DataExportColumn,
  type DataExportFormat,
} from "../../lib/data-export";
import { Button } from "./button";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "./menu";

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

export function DataExportMenu<TData>({
  rows,
  selectedRows = [],
  columns,
  fileName,
  label = "Export",
  download = true,
  disabled = false,
  onExport,
}: DataExportMenuProps<TData>) {
  const [announcement, setAnnouncement] = useState("");
  const runExport = (format: DataExportFormat, scope: "visible" | "selected") => {
    const source = scope === "selected" ? selectedRows : rows;
    const artifact = buildDataExport({
      rows: source,
      columns,
      format,
      fileName: scope === "selected" ? `${fileName}-selected` : fileName,
    });
    onExport?.(artifact, scope);
    if (download) downloadDataExport(artifact);
    setAnnouncement(`${artifact.rowCount} rows exported as ${format.toUpperCase()}`);
  };

  return (
    <>
      <Menu>
        <MenuTrigger render={<Button size="small" variant="ghost" leadingIcon={<DownloadSimple />} disabled={disabled || rows.length === 0} />}>{label}</MenuTrigger>
        <MenuContent className="whatiuse-data-export" align="end">
          <MenuLabel>All rows</MenuLabel>
          <MenuItem aria-label="Export all rows as CSV" onClick={() => runExport("csv", "visible")}><FileCsv aria-hidden="true" /><span className="whatiuse-data-export__copy"><strong>CSV</strong><small>{rows.length} rows</small></span></MenuItem>
          <MenuItem aria-label="Export all rows as JSON" onClick={() => runExport("json", "visible")}><FileCode aria-hidden="true" /><span className="whatiuse-data-export__copy"><strong>JSON</strong><small>{rows.length} rows</small></span></MenuItem>
          {selectedRows.length > 0 && (
            <>
              <MenuSeparator />
              <MenuLabel>Selected</MenuLabel>
              <MenuItem aria-label="Export selected rows as CSV" onClick={() => runExport("csv", "selected")}><FileCsv aria-hidden="true" /><span className="whatiuse-data-export__copy"><strong>CSV</strong><small>{selectedRows.length} selected</small></span></MenuItem>
              <MenuItem aria-label="Export selected rows as JSON" onClick={() => runExport("json", "selected")}><FileCode aria-hidden="true" /><span className="whatiuse-data-export__copy"><strong>JSON</strong><small>{selectedRows.length} selected</small></span></MenuItem>
            </>
          )}
        </MenuContent>
      </Menu>
      <span className="whatiuse-sr-only" aria-live="polite">{announcement}</span>
    </>
  );
}
