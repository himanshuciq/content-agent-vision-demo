import { Card, CardContent } from "@/components/ui/card"
import { WhatWeDidHeader } from "./what-we-did-header"
import { BusinessRead } from "./business-read"
import { DeliveredLines } from "./delivered-lines"
import { SelfDriveAndBenchmark } from "./self-drive-benchmark"
import { EmailTeamAction } from "./email-team-action"
import type { PeriodId } from "./data"

interface WhatWeDidProps {
  period: PeriodId
  onPeriodChange: (id: PeriodId) => void
}

/**
 * Block 1 of the exec home copy deck: "what we did." Entirely sentences, no
 * tables — exec home is entirely claims. Blocks 2 ("what's open") and 3
 * ("how fast it can move") land once this one is signed off.
 */
export function WhatWeDid({ period, onPeriodChange }: WhatWeDidProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <WhatWeDidHeader period={period} onPeriodChange={onPeriodChange} />
        <EmailTeamAction />
      </div>

      <Card className="relative overflow-hidden rounded-3xl border-0 py-0 shadow-pane-lg ring-1 ring-slate-900/6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(70%_100%_at_15%_0%,var(--color-brand-50),transparent_72%)]"
        />
        <CardContent className="relative p-8">
          <BusinessRead />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 py-0 shadow-pane ring-1 ring-slate-900/6">
        <CardContent className="p-6">
          <DeliveredLines />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 bg-slate-50 py-0 shadow-none ring-1 ring-slate-900/5">
        <CardContent className="p-6">
          <SelfDriveAndBenchmark />
        </CardContent>
      </Card>
    </section>
  )
}
