"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AGENT_DOT } from "../agent-style"
import { AUTOPILOT_BEST_IN_CLASS, OPEN_BY_AREA, fmtM } from "../data"
import type { WaterfallStage } from "../data"
import { AGENT_LABEL, type AgentId } from "../types"

const GRID = "grid grid-cols-[minmax(0,1fr)_72px_96px_96px_148px] items-center gap-4"

/** "$0.2M" or "$200K" → $M. */
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)
const openOf = (agent: AgentId) => money(OPEN_BY_AREA.find((a) => a.agent === agent)!.value)

/**
 * The autopilot drill-down: for each workstream, how much of its open money
 * already runs itself, against best in class, and the one action that closes
 * the gap. Same pattern as Nudge: all at once in the header, or one row on hover.
 */
export function AutopilotDetail({ stage }: { stage: WaterfallStage }) {
  const [raised, setRaised] = useState<Partial<Record<AgentId, boolean>>>({})

  const rows = stage.rows.map((r) => {
    const open = openOf(r.agent)
    return { ...r, share: Math.round((money(r.value) / open) * 100), best: AUTOPILOT_BEST_IN_CLASS[r.agent], open }
  })
  const totalOpen = rows.reduce((s, r) => s + r.open, 0)
  const share = Math.round((stage.value / totalOpen) * 100)
  const best = Math.round(rows.reduce((s, r) => s + (r.best / 100) * r.open, 0) / totalOpen * 100)
  const allRaised = rows.every((r) => raised[r.agent])

  function raise(agents: AgentId[]) {
    setRaised((prev) => ({ ...prev, ...Object.fromEntries(agents.map((a) => [a, true])) }))
    toast.success(
      agents.length > 1 ? "Autopilot raised toward best in class for content, media and ops" : `Autopilot raised toward best in class for ${agents[0]}`,
      { position: "top-right" },
    )
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
      <div className={cn(GRID, "border-b border-slate-100 bg-slate-25 px-6 py-4")}>
        <span className="text-lg font-semibold text-slate-950">{stage.label}</span>
        <span className="text-right font-mono text-[15px] font-bold text-slate-950 tabular-nums">{fmtM(stage.value)}</span>
        <span className="text-right font-mono text-[15px] font-bold text-slate-950 tabular-nums">{share}%</span>
        <span className="text-right font-mono text-[15px] font-semibold text-slate-500 tabular-nums">{best}%</span>
        <div className="justify-self-end">
          {allRaised ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700">
              <Check className="size-4" />
              Autopilot increased
            </span>
          ) : (
            <button
              type="button"
              onClick={() => raise(rows.filter((r) => !raised[r.agent]).map((r) => r.agent))}
              className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xs transition-colors hover:bg-brand-600"
            >
              Increase autopilot
            </button>
          )}
        </div>
      </div>

      <div className={cn(GRID, "px-6 pt-3 pb-1 text-xs text-slate-500")}>
        <span>What runs itself</span>
        <span className="text-right">Value</span>
        <span className="text-right">On autopilot</span>
        <span className="text-right">Best in class</span>
        <span />
      </div>

      <div className="px-6 pb-1.5">
        {rows.map((r) => (
          <div key={r.agent} className={cn(GRID, "group border-t border-slate-100 py-3.5 first:border-t-0")}>
            <div className="min-w-0">
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-950">
                <span className={`size-2 rounded-sm ${AGENT_DOT[r.agent]}`} />
                {AGENT_LABEL[r.agent]}
              </span>
              <p className="mt-0.5 ml-4.5 text-sm leading-relaxed text-slate-500">{r.description}</p>
            </div>
            <span className="text-right font-mono text-[15px] font-semibold text-slate-950 tabular-nums">{r.value}</span>
            <span className="text-right font-mono text-[15px] font-semibold text-slate-950 tabular-nums">{r.share}%</span>
            <span className="text-right font-mono text-[15px] text-slate-500 tabular-nums">{r.best}%</span>
            <div className="justify-self-end">
              {raised[r.agent] ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700">
                  <Check className="size-4" />
                  Increased
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => raise([r.agent])}
                  className="rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium whitespace-nowrap text-brand-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-brand-50 focus-visible:opacity-100"
                >
                  Increase autopilot
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
