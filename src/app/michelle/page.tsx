"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AskBar, ChatProvider, ChatThread, useChat, useChatSource } from "@/components/nudge/chat/inline-chat"
import { GapDiagnostic, GapTree } from "@/components/nudge/ops/gap-view"
import { PageShell } from "@/components/layout/page-shell"
import { MichelleHeader } from "@/components/nudge/ops/michelle-header"
import { OpsProgress } from "@/components/nudge/ops/ops-progress"
import { OpsBatchList } from "@/components/nudge/ops/ops-batch-list"
import { OpsBatchDetail } from "@/components/nudge/ops/ops-batch-detail"
import { OpsDelivered } from "@/components/nudge/ops/ops-delivered"
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
/** The inbox's questions for the Ask Ally bar (gap-to-plan registers its own per node). */
function InboxChat() {
  useChatSource(
    { chips: MICHELLE_QUESTIONS.map((q) => ({ q, render: () => <div className="max-w-[860px] rounded-2xl bg-white px-5 py-4 text-[15px] leading-relaxed text-slate-700 ring-1 ring-slate-200">{michelleAnswer(q)}</div> })) },
    "inbox",
  )
  return null
}

export default function MichellePage() {
  return (
    <ChatProvider>
      <Michelle />
    </ChatProvider>
  )
}

function Michelle() {
  const { clear } = useChat()
  // Issues is the queue; Brand & category is gap to plan, computed on every node.
  const [mode, setMode] = useState<"issues" | "gap">("issues")
  const [nodeId, setNodeId] = useState("overall")
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
          <div className="border-r border-slate-200 bg-white">
            <div className="flex gap-1 border-b border-slate-200 p-2">
              {(
                [
                  ["issues", "Issues"],
                  ["gap", "Brand & category"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    clear()
                    setMode(id)
                  }}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    mode === id ? "bg-slate-100 text-slate-950 ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === "issues" ? (
              <OpsBatchList selectedId={selectedId} onSelect={setSelectedId} onApproveAll={handleApproveAll} />
            ) : (
              <GapTree
                selected={nodeId}
                onSelect={(id) => {
                  clear()
                  setNodeId(id)
                }}
              />
            )}
          </div>
          {mode === "issues" ? (
            <OpsBatchDetail batch={selected} onAction={handleAction} />
          ) : (
            <GapDiagnostic
              nodeId={nodeId}
              onInbox={(batchId) => {
                // A recommendation that's already a drafted item opens it in the queue.
                clear()
                setMode("issues")
                setSelectedId(OPS_BATCHES.find((b) => b.id === batchId)?.id ?? OPS_BATCHES.find((b) => batchId.startsWith(b.id))?.id ?? selectedId)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            />
          )}
        </div>
        {mode === "issues" && (
          <>
            <InboxChat />
            <ChatThread />
          </>
        )}
        <OpsDelivered />
        {/* Demo-only control, kept out of the product chrome. Room below for the floating Ask Ally bar. */}
        <div className="flex justify-end px-10 pb-24 opacity-50 hover:opacity-100">
          <ResetDemoButton />
        </div>
      </div>
      <AskBar placeholder="Ask Ally about your ops queue" />
    </PageShell>
  )
}
