import { describe, expect, it } from "vitest";
import { buildDataExport } from "./data-export";

type Account = { name: string; revenue: number; tags: string[] };

const columns = [
  { id: "name", header: "Account", value: "name" },
  { id: "revenue", header: "Revenue", value: "revenue" },
  { id: "tags", header: "Tags", value: "tags" },
] as const;

describe("Data export", () => {
  it("builds a safe CSV and neutralizes spreadsheet formulas", () => {
    const artifact = buildDataExport<Account>({
      rows: [{ name: "=IMPORTXML(\"https://example.com\")", revenue: 42, tags: ["active", "priority"] }],
      columns,
      format: "csv",
      fileName: "Customer / export.csv",
      includeBom: false,
    });

    expect(artifact.fileName).toBe("Customer - export.csv");
    expect(artifact.content).toContain("'=");
    expect(artifact.content).toContain('"active, priority"');
    expect(artifact.rowCount).toBe(1);
  });

  it("builds deterministic JSON with human-readable column names", () => {
    const artifact = buildDataExport<Account>({
      rows: [{ name: "Acme", revenue: 1200, tags: [] }],
      columns,
      format: "json",
      fileName: "accounts",
    });
    expect(artifact.fileName).toBe("accounts.json");
    expect(JSON.parse(artifact.content)).toEqual([{ Account: "Acme", Revenue: 1200, Tags: "" }]);
  });
});
