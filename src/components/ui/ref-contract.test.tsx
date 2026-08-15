import { render } from "@testing-library/react";
import { DeviceMobile, Monitor } from "@phosphor-icons/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Combobox,
  ContextSwitcher,
  Pagination,
  Skeleton,
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Textarea,
  TextField,
} from ".";

describe("React 19 ref contract", () => {
  it("exposes the primary native element for product composition", () => {
    const alertRef = createRef<HTMLDivElement>();
    const avatarRef = createRef<HTMLSpanElement>();
    const badgeRef = createRef<HTMLSpanElement>();
    const breadcrumbsRef = createRef<HTMLElement>();
    const comboboxRef = createRef<HTMLInputElement>();
    const contextSwitcherRef = createRef<HTMLButtonElement>();
    const paginationRef = createRef<HTMLElement>();
    const skeletonRef = createRef<HTMLDivElement>();
    const selectRef = createRef<HTMLButtonElement>();
    const spinnerRef = createRef<HTMLSpanElement>();
    const tableRef = createRef<HTMLTableElement>();
    const textareaRef = createRef<HTMLTextAreaElement>();
    const textFieldRef = createRef<HTMLInputElement>();

    render(
      <>
        <Alert ref={alertRef} title="Sync complete" />
        <Avatar ref={avatarRef} fallback="AS" />
        <Badge ref={badgeRef}>Ready</Badge>
        <Breadcrumbs ref={breadcrumbsRef} items={[{ label: "Workspace" }]} />
        <Combobox ref={comboboxRef} label="Assignee" options={[{ label: "Avery Stone", value: "avery" }]} />
        <ContextSwitcher ref={contextSwitcherRef} aria-label="Platform" defaultValue="web" options={[
          { value: "web", label: "Web", description: "Browser interfaces", icon: <Monitor /> },
          { value: "native", label: "Native", description: "Mobile applications", icon: <DeviceMobile /> },
        ]} />
        <Pagination ref={paginationRef} page={1} totalPages={1} onPageChange={() => undefined} />
        <Skeleton ref={skeletonRef} />
        <Select ref={selectRef} label="Priority" options={[{ label: "High", value: "high" }]} />
        <Spinner ref={spinnerRef} />
        <Table ref={tableRef}><TableBody><TableRow><TableCell>One</TableCell></TableRow></TableBody></Table>
        <Textarea ref={textareaRef} label="Notes" />
        <TextField ref={textFieldRef} label="Title" />
      </>,
    );

    expect(alertRef.current?.tagName).toBe("DIV");
    expect(avatarRef.current?.tagName).toBe("SPAN");
    expect(badgeRef.current?.tagName).toBe("SPAN");
    expect(breadcrumbsRef.current?.tagName).toBe("NAV");
    expect(comboboxRef.current?.tagName).toBe("INPUT");
    expect(contextSwitcherRef.current?.tagName).toBe("BUTTON");
    expect(paginationRef.current?.tagName).toBe("NAV");
    expect(skeletonRef.current?.tagName).toBe("DIV");
    expect(selectRef.current?.tagName).toBe("BUTTON");
    expect(spinnerRef.current?.tagName).toBe("SPAN");
    expect(tableRef.current?.tagName).toBe("TABLE");
    expect(textareaRef.current?.tagName).toBe("TEXTAREA");
    expect(textFieldRef.current?.tagName).toBe("INPUT");
  });
});
