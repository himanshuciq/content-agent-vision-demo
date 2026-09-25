"use client"

import { cn } from "@/lib/utils"
import { opsBatches } from "../data"
import { useNudge } from "../nudge-context"
import { ApproveAll, GROUPS, ITEM_ACTIVE, ITEM_IDLE, MetaLine, RailGroup } from "../mike/rail"
import type { OpsBatch } from "../data"

interface OpsBatchListProps {
  selectedId: OpsBatch["id"]
  onSelect: (id: OpsBatch["id"]) => void
  onApproveAll: (batches: OpsBatch[]) => void
}

const fmt = (v: number) => (v >= 1 ? `$${+v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`)
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)

/** Left rail: Michelle's inbox, on the same rail as Mike's (see mike/rail.tsx), grouped the way Claire's page is. */
export function OpsBatchList({ selectedId, onSelect, onApproveAll }: OpsBatchListProps) {
  const { approved, policy } = useNudge()
  const OPS_BATCHES = opsBatches(policy)

  return (
    <div className="border-r border-slate-200 bg-white">
      {GROUPS.map((g, gi) => {
        // Bands run by ease (the group order); within a band, the most value first.
        const batches = OPS_BATCHES.filter((b) => b.tier === g.tier).sort((x, y) => money(y.value) - money(x.value))
        const pending = batches.filter((b) => !approved[b.id])
        // Approve all can't claim hero SKUs the policy says to review one by one.
        const bulk = pending.filter((b) => b.mode !== "each")
        return (
          <RailGroup
            key={g.tier}
            first={gi === 0}
            group={g}
            value={`+${fmt(batches.reduce((s, b) => s + money(b.value), 0))}`}
            action={g.tier === "approval" && (bulk.length || !pending.length) ? <ApproveAll pending={bulk.length} onClick={() => onApproveAll(bulk)} /> : undefined}
          >
            {batches.map((b) => {
              const done = !!approved[b.id]
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelect(b.id)}
                  className={cn(
                    "block w-full rounded-lg px-3.5 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-300",
                    selectedId === b.id ? ITEM_ACTIVE : ITEM_IDLE,
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-semibold text-slate-950">
                      {b.type}
                      {b.partLabel && ` · ${b.partLabel}`}
                    </span>
                    <span className={cn("font-mono text-[15px] font-semibold tabular-nums", done ? "text-success-700" : "text-slate-950")}>+{b.value}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] text-slate-500">{b.name}</div>
                  <MetaLine
                    parts={[
                      <span key="n">
                        {b.skus} {b.tier === "input" ? (b.inputNoun ?? "items") : "SKUs"} · {b.mode === "each" ? "review each" : b.team}
                      </span>,
                      done && <span className="font-medium text-success-700">{b.tier === "input" ? "Sent to Ally" : "Sent"}</span>,
                      !done && b.tier === "autopilot" && <span className="font-medium text-info-700">Running</span>,
                      !done && b.tier !== "autopilot" && b.chip && <span className="font-medium text-warning-700">{b.chip}</span>,
                    ]}
                  />
                </button>
              )
            })}
          </RailGroup>
        )
      })}
    </div>
  )
}
