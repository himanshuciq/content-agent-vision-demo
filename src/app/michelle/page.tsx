"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { MichelleHeader } from "@/components/nudge/ops/michelle-header"
import { OpsProgress } from "@/components/nudge/ops/ops-progress"
import { OpsBatchList } from "@/components/nudge/ops/ops-batch-list"
import { OpsBatchDetail } from "@/components/nudge/ops/ops-batch-detail"
import { OPS_BATCHES } from "@/components/nudge/data"
import { useNudge } from "@/components/nudge/nudge-context"
import type { OpsBatch } from "@/components/nudge/data"

/**
 * Michelle's ops queue — the landing spot for "Open in Ally →" on an ops nudge.
 * Same shape as Mike's content queue: issues ranked by value on the left, the
 * selected issue's evidence and one sign-off action on the right.
 */
export default function MichellePage() {
  const { approve } = useNudge()
  const [selectedId, setSelectedId] = useState<OpsBatch["id"]>("buybox")
  const [celebrate, setCelebrate] = useState<{ value: number; label: string } | null>(null)

  const selected = OPS_BATCHES.find((b) => b.id === selectedId) ?? OPS_BATCHES[0]

  function handleAction(batch: OpsBatch) {
    approve(batch.id)
    setCelebrate({ value: batch.approveValue, label: `${batch.skus} SKUs` })
    window.setTimeout(() => setCelebrate(null), 2200)
  }

  return (
    <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <MichelleHeader />
        <OpsProgress celebrate={celebrate} />
        <div className="grid grid-cols-[340px_minmax(0,1fr)]">
          <OpsBatchList selectedId={selectedId} onSelect={setSelectedId} />
          <OpsBatchDetail batch={selected} onAction={handleAction} />
        </div>
      </div>
    </PageShell>
  )
}
