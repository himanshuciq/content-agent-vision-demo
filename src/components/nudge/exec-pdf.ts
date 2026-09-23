import {
  INFLIGHT,
  CLOSED,
  OPEN_TOTAL,
  APPROVAL_TIER,
  TEAM_TIER,
  AUTOPILOT_TIER,
  BANKED_VALUE,
  TOTAL_VALUE,
  DEADLINE,
} from "./data"
import { AGENT_LABEL, type Period, type TierRow } from "./types"

const INK: [number, number, number] = [3, 7, 18]
const MUTED: [number, number, number] = [107, 114, 128]
const BRAND: [number, number, number] = [124, 58, 237]
const WARN: [number, number, number] = [180, 83, 9]
const GOOD: [number, number, number] = [4, 120, 87]
const HAIR: [number, number, number] = [226, 232, 240]

/**
 * Builds and downloads the exec summary PDF from the live figures — every tier
 * fully expanded to its line items, so the emailed version carries the detail
 * the collapsed UI hides. jsPDF is imported on demand.
 */
export async function downloadExecSummary(period: Period) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "letter" })
  const M = 56
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const cur = INFLIGHT[period]
  const closed = CLOSED.quarter
  let y = 66

  const text = (s: string, x: number, opts?: { size?: number; bold?: boolean; color?: [number, number, number]; align?: "left" | "right" }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal")
    doc.setFontSize(opts?.size ?? 11)
    doc.setTextColor(...(opts?.color ?? INK))
    doc.text(s, opts?.align === "right" ? W - M : x, y, { align: opts?.align ?? "left" })
  }
  const rule = () => {
    doc.setDrawColor(...HAIR)
    doc.line(M, y, W - M, y)
  }
  const ensure = (need: number) => {
    if (y + need > H - 56) {
      doc.addPage()
      y = 66
    }
  }

  // Header
  text("Ally — Executive summary", M, { size: 20, bold: true })
  y += 18
  text(`${cur.name} · in flight · prepared ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`, M, { size: 10, color: MUTED })
  y += 16
  rule()
  y += 30

  // Open opportunity
  text(`${OPEN_TOTAL} incremental sales opportunity open this ${period}`, M, { size: 16, bold: true })
  y += 20
  text(`${APPROVAL_TIER.effort} of your team's time unlocks ${APPROVAL_TIER.value}`, M, { size: 12, bold: true, color: BRAND })
  y += 15
  text(`Expires in ${DEADLINE.days} days`, M, { size: 11, bold: true, color: WARN })
  y += 28

  // How the quarter is tracking
  text("How the quarter is tracking", M, { size: 10, bold: true, color: MUTED })
  y += 16
  text(`${cur.ptd} ${cur.ptdLabel} · ${cur.plan} to plan · ${cur.share}`, M, { size: 11 })
  y += 24
  rule()
  y += 26

  // Delivered last quarter (expanded)
  text(`AllyAI drove ${closed.total} in incremental sales last quarter`, M, { size: 13, bold: true })
  y += 20
  ;([
    ["content agent", closed.content, closed.contentStory],
    ["media agent", closed.media, closed.mediaStory],
    ["ops agent", closed.ops, closed.opsStory],
  ] as [string, string, string][]).forEach(([agent, val, story]) => {
    ensure(40)
    text(agent, M, { size: 11, bold: true })
    text(val, 0, { size: 11, bold: true, align: "right" })
    y += 14
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(...MUTED)
    const lines = doc.splitTextToSize(story, W - 2 * M - 70) as string[]
    doc.text(lines, M, y)
    y += lines.length * 12 + 12
  })
  y += 4
  rule()
  y += 26

  // Where it sits today (every tier expanded to line items)
  text("Where it sits today", M, { size: 10, bold: true, color: MUTED })
  y += 22

  // Banked
  text("Banked", M, { size: 12, bold: true })
  text("Live this quarter", M + doc.getTextWidth("Banked") + 10, { size: 10, color: GOOD })
  text(BANKED_VALUE, 0, { size: 12, bold: true, align: "right" })
  y += 24

  const tier = (title: string, effort: string, value: string, rows: TierRow[]) => {
    ensure(40 + rows.length * 30)
    text(title, M, { size: 12, bold: true })
    text(effort, M + doc.getTextWidth(title) + 10, { size: 10, color: MUTED })
    text(value, 0, { size: 12, bold: true, align: "right" })
    y += 18
    rows.forEach((r) => {
      const owner = r.analystName ? `${r.analystName} ${AGENT_LABEL[r.agent]}` : AGENT_LABEL[r.agent]
      text(owner, M + 14, { size: 10, bold: true })
      text(r.value, 0, { size: 10, bold: true, align: "right" })
      y += 13
      const note = r.deadline ? `${r.description}  (${r.deadline})` : r.description
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(...MUTED)
      const lines = doc.splitTextToSize(note, W - 2 * M - 90) as string[]
      doc.text(lines, M + 14, y)
      y += lines.length * 12 + 10
    })
    y += 6
  }

  tier("One approval away", APPROVAL_TIER.effort, APPROVAL_TIER.value, APPROVAL_TIER.rows)
  tier("Needs your team", TEAM_TIER.effort, TEAM_TIER.value, TEAM_TIER.rows)
  tier("On autopilot", AUTOPILOT_TIER.effort, AUTOPILOT_TIER.value, AUTOPILOT_TIER.rows)

  ensure(30)
  rule()
  y += 22
  text("Total value this quarter", M, { size: 13, bold: true })
  text(TOTAL_VALUE, 0, { size: 15, bold: true, align: "right" })

  doc.save(`ally-exec-summary-${cur.name.replace(/\s+/g, "-").toLowerCase()}.pdf`)
}
