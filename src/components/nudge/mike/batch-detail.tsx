"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { skuById } from "../data"
import { useNudge } from "../nudge-context"
import { SkuSections } from "./sku-diff"
import type { Batch } from "../types"

interface BatchDetailProps {
  batch: Batch
  onApprove: (batch: Batch) => void
  onReviewAll: (batch: Batch) => void
}

/** Bulk approve leads; reviewing every SKU is a small chip, because the batch is meant to be approved in one go. */
function Actions({ batch, onApprove, onReviewAll, children }: BatchDetailProps & { children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => onApprove(batch)}
        className="rounded-md bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-xs transition-colors hover:bg-brand-600"
      >
        Approve {batch.approveSkus} SKUs
      </button>
      {children}
      <button
        type="button"
        onClick={() => onReviewAll(batch)}
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
      >
        Review all SKUs
      </button>
    </div>
  )
}

/**
 * Default right pane for a batch: what the agent changed, then approve. "Review
 * a sample SKU" opens one real SKU's edit right here and scrolls to it, so Mike
 * never leaves the batch he's about to approve.
 */
export function BatchDetail({ batch, onApprove, onReviewAll }: BatchDetailProps) {
  const { approved } = useNudge()
  const done = !!approved[batch.id]
  const [showSample, setShowSample] = useState(false)
  const sampleRef = useRef<HTMLDivElement>(null)
  const row = batch.skuRows[0]
  const sku = row ? skuById(row.skuId) : null

  useEffect(() => setShowSample(false), [batch.id])
  useEffect(() => {
    if (showSample) sampleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [showSample])

  return (
    <div className="flex min-w-0 flex-col px-10 py-8">
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <div className="text-2xl font-semibold tracking-tight text-slate-950">{batch.name}</div>
          <div className="mt-1.5 text-sm text-slate-600">{batch.nudgeSource}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[28px] font-bold tracking-tight text-slate-950 tabular-nums">
            {done ? (batch.approveValue >= 1 ? `$${batch.approveValue.toFixed(2)}M` : `$${Math.round(batch.approveValue * 1000)}K`) : batch.value}
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
            <div key={i} className={cn("flex items-start gap-3 px-5 py-3.5", i > 0 && "border-t border-slate-100")}>
              <Check className="mt-0.5 size-4 shrink-0 text-success-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900">{change.text}</div>
                {change.detail && <div className="mt-0.5 text-sm text-slate-500">{change.detail}</div>}
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-sm font-semibold text-slate-950 tabular-nums">{change.skus.toLocaleString()}</span>
                <span className="ml-1 text-xs text-slate-500">of {batch.skus.toLocaleString()} SKUs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {done ? (
          <div className="flex items-center gap-2 text-[15px] font-medium text-success-700">
            <Check className="size-4" />
            {batch.doneLabel}
          </div>
        ) : (
          <Actions batch={batch} onApprove={onApprove} onReviewAll={onReviewAll}>
            {sku && (
              <button
                type="button"
                onClick={() => setShowSample((v) => !v)}
                className="inline-flex items-center gap-1 text-[15px] font-medium text-brand-700 hover:text-brand-800"
              >
                {showSample ? "Hide the sample SKU" : "Review a sample SKU"}
                <ChevronDown className={cn("size-4 transition-transform", showSample && "rotate-180")} />
              </button>
            )}
          </Actions>
        )}
      </div>

      {showSample && sku && row && (
        <div ref={sampleRef} className="mt-8 scroll-mt-6 border-t border-slate-100 pt-8">
          <div className="mb-4 flex items-center gap-4">
            <img src={sku.thumbnailUrl} alt={sku.title} className="size-12 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-slate-200" />
            <div className="min-w-0">
              <div className="font-mono text-xs text-slate-500">
                Sample · {sku.asin} · {sku.brand}
              </div>
              <div className="mt-0.5 text-lg font-semibold tracking-tight text-slate-950">{sku.title}</div>
            </div>
          </div>
          <SkuSections sections={row.sections} thumbnailUrl={sku.thumbnailUrl} />
          {!done && (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-25 px-6 py-5">
              <div className="text-sm font-semibold text-slate-950">Looks right? The other {batch.approveSkus - 1} SKUs got the same treatment.</div>
              <Actions batch={batch} onApprove={onApprove} onReviewAll={onReviewAll} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
