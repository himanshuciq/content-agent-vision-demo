"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { OPS_BATCHES } from "../data"
import { useNudge } from "../nudge-context"
import { GROUPS } from "../mike/batch-list"
import { ACTIVE } from "../mike/batch-list-item"
import type { OpsBatch } from "../data"

interface OpsBatchListProps {
  selectedId: OpsBatch["id"]
  onSelect: (id: OpsBatch["id"]) => void
  onApproveAll: (batches: OpsBatch[]) => void
}

const fmt = (v: number) => (v >= 1 ? `$${+v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`)
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)
/** Urgent or dated tags are amber; "Running" is autopilot blue. */
const chipTone = (b: OpsBatch) => (b.tier === "autopilot" ? "bg-info-100 text-info-700" : "bg-warning-100 text-warning-700")

/** Left rail: Michelle's inbox, grouped and colored exactly like Mike's, which is how Claire's page groups it. */
export function OpsBatchList({ selectedId, onSelect, onApproveAll }: OpsBatchListProps) {
  const { approved } = useNudge()

  return (
    <div className="border-r border-slate-200 bg-slate-25">
      {GROUPS.map((g) => {
        const batches = OPS_BATCHES.filter((b) => b.tier === g.tier)
        const pending = batches.filter((b) => !approved[b.id])
        return (
          <div key={g.tier} className="relative">
            <span className={cn("absolute inset-y-0 left-0 w-1", g.bar)} aria-hidden />
            <div className={cn("flex items-center justify-between gap-3 py-3 pr-5.5 pl-6.5", g.header)}>
              <span className="text-[13px] font-semibold">
                {g.label} <span className="font-mono font-medium opacity-80">· +{fmt(batches.reduce((s, b) => s + money(b.value), 0))}</span>
              </span>
              {g.tier === "approval" &&
                (pending.length === 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700">
                    <Check className="size-3.5" />
                    All sent
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onApproveAll(pending)}
                    className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-600"
                  >
                    Approve all
                  </button>
                ))}
            </div>
            <div className="pl-1">
              {batches.map((b) => {
                const done = !!approved[b.id]
                const active = selectedId === b.id
                const tag = done ? (b.tier === "input" ? "Sent to Ally" : "Sent") : b.chip
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelect(b.id)}
                    className={cn(
                      "block w-full border-b border-slate-100 px-5.5 py-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-inset",
                      active ? ACTIVE[b.tier] : "hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-slate-950">{b.type}</span>
                        <span className="block text-xs text-slate-500">{b.name}</span>
                      </span>
                      <span className={cn("font-mono text-[15px] font-bold tabular-nums", done ? "text-success-700" : "text-slate-950")}>+{b.value}</span>
                    </div>
                    {tag && (
                      <div className="mt-2">
                        <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", done ? "bg-success-100 text-success-700" : chipTone(b))}>{tag}</span>
                      </div>
                    )}
                    <div className="mt-2 text-[13px] text-slate-500">
                      {b.skus} {b.tier === "input" ? b.inputNoun ?? "items" : "SKUs"} · {b.team}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
