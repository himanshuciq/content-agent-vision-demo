"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { BANKED_OTHER, INFLIGHT, TEAM_TIER, fmtValue } from "../data"
import { CONTENT_BANKED_Q3, OPS_BANKED_Q3 } from "../delivered-content-data"
import type { ContentDelivered } from "../delivered-content-data"
import { ContentWaterfall } from "./content-waterfall"
import { DELIVERED_GRID, DeliveredHeader, RowLabel, ValueCells } from "./delivered/columns"
import { DeliveredSummaryRow } from "./delivered/delivered-summary-row"

const OPS_ORDER = ["buy-box", "promo-badge", "shipping-speed"]
/** Ops' owner row: Nudge team on an ops bullet nudges Michelle. */
const OPS_TEAM_ROW = TEAM_TIER.rows.find((r) => r.agent === "ops")!

/** A delivered row that opens to its agent's waterfall. Content and ops work the same way. */
function ExpandableRow({ name, data, open, onToggle, children }: { name: string; data: ContentDelivered; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-200">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        className={cn(DELIVERED_GRID, "cursor-pointer px-6 py-3.5 hover:bg-slate-50")}
      >
        <RowLabel name={name} note={data.did} top />
        <ValueCells delivered={data.delivered} promised={data.promised} strong projectedFirst />
        <ChevronDown className={cn("size-4 justify-self-end text-slate-400 transition-transform", open && "rotate-180")} />
      </div>
      {open && <div className="border-t border-slate-100 bg-slate-25 px-6 py-5">{children}</div>}
    </div>
  )
}

/**
 * The proof, kept below the actions (waterfall version): this quarter so far,
 * Projected · Delivered · vs projected. Content and ops open to a small waterfall by
 * type; each bar shows its 2–3 bullets. Deeper detail is the results link.
 */
export function ThisQuarterSection() {
  const [open, setOpen] = useState<"content" | "ops" | null>(null)
  const toggle = (id: "content" | "ops") => setOpen((o) => (o === id ? null : id))
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
        <span className={cn("font-mono text-sm font-semibold tabular-nums", delta >= 0 ? "text-success-700" : "text-error-600")}>
          {delta >= 0 ? "+" : "−"}
          {fmtValue(Math.abs(delta))}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DeliveredHeader projectedFirst />
        <ExpandableRow name="Content" data={c} open={open === "content"} onToggle={() => toggle("content")}>
          <ContentWaterfall data={c} resultsHref="/content-results?period=qtd" />
        </ExpandableRow>
        {BANKED_OTHER.map((b) =>
          b.agent === "ops" ? (
            <ExpandableRow key={b.agent} name="Ops" data={OPS_BANKED_Q3} open={open === "ops"} onToggle={() => toggle("ops")}>
              <ContentWaterfall data={OPS_BANKED_Q3} order={OPS_ORDER} totalLabel="Ops" barClass="bg-info-500" teamRow={OPS_TEAM_ROW} />
            </ExpandableRow>
          ) : (
            <DeliveredSummaryRow key={b.agent} bucket={b} projectedFirst />
          ),
        )}
      </div>
    </section>
  )
}
