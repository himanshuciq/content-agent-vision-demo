"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopStrip } from "@/components/nudge/top-strip"
import { cn } from "@/lib/utils"
import { PageShell } from "@/components/layout/page-shell"
import { ReviewPolicy } from "@/components/nudge/settings/review-policy"
import { Knowledge } from "@/components/nudge/settings/knowledge"
import { BusinessSettings } from "@/components/nudge/settings/business-settings"

const TABS = [
  { id: "policy", label: "Review policy" },
  { id: "knowledge", label: "Knowledge" },
  { id: "business", label: "Business view" },
] as const

/** Settings, behind the gear on every page: how Ally ships changes, and what it should know. Kept out of the main path. */
function Settings() {
  const router = useRouter()
  const params = useSearchParams()
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>(TABS.find((t) => t.id === params.get("tab"))?.id ?? "policy")

  function back() {
    if (window.history.length > 1) router.back()
    else router.push("/claire-waterfall")
  }

  return (
    <>
    <TopStrip person="claire" home="/claire-waterfall" className="px-12" crumbs={[{ label: "Home", onClick: back }, { label: "Settings" }]} />
    <div className="flex flex-col gap-6 px-12 pt-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-tight text-slate-950">Settings</h1>
        <div className="flex rounded-lg border border-slate-200 bg-slate-25 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-300",
                tab === t.id ? "bg-white text-slate-950 shadow-xs ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tab === "policy" ? <ReviewPolicy /> : tab === "knowledge" ? <Knowledge /> : <BusinessSettings />}
    </div>
    </>
  )
}

export default function SettingsPage() {
  return (
    <PageShell className="bg-slate-50">
      <div className="mx-auto max-w-[1080px] overflow-hidden bg-white shadow-pane-lg sm:my-6 sm:rounded-2xl sm:ring-1 sm:ring-slate-900/6">
        <Suspense fallback={null}>
          <Settings />
        </Suspense>
      </div>
    </PageShell>
  )
}
