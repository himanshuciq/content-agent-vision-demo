"use client"

import { opsBatches } from "../data"
import { useNudge } from "../nudge-context"
import { ApproveAll, GROUPS, RailGroup } from "../mike/rail"
import { OpsListItem } from "./ops-list-item"
import type { OpsBatch } from "../data"

interface OpsBatchListProps {
  selectedId: OpsBatch["id"]
  selectedSku: string | null
  expandedId: string | null
  checked: Record<string, Record<string, boolean>>
  onToggleExpand: (id: string) => void
  onSelect: (id: OpsBatch["id"]) => void
  onSelectSku: (batchId: string, asin: string) => void
  onApproveAll: (batches: OpsBatch[]) => void
}

const fmt = (v: number) => (v >= 1 ? `$${+v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`)
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)

/** Left rail: Michelle's inbox, on the same rail as Mike's (see mike/rail.tsx), grouped the way Claire's page is. */
export function OpsBatchList({ selectedId, selectedSku, expandedId, checked, onToggleExpand, onSelect, onSelectSku, onApproveAll }: OpsBatchListProps) {
  const { approved, policy } = useNudge()
  const OPS_BATCHES = opsBatches(policy)

  return (
    <div className="bg-white">
      {GROUPS.map((g, gi) => {
        // Bands run by ease (the group order); within a band, the most value first.
        const batches = OPS_BATCHES.filter((b) => b.tier === g.tier).sort((x, y) => money(y.value) - money(x.value))
        const pending = batches.filter((b) => !approved[b.id])
        // Approve all can't claim hero SKUs the policy says to review one by one.
        const bulk = pending.filter((b) => b.mode !== "each")
        return (
          <RailGroup
            key={g.tier}
            first={gi === 0}
            group={g}
            value={`+${fmt(batches.reduce((s, b) => s + money(b.value), 0))}`}
            action={g.tier === "approval" && (bulk.length || !pending.length) ? <ApproveAll pending={bulk.length} onClick={() => onApproveAll(bulk)} /> : undefined}
          >
            {batches.map((b) => (
              <OpsListItem
                key={b.id}
                batch={b}
                active={selectedId === b.id && !selectedSku}
                selectedSku={selectedId === b.id ? selectedSku : null}
                expanded={expandedId === b.id}
                checked={checked[b.id] ?? {}}
                onToggleExpand={() => onToggleExpand(b.id)}
                onSelectBatch={() => onSelect(b.id)}
                onSelectSku={(asin) => onSelectSku(b.id, asin)}
              />
            ))}
          </RailGroup>
        )
      })}
    </div>
  )
}
