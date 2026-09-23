"use client"

import { ArrowLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { skuById } from "../data"
import { useNudge } from "../nudge-context"
import type { Batch, SkuRow } from "../types"

interface SkuDetailPaneProps {
  batch: Batch
  row: SkuRow
  onBack: () => void
  onApprove: (batch: Batch) => void
  onReviewAll: (batch: Batch) => void
}

/**
 * The deep per-SKU view. Field-level demarcation — the live value struck
 * through, the agent's version beside it with the new parts highlighted, the
 * seasonal image rendered as its Halloween variant. Reviewing one builds
 * trust, then it points straight at the bulk approve.
 */
export function SkuDetailPane({ batch, row, onBack, onApprove, onReviewAll }: SkuDetailPaneProps) {
  const { approved } = useNudge()
  const sku = skuById(row.skuId)
  const done = !!approved[batch.id]

  return (
    <div className="flex min-w-0 flex-col px-10 py-8">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="size-3.5" />
        Back to {batch.name}
      </button>

      <div className="mt-5 flex items-center gap-4">
        <img
          src={sku.thumbnailUrl}
          alt={sku.title}
          className="size-12 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-slate-200"
        />
        <div className="min-w-0">
          <div className="font-mono text-xs text-slate-500">{sku.asin} · {sku.brand}</div>
          <div className="mt-0.5 text-lg font-semibold tracking-tight text-slate-950">{sku.title}</div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {row.sections.map((section, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-5 py-2.5">
              <span className="flex size-4 items-center justify-center rounded bg-brand-500">
                <Check className="size-3 text-white" />
              </span>
              <span className="text-sm font-semibold text-slate-950">{section.label}</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-100">
              <div className="px-5 py-4">
                <div className="mb-2.5 font-mono text-[11px] tracking-wide text-slate-400 uppercase">Live on Amazon</div>
                {section.kind === "text" ? (
                  section.live.map((line, j) => (
                    <p key={j} className="mt-1.5 text-sm leading-relaxed text-slate-400 line-through first:mt-0">{line}</p>
                  ))
                ) : (
                  <div className="relative h-32 overflow-hidden rounded-md bg-slate-100">
                    <img src={sku.thumbnailUrl} alt={section.liveLabel} className="size-full object-cover grayscale-[0.15]" />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 shadow-xs">
                      {section.liveLabel}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-brand-25/40 px-5 py-4">
                <div className="mb-2.5 font-mono text-[11px] tracking-wide text-brand-600 uppercase">Agent wrote</div>
                {section.kind === "text" ? (
                  section.draft.map((seg, j) => (
                    <p
                      key={j}
                      className={cn(
                        "mt-1.5 text-sm leading-relaxed first:mt-0",
                        seg.changed
                          ? "rounded-md bg-success-50 px-2 py-1 font-medium text-success-800"
                          : "text-slate-700",
                      )}
                    >
                      {seg.text}
                    </p>
                  ))
                ) : (
                  <div className="relative h-32 overflow-hidden rounded-md ring-1 ring-inset ring-brand-200">
                    <img src={sku.thumbnailUrl} alt={section.draftLabel} className="size-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                      {section.draftLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!done && (
        <div className="mt-8 flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-25 px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-950">Looks right? The other {batch.approveSkus - 1} SKUs got the same treatment.</div>
            <div className="mt-0.5 text-sm text-slate-600">Approve the whole batch in one go.</div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onReviewAll(batch)}
              className="rounded-md border border-slate-200 bg-white px-5 py-3 text-[15px] font-medium text-slate-800 shadow-xs transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              Review all SKUs
            </button>
            <button
              type="button"
              onClick={() => onApprove(batch)}
              className="rounded-md bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-xs transition-colors hover:bg-brand-600"
            >
              Approve {batch.approveSkus} SKUs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
