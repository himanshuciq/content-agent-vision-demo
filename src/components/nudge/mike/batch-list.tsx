"use client"

import { Check } from "lucide-react"
import { AUTOPILOT_TIER, BATCHES } from "../data"
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

const fmt = (v: number) => (v >= 1 ? `$${v.toFixed(2)}M` : `$${Math.round(v * 1000)}K`)
/** "$500K" → 0.5, "$1.2M" → 1.2 ($M). */
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)
const AUTOPILOT_CONTENT = AUTOPILOT_TIER.rows.find((r) => r.agent === "content")!

function GroupHeader({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5.5 pt-4 pb-2.5">
      <span className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">
        {label} · {value}
      </span>
      {children}
    </div>
  )
}

/**
 * Left rail: Mike's inbox, grouped the way Claire's page is (One approval away,
 * Needs your input, On autopilot). Approve all ships every batch in the first
 * group in one go.
 */
export function BatchList({ selectedId, selectedSkuId, expandedBatchId, onToggleExpand, onSelectBatch, onSelectSku, onApproveAll }: BatchListProps) {
  const { approved } = useNudge()
  const groups = [
    { tier: "approval" as const, label: "One approval away" },
    { tier: "input" as const, label: "Needs your input" },
  ]

  return (
    <div className="border-r border-slate-200 bg-slate-25">
      {groups.map((g) => {
        const batches = BATCHES.filter((b) => b.tier === g.tier)
        const pending = batches.filter((b) => !approved[b.id])
        const valueLabel = fmt(batches.reduce((s, b) => s + money(b.value), 0))
        return (
          <div key={g.tier}>
            <GroupHeader label={g.label} value={valueLabel}>
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
                    className="rounded-md border border-brand-300 bg-white px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    Approve all
                  </button>
                ))}
            </GroupHeader>
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
        )
      })}
      <GroupHeader label="On autopilot" value={fmt(money(AUTOPILOT_CONTENT.value))} />
      <div className="px-5.5 py-4">
        <div className="text-[15px] font-semibold text-slate-950">PIM → PDP fixes</div>
        <div className="mt-1 text-xs text-slate-500">Running · nothing to do</div>
      </div>
    </div>
  )
}
