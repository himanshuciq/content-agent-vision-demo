"use client"

import { cn } from "@/lib/utils"
import { INFLIGHT, fmtValue } from "../data"
import { CONTENT_BANKED_Q3 } from "../delivered-content-data"
import { ContentWaterfall } from "../claire/content-waterfall"

/** Claire's "This quarter so far", content only: projected vs delivered, then the content waterfall by type. */
export function MikeDelivered() {
  const c = CONTENT_BANKED_Q3
  const delta = c.delivered - c.promised

  return (
    <section className="border-t border-slate-200 px-10 pt-9 pb-10">
      <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">This quarter so far · {INFLIGHT.quarter.name}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight text-slate-500">
          Projected <span className="font-mono">{fmtValue(c.promised)}</span>
        </span>
        <span className="text-2xl font-semibold tracking-tight text-slate-950">
          Delivered <span className="font-mono text-brand-600">{fmtValue(c.delivered)}</span>
        </span>
        <span className={cn("font-mono text-sm font-semibold tabular-nums", delta >= 0 ? "text-success-700" : "text-error-600")}>
          {delta >= 0 ? "+" : "−"}
          {fmtValue(Math.abs(delta))}
        </span>
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-25 px-6 py-5">
        <ContentWaterfall data={c} resultsHref="/content-results?period=qtd" canNudge={false} />
      </div>
    </section>
  )
}
