"use client"

import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNudge } from "../nudge-context"
import type { Batch } from "../types"

interface BatchDetailProps {
  batch: Batch
  onApprove: (batch: Batch) => void
  onReviewSample: (batch: Batch) => void
}

/**
 * Default right pane for a batch: what the agent changed, stated plainly, with
 * approve as the lead action. The full before/after lives one click away under
 * "Review a sample SKU" so this view stays a clean summary, not a workbench.
 */
export function BatchDetail({ batch, onApprove, onReviewSample }: BatchDetailProps) {
  const { approved } = useNudge()
  const done = !!approved[batch.id]

  return (
    <div className="flex min-w-0 flex-col px-10 py-8">
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <div className="text-2xl font-semibold tracking-tight text-slate-950">{batch.name}</div>
          <div className="mt-1.5 text-sm text-slate-600">{batch.nudgeSource}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[28px] font-bold tracking-tight text-slate-950 tabular-nums">
            {done ? `$${batch.approveValue.toFixed(2)}M` : batch.value}
          </div>
          <div className="mt-0.5 text-sm text-slate-500">{done ? batch.approveSkus : batch.skus} SKUs</div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950">
          <Sparkles className="size-4 text-brand-600" />
          What the agent changed
        </div>
        <div>
          {batch.changes.map((change, i) => (
            <div
              key={i}
              className={cn("flex items-start gap-3 px-5 py-3.5", i > 0 && "border-t border-slate-100")}
            >
              <Check className="mt-0.5 size-4 shrink-0 text-success-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900">{change.text}</div>
                {change.detail && <div className="mt-0.5 text-sm text-slate-500">{change.detail}</div>}
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-sm font-semibold text-slate-950 tabular-nums">
                  {change.skus.toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-slate-500">of {batch.skus.toLocaleString()} SKUs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        {done ? (
          <div className="flex items-center gap-2 text-[15px] font-medium text-success-700">
            <Check className="size-4" />
            {batch.doneLabel}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onApprove(batch)}
              className="rounded-md bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-xs transition-colors hover:bg-brand-600"
            >
              Approve {batch.approveSkus} SKUs
            </button>
            <button
              type="button"
              onClick={() => onReviewSample(batch)}
              className="text-[15px] font-medium text-brand-700 hover:text-brand-800"
            >
              Review a sample SKU →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
