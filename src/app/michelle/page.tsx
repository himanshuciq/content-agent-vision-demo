"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { MichelleHeader } from "@/components/nudge/ops/michelle-header"
import { OpsProgress } from "@/components/nudge/ops/ops-progress"
import { OpsBatchList } from "@/components/nudge/ops/ops-batch-list"
import { OpsBatchDetail } from "@/components/nudge/ops/ops-batch-detail"
import { OpsDelivered } from "@/components/nudge/ops/ops-delivered"
import { AskAlly } from "@/components/nudge/claire/ask-ally"
import { MICHELLE_QUESTIONS, michelleAnswer } from "@/components/nudge/ask-ally-personas"
import { ResetDemoButton } from "@/components/nudge/reset-demo-button"
import { opsBatches } from "@/components/nudge/data"
import { useNudge } from "@/components/nudge/nudge-context"
import type { OpsBatch } from "@/components/nudge/data"

/**
 * Michelle's ops queue, laid out like Mike's: where ops stands, what's one
 * approval from live, the inbox grouped by Claire's buckets, the selected batch,
 * then what ops delivered this quarter.
 */
export default function MichellePage() {
  const { approve, policy } = useNudge()
  const OPS_BATCHES = opsBatches(policy)
  // Open on the top of the inbox: the most valuable item one approval away.
  const [selectedId, setSelectedId] = useState<OpsBatch["id"]>(() => [...OPS_BATCHES].filter((b) => b.tier === "approval").sort((x, y) => y.approveValue - x.approveValue)[0].id)
  const [celebrate, setCelebrate] = useState<{ value: number; label: string } | null>(null)

  const selected = OPS_BATCHES.find((b) => b.id === selectedId) ?? OPS_BATCHES[0]

  function celebrateFor(batches: OpsBatch[]) {
    const one = batches.length === 1 ? batches[0] : null
    const label = one?.tier === "input" ? `${one.skus} ${one.inputNoun}` : `${batches.reduce((s, b) => s + b.skus, 0)} SKUs`
    setCelebrate({ value: batches.reduce((s, b) => s + b.approveValue, 0), label })
    window.setTimeout(() => setCelebrate(null), 2200)
  }

  function handleAction(batch: OpsBatch) {
    approve(batch.id)
    celebrateFor([batch])
  }

  function handleApproveAll(batches: OpsBatch[]) {
    batches.forEach((b) => approve(b.id))
    celebrateFor(batches)
  }

  return (
    <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <MichelleHeader />
        <OpsProgress celebrate={celebrate} />
        <div className="grid grid-cols-[340px_minmax(0,1fr)]">
          <OpsBatchList selectedId={selectedId} onSelect={setSelectedId} onApproveAll={handleApproveAll} />
          <OpsBatchDetail batch={selected} onAction={handleAction} />
        </div>
        <OpsDelivered />
        {/* Demo-only control, kept out of the product chrome. Room below for the floating Ask Ally bar. */}
        <div className="flex justify-end px-10 pb-24 opacity-50 hover:opacity-100">
          <ResetDemoButton />
        </div>
      </div>
      <AskAlly questions={MICHELLE_QUESTIONS} renderAnswer={michelleAnswer} placeholder="Ask Ally about your ops queue" />
    </PageShell>
  )
}
