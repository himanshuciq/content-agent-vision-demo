"use client"

import { cn } from "@/lib/utils"
import { AGENT_DOT } from "../agent-style"
import { BUSINESS, fmtBiz } from "../data"
import { useLive } from "../live-model"
import { money, ownerOf, sum } from "../model"
import type { Tier } from "../model"
import { useNudge } from "../nudge-context"
import { AGENT_LABEL, type AgentId } from "../types"

// Same trailing columns as the other stage tables (value 100px, action 140px, 20px), so values line up.
const GRID = "grid grid-cols-[minmax(0,1fr)_340px_100px_140px_20px] items-center gap-4"

/** The bridge's colors, so each area's bar reads as the same buckets as the chart above it. */
const BUCKETS: { tier: Tier; label: string; bar: string }[] = [
  { tier: "approval", label: "One approval away", bar: "bg-brand-500" },
  { tier: "input", label: "Needs your team", bar: "bg-warning-500" },
  { tier: "autopilot", label: "On autopilot", bar: "bg-info-500" },
]

/** Content first for the demo, then the rest. */
const ORDER: AgentId[] = ["content", "ops", "media"]

/**
 * The "Total opportunity" drill-down: the open money by area, each split into the
 * bridge's three buckets on one scale, so the biggest area and what it's made of
 * read at a glance. Live: it shrinks as the team acts.
 */
export function AreaDetail() {
  const { snapshot, open, pace } = useLive()
  const { approved } = useNudge()
  const openItems = snapshot.items.filter((i) => !approved[i.id])

  const rows = ORDER.map((lever) => {
    const items = openItems.filter((i) => i.lever === lever)
    return {
      lever,
      owner: ownerOf(snapshot, lever)?.name,
      total: sum(items),
      parts: BUCKETS.map((b) => ({ ...b, value: sum(items.filter((i) => i.tier === b.tier)) })),
    }
  })
  const max = Math.max(...rows.map((r) => r.total), 0.001)
  const landing = pace("quarter") + open.total

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
      <div className={cn(GRID, "border-b border-slate-100 bg-slate-25 px-6 py-4")}>
        <div className="col-span-2 min-w-0">
          <div className="text-lg font-semibold text-slate-950">Open opportunity by area</div>
          <div className="mt-0.5 text-sm text-slate-500">
            <span className="font-mono font-semibold text-slate-950">{fmtBiz(pace("quarter"))}</span> current run rate +{" "}
            <span className="font-mono font-semibold text-slate-950">{open.totalLabel}</span> open ={" "}
            <span className="font-mono font-semibold text-slate-950">{fmtBiz(landing)}</span>, against a{" "}
            <span className="font-mono font-semibold text-slate-950">{fmtBiz(BUSINESS.quarter.plan)}</span> plan.
          </div>
        </div>
        <span className="text-right font-mono text-[15px] font-bold text-slate-950 tabular-nums">{open.totalLabel}</span>
        <div />
        <div />
      </div>

      <div className={cn(GRID, "px-6 pt-3 pb-1 text-xs font-medium text-slate-500")}>
        <span>Area</span>
        <span className="flex gap-x-3 whitespace-nowrap">
          {BUCKETS.map((b) => (
            <span key={b.tier} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", b.bar)} />
              {b.label}
            </span>
          ))}
        </span>
        <span className="text-right">Value</span>
        <span />
        <span />
      </div>

      <div className="px-6 pb-1.5">
        {rows.map((r) => (
          <div key={r.lever} className={cn(GRID, "border-t border-slate-100 py-3.5 first:border-t-0")}>
            <span className="flex items-center gap-2.5 text-sm">
              <span className={`size-2 rounded-sm ${AGENT_DOT[r.lever]}`} />
              <span className="font-medium text-slate-950">{AGENT_LABEL[r.lever]}</span>
              {r.owner && <span className="text-slate-500">{r.owner}</span>}
            </span>
            <div>
              <div className="flex h-2 gap-0.5" style={{ width: `${(r.total / max) * 100}%` }}>
                {r.parts
                  .filter((p) => p.value > 0)
                  .map((p) => (
                    <div key={p.tier} title={`${p.label} ${money(p.value)}`} className={cn("h-full rounded-full", p.bar)} style={{ flex: `${p.value} 1 0` }} />
                  ))}
              </div>
              <div className="mt-1.5 flex gap-3 font-mono text-xs text-slate-500 tabular-nums">
                {r.parts.map((p) => (
                  <span key={p.tier} className="inline-flex items-center gap-1">
                    <span className={cn("size-1.5 rounded-full", p.bar)} />
                    {p.value > 0 ? money(p.value) : "—"}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-right font-mono text-[15px] font-semibold text-slate-950 tabular-nums">{r.total > 0 ? money(r.total) : "—"}</span>
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  )
}
