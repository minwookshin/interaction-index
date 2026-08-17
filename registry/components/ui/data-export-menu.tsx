"use client";

import "../../styles/teum-base.css";
import "../../styles/components/data-export-menu.css";
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
        <MenuContent className="teum-data-export" align="end">
          <MenuLabel>Visible rows · {rows.length}</MenuLabel>
          <MenuItem onClick={() => runExport("csv", "visible")}><FileCsv aria-hidden="true" />Export CSV</MenuItem>
          <MenuItem onClick={() => runExport("json", "visible")}><FileCode aria-hidden="true" />Export JSON</MenuItem>
          {selectedRows.length > 0 && (
            <>
              <MenuSeparator />
              <MenuLabel>Selected rows · {selectedRows.length}</MenuLabel>
              <MenuItem onClick={() => runExport("csv", "selected")}><FileCsv aria-hidden="true" />Export selected CSV</MenuItem>
              <MenuItem onClick={() => runExport("json", "selected")}><FileCode aria-hidden="true" />Export selected JSON</MenuItem>
            </>
          )}
        </MenuContent>
      </Menu>
      <span className="teum-sr-only" aria-live="polite">{announcement}</span>
    </>
  );
}
