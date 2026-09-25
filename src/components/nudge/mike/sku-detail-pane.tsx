"use client"

import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { skuById } from "../data"
import { useNudge } from "../nudge-context"
import { PRIMARY } from "./buttons"
import { SkuSections } from "./sku-diff"
import type { Batch, SkuRow } from "../types"

interface SkuDetailPaneProps {
  batch: Batch
  row: SkuRow
  onBack: () => void
  onApprove: (batch: Batch) => void
  onReviewAll: (batch: Batch) => void
}

/**
 * The per-SKU view from "See all N SKUs": each field as one inline edit
 * (removed struck, kept black, added green), then the bulk approve.
 */
export function SkuDetailPane({ batch, row, onBack, onApprove }: SkuDetailPaneProps) {
  const { approved } = useNudge()
  const sku = skuById(row.skuId)
  const done = !!approved[batch.id]

  return (
    <div className="flex min-w-0 flex-col px-10 py-8">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
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

      <div className="mt-6">
        <SkuSections sections={row.sections} thumbnailUrl={sku.thumbnailUrl} />
      </div>

      {!done && batch.tier === "input" && (
        <div className="mt-8 flex items-center gap-4 rounded-xl border border-warning-200 bg-warning-50 px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-950">Filled in? Ally drafts the rest and sends them back for one approval.</div>
            <div className="mt-0.5 text-sm text-slate-500">
              {batch.inputSkus} SKUs need input. Pick the next one on the left, or send what you have.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onApprove(batch)
              toast.success(batch.need!.toast, { position: "top-right" })
            }}
            className={PRIMARY}
          >
            Send to Ally
          </button>
        </div>
      )}

      {!done && batch.tier === "approval" && (
        <div className="mt-8 flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-25 px-6 py-5">
          <div className="min-w-0 flex-1">
            {batch.mode === "each" ? (
              <>
                <div className="text-sm font-semibold text-slate-950">Checked each one? Approve all {batch.approveSkus} together.</div>
                <div className="mt-0.5 text-sm text-slate-500">Your review policy sends {batch.partLabel ? `${batch.partLabel.toLowerCase()} SKUs` : "these SKUs"} one by one. Pick the next one on the left.</div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-slate-950">Looks right? The other {batch.approveSkus - 1} SKUs got the same treatment.</div>
                <div className="mt-0.5 text-sm text-slate-500">Approve the whole batch in one go, or pick another SKU on the left.</div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => onApprove(batch)}
            className={PRIMARY}
          >
            Approve {batch.approveSkus} SKUs
          </button>
        </div>
      )}
    </div>
  )
}
