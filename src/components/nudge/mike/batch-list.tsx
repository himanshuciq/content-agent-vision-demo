"use client"

import { BATCHES } from "../data"
import { useNudge } from "../nudge-context"
import { BatchListItem } from "./batch-list-item"
import { ApproveAll, GROUPS, RailGroup, sharedDeadline } from "./rail"
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

/**
 * Left rail: Mike's inbox, grouped the way Claire's page is (see rail.tsx for the
 * look). The shared deadline sits once in the group header; Approve all ships
 * every pending batch one approval away.
 */
export function BatchList({ selectedId, selectedSkuId, expandedBatchId, onToggleExpand, onSelectBatch, onSelectSku, onApproveAll }: BatchListProps) {
  const { approved } = useNudge()

  return (
    <div className="border-r border-slate-200 bg-white">
      {GROUPS.map((g, gi) => {
        const batches = BATCHES.filter((b) => b.tier === g.tier)
        const pending = batches.filter((b) => !approved[b.id])
        const groupDeadline = sharedDeadline(pending.map((b) => b.deadline))
        return (
          <RailGroup
            key={g.tier}
            first={gi === 0}
            dot={g.dot}
            label={g.label}
            value={`+${fmt(batches.reduce((s, b) => s + money(b.value), 0))}`}
            meta={groupDeadline}
            action={g.tier === "approval" ? <ApproveAll pending={pending.length} onClick={() => onApproveAll(pending)} /> : undefined}
          >
            {batches.map((b) => (
              <BatchListItem
                key={b.id}
                batch={b}
                showDeadline={!groupDeadline}
                active={selectedId === b.id && !selectedSkuId}
                selectedSkuId={selectedId === b.id ? selectedSkuId : null}
                expanded={expandedBatchId === b.id}
                onToggleExpand={() => onToggleExpand(b.id)}
                onSelectBatch={() => onSelectBatch(b.id)}
                onSelectSku={(skuId) => onSelectSku(b.id, skuId)}
              />
            ))}
          </RailGroup>
        )
      })}
    </div>
  )
}
