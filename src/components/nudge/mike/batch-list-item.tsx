"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { skuById } from "../data"
import { useNudge } from "../nudge-context"
import type { Batch } from "../types"

interface BatchListItemProps {
  batch: Batch
  active: boolean
  selectedSkuId: string | null
  expanded: boolean
  onToggleExpand: () => void
  onSelectBatch: () => void
  onSelectSku: (skuId: string) => void
}

/** One batch row: select it, or expand "See all N SKUs" to drill into a real SKU. */
export function BatchListItem({ batch, active, selectedSkuId, expanded, onToggleExpand, onSelectBatch, onSelectSku }: BatchListItemProps) {
  const { approved } = useNudge()
  const done = !!approved[batch.id]

  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={onSelectBatch}
        className={cn(
          "block w-full px-5.5 py-4 text-left",
          active && "bg-brand-50 shadow-[inset_2px_0_0_var(--color-brand-600)]",
          done && "bg-slate-25",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px] font-semibold text-slate-950">{batch.name}</span>
          <span className={cn("font-mono text-[15px] font-bold tabular-nums", done ? "text-slate-500" : "text-slate-950")}>
            {done ? `$${batch.approveValue.toFixed(2)}M` : batch.value}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {done ? batch.approveSkus : batch.skus} SKUs
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-semibold",
              done
                ? "bg-success-100 text-success-700"
                : batch.id === "halloween"
                  ? "bg-warning-100 text-warning-700"
                  : "bg-slate-100 text-slate-600",
            )}
          >
            {done ? "Published" : batch.chip}
          </span>
        </div>
        <div
          onClick={(e) => { e.stopPropagation(); onToggleExpand() }}
          className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-brand-700"
        >
          {expanded ? "Hide the SKUs" : `See all ${batch.approveSkus} SKUs`}
          <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-slate-100 bg-white">
          {batch.skuRows.map((row) => {
            const sku = skuById(row.skuId)
            const skuActive = selectedSkuId === row.skuId
            return (
              <button
                key={row.skuId}
                type="button"
                onClick={() => onSelectSku(row.skuId)}
                className={cn(
                  "flex w-full items-center gap-2.5 border-b border-slate-50 px-5.5 py-2.5 pl-7.5 text-left transition-colors",
                  skuActive ? "bg-brand-50" : "hover:bg-slate-50",
                )}
              >
                <img
                  src={sku.thumbnailUrl}
                  alt={sku.title}
                  className="size-8 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-slate-500">{sku.asin}</div>
                  <div className="mt-0.5 text-[13px] leading-tight text-slate-950">{sku.title}</div>
                </div>
              </button>
            )
          })}
          <div className="px-5.5 py-2.5 pl-7.5 text-xs text-slate-500">
            Showing {batch.skuRows.length} of {batch.approveSkus}
          </div>
        </div>
      )}
    </div>
  )
}
