"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ClaireHeader } from "@/components/nudge/claire/claire-header"
import { WeeklyBanner } from "@/components/nudge/claire/weekly-banner"
import { BusinessHero } from "@/components/nudge/claire/business-hero"
import { WaterfallChart } from "@/components/nudge/waterfall/waterfall-chart"
import type { WaterfallSelection } from "@/components/nudge/waterfall/waterfall-chart"
import { AreaView } from "@/components/nudge/claire/area-view"
import { StageDetail } from "@/components/nudge/waterfall/stage-detail"
import { ThisQuarterSection } from "@/components/nudge/claire/this-quarter-section"
import { AskAlly } from "@/components/nudge/claire/ask-ally"
import { WATERFALL_STAGES } from "@/components/nudge/data"
import type { WaterfallStage } from "@/components/nudge/data"
import type { Period } from "@/components/nudge/types"

/**
 * Alternate view of the same buckets as /claire, rendered as a bridge to plan
 * (on pace → open buckets → with Ally, against the plan line). Clicking a stage
 * opens its line items; clicking "With Ally" opens the split by area. Same
 * shared nudge state as the tier version.
 */
export default function ClaireWaterfallPage() {
  const [period, setPeriod] = useState<Period>("quarter")
  const [selectedId, setSelectedId] = useState<WaterfallSelection>("approval")

  const selected = WATERFALL_STAGES.find((s) => s.id === selectedId) ?? WATERFALL_STAGES[0]

  return (
    <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <ClaireHeader period={period} />
        <WeeklyBanner />
        <BusinessHero period={period} onPeriodChange={setPeriod} />

        <div className="px-12 pt-1 pb-3">
          <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">Where it sits today</div>
        </div>

        <div className="px-12 pb-2">
          <WaterfallChart selectedId={selectedId} onSelect={setSelectedId} />
          {selectedId === "total" ? (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-25 px-6 py-4">
                <span className="text-lg font-semibold text-slate-950">Open opportunity by area</span>
              </div>
              <div className="px-6 py-4">
                <AreaView />
              </div>
            </div>
          ) : (
            <StageDetail stage={selected} />
          )}
        </div>

        <div className="pb-24">
          <ThisQuarterSection />
        </div>
        <AskAlly />
      </div>
    </PageShell>
  )
}
