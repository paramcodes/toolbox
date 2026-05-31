import Link from "next/link";
import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link className="tool-card" href={tool.href}>
      <span className="tool-card__accent" style={{ background: tool.accent }} />
      <span className="tool-card__status">{tool.status}</span>
      <strong>{tool.name}</strong>
      <span>{tool.description}</span>
    </Link>
  );
}
