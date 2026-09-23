"use client"

import { cn } from "@/lib/utils"
import { OPS_BATCHES } from "../data"
import { useNudge } from "../nudge-context"
import type { OpsBatch } from "../data"

interface OpsBatchListProps {
  selectedId: OpsBatch["id"]
  onSelect: (id: OpsBatch["id"]) => void
}

/** Left rail: the five ops issues Ally caught on the store walk, ranked by value. */
export function OpsBatchList({ selectedId, onSelect }: OpsBatchListProps) {
  const { approved } = useNudge()

  return (
    <div className="border-r border-slate-200 bg-slate-25">
      <div className="border-b border-slate-200 px-5.5 py-4 font-mono text-xs tracking-wide text-slate-500 uppercase">
        Inbox
      </div>
      {OPS_BATCHES.map((b) => {
        const done = !!approved[b.id]
        const active = selectedId === b.id
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b.id)}
            className={cn(
              "block w-full border-b border-slate-100 px-5.5 py-4 text-left",
              active && "bg-brand-50 shadow-[inset_2px_0_0_var(--color-brand-600)]",
              done && !active && "bg-slate-25",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-semibold text-slate-950">{b.name}</span>
              <span className={cn("font-mono text-[15px] font-bold tabular-nums", done ? "text-slate-500" : "text-slate-950")}>
                {b.value}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-slate-500">{b.skus} SKUs · {b.team}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[11px] font-semibold",
                  done ? "bg-success-100 text-success-700" : "bg-warning-100 text-warning-700",
                )}
              >
                {done ? "Actioned" : b.chip}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
