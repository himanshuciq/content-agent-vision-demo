"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ResetDemoButton } from "@/components/nudge/reset-demo-button"
import { WeeklyBanner } from "@/components/nudge/claire/weekly-banner"
import { BusinessHero } from "@/components/nudge/claire/business-hero"
import { WaterfallChart } from "@/components/nudge/waterfall/waterfall-chart"
import type { WaterfallSelection } from "@/components/nudge/waterfall/waterfall-chart"
import { AreaDetail } from "@/components/nudge/waterfall/area-detail"
import { StageDetail } from "@/components/nudge/waterfall/stage-detail"
import { ThisQuarterSection } from "@/components/nudge/claire/this-quarter-section"
import { AskAlly } from "@/components/nudge/claire/ask-ally"
import { useLive } from "@/components/nudge/live-model"
import type { Period } from "@/components/nudge/types"

/**
 * Alternate view of the same buckets as /claire, rendered as a bridge to plan
 * (on pace → open buckets → with Ally, against the plan line). Clicking a stage
 * opens its line items; clicking "Total opportunity" opens the split by area. Same
 * shared nudge state as the tier version.
 */
export default function ClaireWaterfallPage() {
  const [period, setPeriod] = useState<Period>("quarter")
  const [selectedId, setSelectedId] = useState<WaterfallSelection>("approval")

  const { stages } = useLive()
  const selected = stages.find((s) => s.id === selectedId) ?? stages[0]

  return (
    <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <WeeklyBanner overlay />
        <BusinessHero period={period} onPeriodChange={setPeriod} />

        <div className="px-12 pt-1 pb-3">
          <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">Where it sits today</div>
        </div>

        <div className="px-12 pb-2">
          <WaterfallChart selectedId={selectedId} onSelect={setSelectedId} />
          {selectedId === "total" ? (
            <AreaDetail />
          ) : (
            <StageDetail stage={selected} />
          )}
        </div>

        <ThisQuarterSection />
        {/* Demo-only control, kept out of the product chrome. Room below for the floating Ask Ally bar. */}
        <div className="flex justify-end px-12 pt-6 pb-24 opacity-50 hover:opacity-100">
          <ResetDemoButton />
        </div>
        <AskAlly />
      </div>
    </PageShell>
  )
}
