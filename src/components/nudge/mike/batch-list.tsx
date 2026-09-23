"use client"

import { BATCHES } from "../data"
import { BatchListItem } from "./batch-list-item"
import type { Batch } from "../types"

interface BatchListProps {
  selectedId: Batch["id"]
  selectedSkuId: string | null
  expandedBatchId: Batch["id"] | null
  onToggleExpand: (id: Batch["id"]) => void
  onSelectBatch: (id: Batch["id"]) => void
  onSelectSku: (batchId: Batch["id"], skuId: string) => void
}

/** Left rail: the four batches, each expandable to its real "See all N SKUs" list. */
export function BatchList({ selectedId, selectedSkuId, expandedBatchId, onToggleExpand, onSelectBatch, onSelectSku }: BatchListProps) {
  return (
    <div className="border-r border-slate-200 bg-slate-25">
      <div className="border-b border-slate-200 px-5.5 py-4 font-mono text-xs tracking-wide text-slate-500 uppercase">
        Inbox
      </div>
      {BATCHES.map((b) => (
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
}
