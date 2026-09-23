import type { AgentId } from "./types"

/** Small square dot per agent, matching the reference's content=violet, ops=blue, media=green. */
export const AGENT_DOT: Record<AgentId, string> = {
  content: "bg-brand-600",
  ops: "bg-info-600",
  media: "bg-success-600",
}
