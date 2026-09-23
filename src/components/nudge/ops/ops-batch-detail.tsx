"use client"

import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNudge } from "../nudge-context"
import type { OpsBatch } from "../data"

interface OpsBatchDetailProps {
  batch: OpsBatch
  onAction: (batch: OpsBatch) => void
}

/**
 * Right pane for an ops issue: what Ally caught on the store walk, the evidence
 * behind it, and the one action Michelle signs off — no bulk SKU workbench, since
 * ops fixes are a report to Amazon or the 3PL, not a content rewrite.
 */
export function OpsBatchDetail({ batch, onAction }: OpsBatchDetailProps) {
  const { approved } = useNudge()
  const done = !!approved[batch.id]

  return (
    <div className="flex min-w-0 flex-col px-10 py-8">
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <div className="text-2xl font-semibold tracking-tight text-slate-950">{batch.name}</div>
          <div className="mt-1.5 text-sm text-slate-600">{batch.team} · {batch.skus} SKUs affected</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[28px] font-bold tracking-tight text-slate-950 tabular-nums">{batch.value}</div>
          <div className="mt-0.5 text-sm text-slate-500">at risk</div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950">
          <Search className="size-4 text-brand-600" />
          What Ally caught
        </div>
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-900">{batch.detected}</p>
          <div className="mt-4 rounded-lg bg-slate-25 p-4">
            <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Lead example · <span className="font-mono normal-case">{batch.exampleSku}</span> {batch.exampleName}
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {batch.evidence.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-slate-400" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        {done ? (
          <div className="flex items-center gap-2 text-[15px] font-medium text-success-700">
            <Check className="size-4" />
            {batch.doneLabel}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAction(batch)}
            className={cn(
              "rounded-md bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-xs transition-colors hover:bg-brand-600",
            )}
          >
            {batch.action}
          </button>
        )}
      </div>
    </div>
  )
}
