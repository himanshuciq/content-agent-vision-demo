"use client"

import { cn } from "@/lib/utils"
import { DELIVERED, fmtValue } from "../data"
import { ContentDeliveredRow } from "./delivered/content-delivered-row"
import { DeliveredSummaryRow } from "./delivered/delivered-summary-row"
import { DeliveredHeader } from "./delivered/columns"
import type { Period } from "../types"

/**
 * "How did I do": promise vs delivered for the last closed period. Rides the
 * single period switcher (week falls back to quarter). Content for the quarter
 * is fully layered; other buckets and periods are summary rows until designed.
 */
export function DeliveredSection({ period }: { period: Period }) {
  const grain = period === "week" ? "quarter" : period
  const d = DELIVERED[grain]
  const promised = d.buckets.reduce((s, b) => s + b.promised, 0)
  const delivered = d.buckets.reduce((s, b) => s + b.delivered, 0)
  const delta = delivered - promised
  const beat = delta >= 0

  return (
    <section className="px-12 pt-9 pb-2">
      <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">How we did · {d.periodName}</div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight text-slate-950">
          We promised <span className="font-mono">{fmtValue(promised)}</span>, delivered{" "}
          <span className="font-mono">{fmtValue(delivered)}</span>
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 font-mono text-sm font-semibold tabular-nums",
            beat ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700",
          )}
        >
          {beat ? "+" : "−"}
          {fmtValue(Math.abs(delta))}
        </span>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DeliveredHeader />
        {d.buckets.map((b) =>
          b.agent === "content" && grain === "quarter" ? (
            <ContentDeliveredRow key={b.agent} />
          ) : (
            <DeliveredSummaryRow key={b.agent} bucket={b} />
          ),
        )}
      </div>
    </section>
  )
}
