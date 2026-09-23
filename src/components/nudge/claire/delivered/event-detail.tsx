"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmtValue } from "../../data"
import { Funnel } from "./funnel"
import { Learnings } from "./learnings"
import type { EventCard } from "../../delivered-content-data"

const pct = (v: number) => `${v.toFixed(1)}%`
const sales = (v: number) => (v >= 1 ? `$${v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`)

/** One event, opened: the story, the lead over category before vs during, the funnel, the math, the SKUs. */
export function EventDetail({ ev }: { ev: EventCard }) {
  const [showCalc, setShowCalc] = useState(false)
  const leadBefore = ev.youBefore - ev.catBefore
  const leadDuring = ev.youDuring - ev.catDuring
  const extra = leadDuring - leadBefore
  const max = Math.max(leadBefore, leadDuring)

  const bars = [
    { label: "4 weeks before", lead: leadBefore, color: "bg-slate-300" },
    { label: ev.windowLabel, lead: leadDuring, color: "bg-brand-500" },
  ]

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[15px] leading-relaxed text-slate-800">
        {ev.story[0]}
        <br />
        {ev.story[1]}
      </p>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-slate-700">New titles vs the category, same weeks last year</div>
        {bars.map((b) => (
          <div key={b.label} className="grid grid-cols-[220px_minmax(0,1fr)_200px] items-center gap-4">
            <span className="text-sm text-slate-700">{b.label}</span>
            <div className="h-5 overflow-hidden rounded bg-slate-100">
              <div className={cn("h-full rounded", b.color)} style={{ width: `${(b.lead / max) * 100}%` }} />
            </div>
            <span className="text-sm text-slate-600">
              <span className="font-mono font-semibold text-slate-950 tabular-nums">{pct(b.lead)}</span> faster than category
            </span>
          </div>
        ))}
        <div className="mt-1 flex items-baseline gap-1.5 text-sm">
          <Check className="size-3.5 shrink-0 translate-y-0.5 text-success-600" />
          <span>
            <span className="font-medium text-slate-900">Same price and ads as before:</span>{" "}
            <span className="text-slate-600">
              average selling price <span className="font-mono font-semibold text-slate-900 tabular-nums">${ev.aspDuring.toFixed(2)}</span> vs{" "}
              <span className="font-mono tabular-nums">${ev.aspBefore.toFixed(2)}</span> · ad spend up{" "}
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{ev.adSpendChange}%</span>
            </span>
          </span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-1">
        <Funnel rows={ev.funnel} />
      </div>

      <Learnings items={ev.learnings} applied={ev.learningsApplied} />

      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setShowCalc((v) => !v)}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          How we calculated
          <ChevronDown className={cn("size-3.5 transition-transform", showCalc && "rotate-180")} />
        </button>
        <Link
          href="/content-results?type=seasonal&period=quarter"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          See all {ev.skusTotal} SKUs
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {showCalc && (
        <ol className="flex list-decimal flex-col gap-2 rounded-lg bg-slate-25 py-3.5 pr-4 pl-9 text-[13px] leading-relaxed text-slate-600">
          <li>
            <span className="font-medium text-slate-900">What new titles added: </span>
            your SKUs usually grow <b className="font-mono text-slate-900">{pct(leadBefore)}</b> faster than the category. In the{" "}
            {ev.windowLabel} they grew <b className="font-mono text-slate-900">{pct(leadDuring)}</b> faster. The extra{" "}
            <b className="font-mono text-slate-900">{pct(extra)}</b> is from new titles. We don&apos;t A/B test seasonal changes, so every
            shopper sees your event titles.
          </li>
          <li>
            <span className="font-medium text-slate-900">What we expected: </span>
            <b className="font-mono text-slate-900">{pct(ev.expectedLift)}</b>, the average lift from new titles in your last{" "}
            {ev.expectedFrom.length} seasonal events, measured the same way (
            {ev.expectedFrom.map((e, i) => (
              <span key={e.name}>
                {i > 0 && ", "}
                {e.name} <span className="font-mono">+{pct(e.lift)}</span>
              </span>
            ))}
            ).
          </li>
          <li>
            <span className="font-medium text-slate-900">Promised: </span>
            <b className="font-mono text-slate-900">{pct(ev.expectedLift)}</b> × <b className="font-mono text-slate-900">{sales(ev.expectedSales)}</b>{" "}
            expected {ev.name} sales (last year&apos;s <span className="font-mono">{sales(ev.lastYearSales)}</span>, up {ev.trend}% on current trend) ≈{" "}
            <b className="font-mono text-slate-900">{fmtValue(ev.promised)}</b>
          </li>
          <li>
            <span className="font-medium text-slate-900">Delivered: </span>
            <b className="font-mono text-slate-900">{pct(extra)}</b> × <b className="font-mono text-slate-900">{sales(ev.eventSales)}</b> actual sales on the
            SKUs that went live ≈ <b className="font-mono text-slate-900">{fmtValue(ev.delivered)}</b>
          </li>
        </ol>
      )}

    </div>
  )
}
