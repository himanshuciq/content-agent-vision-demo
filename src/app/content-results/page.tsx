"use client"

import { Suspense } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ContentResults } from "@/components/nudge/results/content-results"
import { AskAlly } from "@/components/nudge/claire/ask-ally"
import { RESULTS_QUESTIONS, resultsAnswer } from "@/components/nudge/ask-ally-personas"

/** "See all SKUs": every content change last quarter, by type of work, with its lifts. Reached from the How we did cards. */
export default function ContentResultsPage() {
  return (
    <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <Suspense fallback={null}>
          <ContentResults />
        </Suspense>
        {/* Room below for the floating Ask Ally bar. */}
        <div className="h-20" />
      </div>
      <AskAlly questions={RESULTS_QUESTIONS} renderAnswer={resultsAnswer} placeholder="Ask Ally about these results" />
    </PageShell>
  )
}
