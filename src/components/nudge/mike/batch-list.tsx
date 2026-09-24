"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { BATCHES } from "../data"
import { useNudge } from "../nudge-context"
import { BatchListItem } from "./batch-list-item"
import type { Batch } from "../types"

interface BatchListProps {
  selectedId: Batch["id"]
  selectedSkuId: string | null
  expandedBatchId: Batch["id"] | null
  onToggleExpand: (id: Batch["id"]) => void
  onSelectBatch: (id: Batch["id"]) => void
  onSelectSku: (batchId: Batch["id"], skuId: string) => void
  onApproveAll: (batches: Batch[]) => void
}

const fmt = (v: number) => (v >= 1 ? `$${+v.toFixed(2)}M` : `$${Math.round(v * 1000)}K`)
/** "$500K" → 0.5, "$1.2M" → 1.2 ($M). */
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)

/** Same colors as Claire's waterfall: purple is one approval, amber needs the team, blue runs itself. */
const GROUPS: { tier: Batch["tier"]; label: string; header: string; bar: string }[] = [
  { tier: "approval", label: "One approval away", header: "bg-brand-100 text-brand-800", bar: "bg-brand-500" },
  { tier: "input", label: "Needs your input", header: "bg-warning-100 text-warning-800", bar: "bg-warning-500" },
  { tier: "autopilot", label: "On autopilot", header: "bg-info-100 text-info-700", bar: "bg-info-500" },
]

/**
 * Left rail: Mike's inbox, grouped the way Claire's page is. Each group has a
 * tinted header and a colored edge so the three buckets read at a glance.
 * Approve all ships every batch in the first group in one go.
 */
export function BatchList({ selectedId, selectedSkuId, expandedBatchId, onToggleExpand, onSelectBatch, onSelectSku, onApproveAll }: BatchListProps) {
  const { approved } = useNudge()

  return (
    <div className="border-r border-slate-200 bg-slate-25">
      {GROUPS.map((g) => {
        const batches = BATCHES.filter((b) => b.tier === g.tier)
        const pending = batches.filter((b) => !approved[b.id])
        return (
          <div key={g.tier} className="relative">
            <span className={cn("absolute inset-y-0 left-0 w-1", g.bar)} aria-hidden />
            <div className={cn("flex items-center justify-between gap-3 py-3 pr-5.5 pl-6.5", g.header)}>
              <span className="text-[13px] font-semibold">
                {g.label} <span className="font-mono font-medium opacity-80">· {fmt(batches.reduce((s, b) => s + money(b.value), 0))}</span>
              </span>
              {g.tier === "approval" &&
                (pending.length === 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700">
                    <Check className="size-3.5" />
                    All approved
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
              {batches.map((b) => (
                <BatchListItem
                  key={b.id}
                  batch={b}
                  active={selectedId === b.id && !selectedSkuId}
                  selectedSkuId={selectedId === b.id ? selectedSkuId : null}
                  expanded={expandedBatchId === b.id}
                  onToggleExpand={() => onToggleExpand(b.id)}
                  onSelectBatch={() => onSelectBatch(b.id)}
                  onSelectSku={(skuId) => onSelectSku(b.id, skuId)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
