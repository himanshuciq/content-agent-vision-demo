"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ExecHeader } from "@/components/exec/exec-header"
import { WhatWeDid } from "@/components/exec/what-we-did"
import { DEFAULT_PERIOD, type PeriodId } from "@/components/exec/data"

/**
 * Exec home. Deliberately no LaunchpadTabs and no AppModuleTabs (Home / Content /
 * Ops / Insights / Media) — this is a destination screen for an exec, not a hub
 * into the rest of the app. Block 1 ("what we did") only; blocks 2 and 3 land
 * once this one is signed off.
 */
export default function ExecHomePage() {
  const [period, setPeriod] = useState<PeriodId>(DEFAULT_PERIOD)

  return (
    <PageShell className="bg-slate-50">
      <div className="relative flex min-h-screen flex-col">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(80%_100%_at_50%_-20%,var(--color-brand-100),transparent_65%)]" />
        </div>

        <ExecHeader period={period} onPeriodChange={setPeriod} />
        <main className="flex-1 px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <WhatWeDid period={period} onPeriodChange={setPeriod} />
          </div>
        </main>
      </div>
    </PageShell>
  )
}
