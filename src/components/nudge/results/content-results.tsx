"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { ResultsMetrics } from "./results-metrics"
import { ResultsTable } from "./results-table"
import { RESULTS_BY_PERIOD } from "../content-results-data"
import type { ResultPeriod, ResultType } from "../content-results-data"

type View = "all" | ResultType

const TABS: { id: View; label: string }[] = [
  { id: "all", label: "All" },
  { id: "seasonal", label: "Seasonal" },
  { id: "foundational", label: "Foundational" },
  { id: "retail-readiness", label: "Retail readiness" },
]

const PERIODS: { id: ResultPeriod; label: string }[] = [
  { id: "qtd", label: "This quarter" },
  { id: "month", label: "Last month" },
  { id: "quarter", label: "Last quarter" },
  { id: "year", label: "Last year" },
]

function Segmented<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg border border-slate-200 bg-slate-25 p-1">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === t.id ? "bg-white text-slate-950 shadow-xs ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Content results, one page: pick a type of work, see its five numbers, then every SKU behind them. */
export function ContentResults() {
  const router = useRouter()
  const params = useSearchParams()
  const initial = (TABS.find((t) => t.id === params.get("type"))?.id ?? "all") as View
  const [view, setView] = useState<View>(initial)
  const [period, setPeriod] = useState<ResultPeriod>(
    (PERIODS.find((p) => p.id === params.get("period"))?.id ?? "qtd") as ResultPeriod,
  )

  const results = RESULTS_BY_PERIOD[period]
  const sections = view === "all" ? results.sections : results.sections.filter((s) => s.type === view)
  const current = view === "all" ? null : sections[0]
  const totals = current ? current.totals : results.all

  function back() {
    if (window.history.length > 1) router.back()
    else router.push("/claire-waterfall")
  }

  return (
    <div className="flex flex-col gap-7 px-12 py-8">
      <div className="flex flex-col gap-4">
        <button type="button" onClick={back} className="inline-flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="size-4" />
          Back to overview
        </button>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">Content results · {results.name}</div>
            <h1 className="mt-1 text-[32px] leading-tight font-bold tracking-tight text-slate-950">
              <span className="font-mono text-brand-600">{fmtValue(totals.incremental)}</span> delivered of <span className="font-mono">{fmtValue(totals.promised)}</span> projected
            </h1>
            <div className="mt-1 text-base text-slate-500">
              {totals.live.toLocaleString()} of {totals.promisedSkus.toLocaleString()} SKUs live
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented items={PERIODS} value={period} onChange={setPeriod} />
            <Segmented items={TABS} value={view} onChange={setView} />
          </div>
        </div>
      </div>

      <ResultsMetrics totals={totals} sections={results.sections} current={current} />

      {sections.map((s) => (
        <ResultsTable key={s.type} section={s} />
      ))}
    </div>
  )
}
