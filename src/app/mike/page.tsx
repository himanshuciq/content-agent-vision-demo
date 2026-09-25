"use client"

import { useRef, useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ResetDemoButton } from "@/components/nudge/reset-demo-button"
import { AskAlly } from "@/components/nudge/claire/ask-ally"
import { MIKE_QUESTIONS, mikeAnswer } from "@/components/nudge/ask-ally-personas"
import { MikeHeader } from "@/components/nudge/mike/mike-header"
import { MikeDelivered } from "@/components/nudge/mike/mike-delivered"
import { MikeProgress } from "@/components/nudge/mike/mike-progress"
import { BatchList } from "@/components/nudge/mike/batch-list"
import { BatchDetail } from "@/components/nudge/mike/batch-detail"
import { SkuDetailPane } from "@/components/nudge/mike/sku-detail-pane"
import { BackgroundProvider } from "@/components/nudge/mike/background-composer"
import { contentBatches } from "@/components/nudge/data"
import { useNudge } from "@/components/nudge/nudge-context"
import type { Batch } from "@/components/nudge/types"

/**
 * Mike's queue — landed on directly from the "Open in Ally →" button in the
 * real Slack DM Claire's nudge sends. Batches ranked by value on the left,
 * either the selected batch's summary or one real SKU's full field-by-field
 * comparison on the right.
 */
export default function MikePage() {
  const { approve, policy } = useNudge()
  const batches = contentBatches(policy)
  const [selectedId, setSelectedId] = useState<Batch["id"]>("halloween")
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null)
  const [expandedBatchId, setExpandedBatchId] = useState<Batch["id"] | null>(null)
  const [celebrate, setCelebrate] = useState<{ value: number; skus: number } | null>(null)
  const queueRef = useRef<HTMLDivElement>(null)

  // A policy change can remove the selected part (e.g. its SKUs moved to autopilot): fall back to the first item.
  const selected = batches.find((b) => b.id === selectedId) ?? batches[0]
  const selectedRow = selectedSkuId ? selected.skuRows.find((r) => r.skuId === selectedSkuId) : undefined

  function handleApprove(batch: Batch) {
    approve(batch.id)
    setCelebrate({ value: batch.approveValue, skus: batch.approveSkus })
    window.setTimeout(() => setCelebrate(null), 2200)
  }

  /** "Approve all" on a group: ship every pending bulk item in it at once (one-by-one items stay for their review). */
  function handleApproveAll(batches: Batch[]) {
    batches.forEach((b) => approve(b.id))
    setCelebrate({ value: batches.reduce((s, b) => s + b.approveValue, 0), skus: batches.reduce((s, b) => s + b.approveSkus, 0) })
    window.setTimeout(() => setCelebrate(null), 2200)
  }

  function handleSelectBatch(id: Batch["id"]) {
    setSelectedId(id)
    setSelectedSkuId(null)
  }

  function handleSelectSku(batchId: Batch["id"], skuId: string) {
    setSelectedId(batchId)
    setSelectedSkuId(skuId)
  }

  /** Every "Review N SKUs" opens the first SKU side by side, its list open on the left, scrolled up to the top of the queue. */
  function handleReviewAll(batch: Batch) {
    setSelectedId(batch.id)
    setSelectedSkuId(batch.skuRows[0]?.skuId ?? null)
    setExpandedBatchId(batch.id)
    // After the SKU view renders (the sample above it collapses), so the target doesn't move mid-scroll.
    window.setTimeout(() => {
      const top = queueRef.current ? queueRef.current.getBoundingClientRect().top + window.scrollY - 16 : 0
      window.scrollTo({ top, behavior: "smooth" })
      // Some embedded browsers ignore smooth scrolling: land there anyway.
      window.setTimeout(() => {
        if (Math.abs(window.scrollY - top) > 4) window.scrollTo({ top })
      }, 600)
    }, 50)
  }

  // Backgrounds applied per SKU are shared by the composer, the footer and the rail.
  return (
    <BackgroundProvider>
      <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <MikeHeader />
        <MikeProgress celebrate={celebrate} />
        <div ref={queueRef} className="grid scroll-mt-4 grid-cols-[340px_minmax(0,1fr)]">
          <BatchList
            selectedId={selectedId}
            selectedSkuId={selectedSkuId}
            expandedBatchId={expandedBatchId}
            onToggleExpand={(id) => setExpandedBatchId((prev) => (prev === id ? null : id))}
            onSelectBatch={handleSelectBatch}
            onSelectSku={handleSelectSku}
            onApproveAll={handleApproveAll}
          />
          {selectedRow ? (
            <SkuDetailPane
              batch={selected}
              row={selectedRow}
              onBack={() => setSelectedSkuId(null)}
              onApprove={handleApprove}
              onReviewAll={handleReviewAll}
              onSelectSku={(skuId) => handleSelectSku(selected.id, skuId)}
            />
          ) : (
            <BatchDetail batch={selected} onApprove={handleApprove} onReviewAll={handleReviewAll} onSelect={handleSelectBatch} />
          )}
        </div>
        <MikeDelivered />
        {/* Demo-only control, kept out of the product chrome, same as Claire's page. */}
        <div className="flex justify-end px-10 pb-24 opacity-50 hover:opacity-100">
          <ResetDemoButton />
        </div>
      </div>
      <AskAlly questions={MIKE_QUESTIONS} renderAnswer={mikeAnswer} placeholder="Ask Ally about your content queue" />
      </PageShell>
    </BackgroundProvider>
  )
}
