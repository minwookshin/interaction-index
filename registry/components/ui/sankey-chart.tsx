"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/sankey-chart.css";
import { useId, useMemo, type KeyboardEvent, type ReactNode } from "react";
import { formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsFrame, AnalyticsInspection, analyticsClassNames, getLinearAnalyticsKeyIndex, useAnalyticsActiveIndex } from "./analytics-frame";

export type SankeyNode = {
  id: string;
  label: string;
  column?: number;
};

export type SankeyLink = {
  id: string;
  source: string;
  target: string;
  value: number;
  label?: string;
};

export type SankeyChartProps = {
  title: string;
  description?: string;
  nodes: readonly SankeyNode[];
  links: readonly SankeyLink[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  activeLinkIndex?: number | null;
  defaultActiveLinkIndex?: number | null;
  onActiveLinkIndexChange?: (index: number | null) => void;
  onLinkActivate?: (link: SankeyLink, index: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

type PositionedNode = SankeyNode & { x: number; y: number; width: number; height: number; columnIndex: number };
type PositionedLink = SankeyLink & { sourceNode: PositionedNode; targetNode: PositionedNode; path: string; midpointX: number; midpointY: number; width: number };

const sankeyBox = { width: 640, height: 260, left: 68, right: 68, top: 22, bottom: 22, nodeWidth: 92 } as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildSankeyLayout(nodes: readonly SankeyNode[], links: readonly SankeyLink[]) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const validLinks = links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target) && Number.isFinite(link.value) && link.value >= 0);
  const explicit = new Set(nodes.filter((node) => Number.isFinite(node.column)).map((node) => node.id));
  const columns = new Map(nodes.map((node) => [node.id, Math.max(0, Math.round(node.column ?? 0))]));
  for (let pass = 0; pass < nodes.length; pass += 1) {
    let changed = false;
    validLinks.forEach((link) => {
      if (explicit.has(link.target)) return;
      const next = Math.max(columns.get(link.target) ?? 0, (columns.get(link.source) ?? 0) + 1);
      if (next !== columns.get(link.target) && next <= nodes.length) {
        columns.set(link.target, next);
        changed = true;
      }
    });
    if (!changed) break;
  }
  const orderedColumns = [...new Set(columns.values())].sort((a, b) => a - b);
  const normalizedColumn = new Map(orderedColumns.map((value, index) => [value, index]));
  const lastColumn = Math.max(1, orderedColumns.length - 1);
  const magnitude = new Map(nodes.map((node) => {
    const incoming = validLinks.filter((link) => link.target === node.id).reduce((sum, link) => sum + link.value, 0);
    const outgoing = validLinks.filter((link) => link.source === node.id).reduce((sum, link) => sum + link.value, 0);
    return [node.id, Math.max(1, incoming, outgoing)];
  }));
  const grouped = new Map<number, SankeyNode[]>();
  nodes.forEach((node) => {
    const columnIndex = normalizedColumn.get(columns.get(node.id) ?? 0) ?? 0;
    grouped.set(columnIndex, [...(grouped.get(columnIndex) ?? []), node]);
  });
  const positionedNodes: PositionedNode[] = [];
  grouped.forEach((items, columnIndex) => {
    const available = sankeyBox.height - sankeyBox.top - sankeyBox.bottom;
    const lane = available / Math.max(1, items.length);
    const maximum = Math.max(...items.map((node) => magnitude.get(node.id) ?? 1), 1);
    items.forEach((node, index) => {
      const weighted = (magnitude.get(node.id) ?? 1) / maximum;
      positionedNodes.push({
        ...node,
        columnIndex,
        x: sankeyBox.left + columnIndex / lastColumn * (sankeyBox.width - sankeyBox.left - sankeyBox.right),
        y: sankeyBox.top + (index + .5) * lane,
        width: sankeyBox.nodeWidth,
        height: clamp(lane * (.32 + weighted * .32), 18, Math.min(48, lane * .72)),
      });
    });
  });
  const byId = new Map(positionedNodes.map((node) => [node.id, node]));
  const maximumLink = Math.max(...validLinks.map((link) => link.value), 1);
  const positionedLinks: PositionedLink[] = validLinks.flatMap((link) => {
    const sourceNode = byId.get(link.source);
    const targetNode = byId.get(link.target);
    if (!sourceNode || !targetNode) return [];
    const sourceX = sourceNode.x + sourceNode.width / 2;
    const targetX = targetNode.x - targetNode.width / 2;
    const direction = targetX >= sourceX ? 1 : -1;
    const control = Math.max(28, Math.abs(targetX - sourceX) * .48) * direction;
    const path = `M${sourceX.toFixed(2)},${sourceNode.y.toFixed(2)} C${(sourceX + control).toFixed(2)},${sourceNode.y.toFixed(2)} ${(targetX - control).toFixed(2)},${targetNode.y.toFixed(2)} ${targetX.toFixed(2)},${targetNode.y.toFixed(2)}`;
    return [{ ...link, sourceNode, targetNode, path, midpointX: (sourceX + targetX) / 2, midpointY: (sourceNode.y + targetNode.y) / 2, width: 2.5 + Math.sqrt(link.value / maximumLink) * 10 }];
  });
  return { nodes: positionedNodes, links: positionedLinks } as const;
}

export function SankeyChart({
  title,
  description,
  nodes,
  links,
  className,
  height = 260,
  valueFormatter = formatAnalyticsValue,
  activeLinkIndex,
  defaultActiveLinkIndex = null,
  onActiveLinkIndexChange,
  onLinkActivate,
  loading = false,
  empty = "No flow data for this range.",
  error,
  showDataByDefault = false,
}: SankeyChartProps) {
  const id = useId();
  const layout = useMemo(() => buildSankeyLayout(nodes, links), [links, nodes]);
  const { activeIndex: active, setActiveIndex, scheduleActiveIndex, clearActiveIndex } = useAnalyticsActiveIndex({
    length: layout.links.length,
    value: activeLinkIndex,
    defaultValue: defaultActiveLinkIndex,
    onChange: onActiveLinkIndexChange,
  });
  const activeLink = active === null ? null : layout.links[active];
  const instructionsId = `${id}-instructions`;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && activeLink && active !== null && onLinkActivate) {
      event.preventDefault();
      onLinkActivate(activeLink, active);
      return;
    }
    const next = getLinearAnalyticsKeyIndex(event.key, active, layout.links.length);
    if (next === undefined) return;
    event.preventDefault();
    setActiveIndex(next);
  };
  const plot = (
    <div
      className={cn(analyticsClassNames.interactivePlot, "whatiuse-sankey-chart__plot")}
      role="group"
      aria-roledescription="interactive flow chart"
      aria-label={`${title}. ${layout.nodes.length} nodes and ${layout.links.length} flows.`}
      aria-describedby={instructionsId}
      tabIndex={layout.links.length && !loading && !error ? 0 : -1}
      onPointerLeave={clearActiveIndex}
      onKeyDown={handleKeyDown}
      onClick={() => { if (activeLink && active !== null) onLinkActivate?.(activeLink, active); }}
    >
      <p id={instructionsId} className="whatiuse-sr-only">Use Arrow keys to inspect flows in data order. Use Home and End to jump. Press Escape to clear.{onLinkActivate ? " Press Enter to open the active flow." : ""}</p>
      <svg viewBox={`0 0 ${sankeyBox.width} ${sankeyBox.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g className="whatiuse-sankey-chart__links">
          {layout.links.map((link, index) => <path key={link.id} d={link.path} strokeWidth={link.width} data-active={active === index || undefined} data-muted={active !== null && active !== index || undefined} onPointerEnter={() => scheduleActiveIndex(index)} />)}
        </g>
        <g className="whatiuse-sankey-chart__nodes">
          {layout.nodes.map((node) => <g key={node.id} transform={`translate(${(node.x - node.width / 2).toFixed(2)} ${(node.y - node.height / 2).toFixed(2)})`}><rect width={node.width} height={node.height} rx={5} /><text x={node.width / 2} y={node.height / 2} textAnchor="middle">{node.label}</text></g>)}
        </g>
      </svg>
    </div>
  );
  const table = (
    <table>
      <caption>{title} data</caption>
      <thead><tr><th scope="col">Flow</th><th scope="col">From</th><th scope="col">To</th><th scope="col">Value</th></tr></thead>
      <tbody>{layout.links.map((link) => <tr key={link.id}><th scope="row">{link.label ?? `${link.sourceNode.label} to ${link.targetNode.label}`}</th><td>{link.sourceNode.label}</td><td>{link.targetNode.label}</td><td>{valueFormatter(link.value)}</td></tr>)}</tbody>
    </table>
  );
  const summary = layout.links.length ? `${title} contains ${layout.links.length} flows across ${layout.nodes.length} nodes. The largest flow is ${valueFormatter(Math.max(...layout.links.map((link) => link.value)))}.` : `${title} has no data.`;
  const largestLink = layout.links.reduce<PositionedLink | null>((largest, link) => !largest || link.value > largest.value ? link : largest, null);
  const inspectedLink = activeLink ?? largestLink;
  const inspectedLabel = inspectedLink ? inspectedLink.label ?? `${inspectedLink.sourceNode.label} to ${inspectedLink.targetNode.label}` : `${layout.links.length} flows`;
  const inspection = (
    <AnalyticsInspection
      active={activeLink !== null}
      label={activeLink ? inspectedLabel : `${layout.links.length} flows`}
      items={inspectedLink ? [{ id: inspectedLink.id, label: activeLink ? "Volume" : inspectedLabel, value: valueFormatter(inspectedLink.value) }] : []}
    />
  );
  return <AnalyticsFrame className={cn("whatiuse-sankey-chart", className)} title={title} description={description} height={height} summary={summary} plotLabel={`${title} Sankey chart`} plot={plot} table={table} loading={loading} empty={!layout.links.length ? empty : undefined} error={error} activeDescription={activeLink ? `${activeLink.sourceNode.label} to ${activeLink.targetNode.label}. ${valueFormatter(activeLink.value)}.` : ""} inspection={inspection} showDataByDefault={showDataByDefault} />;
}
