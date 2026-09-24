"use client"

export const dynamic = "force-static"

import { Suspense } from "react"
import { AppHeader } from "@/components/home/app-header"
import { ExecBackBar } from "@/components/impact/exec-back-bar"
import { ImpactView } from "@/components/impact/impact-view"
import { LaunchpadTabs } from "@/components/landing/launchpad-tabs"
import { PageShell } from "@/components/layout/page-shell"

function ImpactFallback() {
  return (
    <div className="w-full px-6 py-6">
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  )
}

export default function ImpactPage() {
  return (
    <PageShell className="bg-slate-100">
      <div className="flex min-h-screen flex-col">
        <ExecBackBar />
        <AppHeader />
        <LaunchpadTabs className="border-slate-200/70 bg-white/60 backdrop-blur-xl" />
        <main className="flex-1">
          <Suspense fallback={<ImpactFallback />}>
            <ImpactView />
          </Suspense>
        </main>
      </div>
    </PageShell>
  )
}
