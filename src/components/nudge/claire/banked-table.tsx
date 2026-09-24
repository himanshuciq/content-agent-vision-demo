"use client"

import { cn } from "@/lib/utils"
import { BANKED_OTHER, fmtValue } from "../data"
import { CONTENT_BANKED_Q3 } from "../delivered-content-data"
import { ContentDeliveredRow } from "./delivered/content-delivered-row"
import { DeliveredHeader } from "./delivered/columns"
import { DeliveredSummaryRow } from "./delivered/delivered-summary-row"

/** Banked so far this quarter, in the same table as "How we did": content first and layered, then media and ops. */
export function BankedTable() {
  const promised = CONTENT_BANKED_Q3.promised + BANKED_OTHER.reduce((s, b) => s + b.promised, 0)
  const banked = CONTENT_BANKED_Q3.delivered + BANKED_OTHER.reduce((s, b) => s + b.delivered, 0)
  const delta = banked - promised

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-base font-semibold text-slate-950">
          Banked so far: <span className="font-mono">{fmtValue(banked)}</span> of <span className="font-mono">{fmtValue(promised)}</span> promised
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
            delta >= 0 ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700",
          )}
        >
          {delta >= 0 ? "+" : "−"}
          {fmtValue(Math.abs(delta))}
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DeliveredHeader first="Banked" />
        <ContentDeliveredRow data={CONTENT_BANKED_Q3} />
        {BANKED_OTHER.map((b) => (
          <DeliveredSummaryRow key={b.agent} bucket={b} />
        ))}
      </div>
    </div>
  )
}
