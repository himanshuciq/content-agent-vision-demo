import type { AgentId } from "./data"

/**
 * Compact currency for the exec home screen: K below a million, M above,
 * decimals trimmed so 46,200,000 reads "$46.2M" and 1,256,000 reads "$1.26M" —
 * never a sub-one value like "$0.48M".
 */
export function formatCompactUsd(value: number): string {
  const sign = value < 0 ? "-" : ""
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    const millions = (abs / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })
    return `${sign}$${millions}M`
  }
  if (abs >= 1_000) {
    return `${sign}$${Math.round(abs / 1000)}K`
  }
  return `${sign}$${abs.toLocaleString("en-US")}`
}

/** Share and YoY deltas render in points/percent as a bare number — the caller adds "up"/"slipped". */
export function formatPoints(value: number): string {
  return Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 1 })
}

export const AGENT_LABEL: Record<AgentId, string> = {
  content: "content agent",
  ops: "ops agent",
  media: "media agent",
}
