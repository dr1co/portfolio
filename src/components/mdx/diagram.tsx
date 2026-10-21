import { useId } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type DiagramNode = { id: string; label: string; x: number; y: number };
type DiagramEdge = { from: string; to: string; label?: string };
type Point = { x: number; y: number };

const BOX = { width: 150, height: 44 };

function borderPoint(from: Point, toward: Point): Point {
  const dx = toward.x - from.x;
  const dy = toward.y - from.y;
  const scale = Math.min(
    dx === 0 ? Infinity : BOX.width / 2 / Math.abs(dx),
    dy === 0 ? Infinity : BOX.height / 2 / Math.abs(dy),
  );
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

function labelPosition(from: Point, to: Point) {
  const horizontal = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y);
  return horizontal
    ? {
        x: (from.x + to.x) / 2,
        y: Math.min(from.y, to.y) - BOX.height / 2 - 8,
        textAnchor: "middle" as const,
      }
    : {
        x: (from.x + to.x) / 2 + 8,
        y: (from.y + to.y) / 2,
        textAnchor: "start" as const,
        dominantBaseline: "central" as const,
      };
}

/**
 * Architecture diagram from nodes (box centers in viewBox units) and directed edges, styled with theme tokens.
 * Also renders a screen-reader list describing every edge, so the diagram never relies on visuals alone.
 */
export function Diagram({
  title,
  nodes,
  edges,
  width,
  height,
}: {
  title: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  width: number;
  height: number;
}) {
  const id = useId();
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const resolved = edges.flatMap((edge) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    return from && to ? [{ ...edge, from, to }] : [];
  });

  return (
    <figure className="my-8">
      <ScrollArea
        label={`${title} (scrollable)`}
        className="rounded-lg border border-border bg-surface p-4"
      >
        <svg
          role="img"
          aria-labelledby={`${id}-title`}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto h-auto w-full"
          style={{ minWidth: Math.min(width, 560) }}
        >
          <title id={`${id}-title`}>{title}</title>
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10z" className="fill-muted" />
            </marker>
          </defs>
          {resolved.map(({ from, to }) => {
            const start = borderPoint(from, to);
            const end = borderPoint(to, from);
            return (
              <line
                key={`${from.id}-${to.id}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className="stroke-muted"
                strokeWidth={1.5}
                markerEnd={`url(#${id}-arrow)`}
              />
            );
          })}
          {nodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x - BOX.width / 2}
                y={node.y - BOX.height / 2}
                width={BOX.width}
                height={BOX.height}
                rx={8}
                className="fill-surface-elevated stroke-border"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-[13px] font-medium"
              >
                {node.label}
              </text>
            </g>
          ))}
          {resolved.map(({ from, to, label }) => {
            if (!label) return null;
            const position = labelPosition(from, to);
            return (
              <text
                key={`${from.id}-${to.id}-label`}
                {...position}
                className="fill-muted stroke-surface font-mono text-[11px] [paint-order:stroke]"
                strokeWidth={4}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </ScrollArea>
      <figcaption className="mt-2 text-center text-sm text-muted">
        {title}
      </figcaption>
      <ul aria-label={`${title}, described`} className="sr-only">
        {resolved.map(({ from, to, label }) => (
          <li key={`${from.id}-${to.id}`}>
            {`${from.label} → ${to.label}${label ? `: ${label}` : ""}`}
          </li>
        ))}
      </ul>
    </figure>
  );
}
