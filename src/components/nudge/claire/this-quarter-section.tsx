"use client"

import { cn } from "@/lib/utils"
import { BANKED_OTHER, INFLIGHT, fmtValue } from "../data"
import { CONTENT_BANKED_Q3 } from "../delivered-content-data"
import { ContentDeliveredRow } from "./delivered/content-delivered-row"
import { DeliveredHeader } from "./delivered/columns"
import { DeliveredSummaryRow } from "./delivered/delivered-summary-row"

/**
 * The proof, kept below the actions (waterfall version): this quarter so far,
 * Projected · Delivered · vs projected. Content opens to its reasons as dot
 * bullets, its three types of work, and one link to the results page.
 */
export function ThisQuarterSection() {
  const c = CONTENT_BANKED_Q3
  const projected = c.promised + BANKED_OTHER.reduce((s, b) => s + b.promised, 0)
  const delivered = c.delivered + BANKED_OTHER.reduce((s, b) => s + b.delivered, 0)
  const delta = delivered - projected

  return (
    <section className="px-12 pt-10 pb-4">
      <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">This quarter so far · {INFLIGHT.quarter.name}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight text-slate-500">
          Projected <span className="font-mono">{fmtValue(projected)}</span>
        </span>
        <span className="text-2xl font-semibold tracking-tight text-slate-950">
          Delivered <span className="font-mono text-brand-600">{fmtValue(delivered)}</span>
        </span>
        <span className={cn("font-mono text-sm font-semibold tabular-nums", delta >= 0 ? "text-success-700" : "text-warning-700")}>
          {delta >= 0 ? "+" : "−"}
          {fmtValue(Math.abs(delta))}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DeliveredHeader projectedFirst />
        <ContentDeliveredRow data={c} bullets resultsHref="/content-results?period=qtd" />
        {BANKED_OTHER.map((b) => (
          <DeliveredSummaryRow key={b.agent} bucket={b} projectedFirst />
        ))}
      </div>
    </section>
  )
}
