"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { EventDetail } from "./event-detail"
import { AbTestDetail } from "./ab-test-detail"
import { DELIVERED_GRID, RowLabel, ValueCells } from "./columns"
import { CONTENT_DELIVERED_Q2 } from "../../delivered-content-data"
import type { ContentDelivered, WorkType } from "../../delivered-content-data"

function Toggle({ open }: { open: boolean }) {
  return <ChevronDown className={cn("size-4 justify-self-end text-slate-400 transition-transform", open && "rotate-180")} />
}

/** One type of work, indented under Content, tagged with how it's measured. Seasonal, Foundational and Retail readiness open in place. */
function WorkTypeRow({ wt, projectedFirst }: { wt: WorkType; projectedFirst?: boolean }) {
  const [open, setOpen] = useState(false)
  const expandable = !!wt.event || !!wt.abTest

  return (
    <div className="border-t border-slate-100">
      <div
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        onClick={() => expandable && setOpen((o) => !o)}
        className={cn(DELIVERED_GRID, "px-6 py-3", expandable && "cursor-pointer hover:bg-slate-50")}
      >
        <RowLabel name={wt.name} note={wt.did} tag={wt.method} indent />
        <ValueCells delivered={wt.delivered} promised={wt.promised} projectedFirst={projectedFirst} />
        {expandable ? <Toggle open={open} /> : <span />}
      </div>
      {open && (wt.event || wt.abTest) && (
        <div className="mx-6 mb-4 ml-11 rounded-lg border border-slate-200 bg-white px-5 py-5">
          {wt.event ? <EventDetail ev={wt.event} /> : wt.abTest && <AbTestDetail t={wt.abTest} skuType={wt.id} />}
        </div>
      )}
    </div>
  )
}

/** Content for a period: one line; opens to its summary and three types of work on a light band. */
const DOT = { orange: "bg-warning-500", red: "bg-error-500", green: "bg-success-500", learn: "bg-brand-500" }

/**
 * bullets: the waterfall version shows dot bullets (orange waiting, red lost,
 * green worked) and a results link instead of the two-line summary, with
 * columns in Projected · Delivered order.
 */
export function ContentDeliveredRow({ data = CONTENT_DELIVERED_Q2, bullets = false, resultsHref }: { data?: ContentDelivered; bullets?: boolean; resultsHref?: string }) {
  const [open, setOpen] = useState(false)
  const d = data

  return (
    <div className="border-t border-slate-200">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
        className={cn(DELIVERED_GRID, "cursor-pointer px-6 py-3.5 hover:bg-slate-50")}
      >
        <RowLabel name="Content" note={d.did} top />
        <ValueCells delivered={d.delivered} promised={d.promised} strong projectedFirst={bullets} />
        <Toggle open={open} />
      </div>
      {open && (
        <div className="bg-slate-25">
          {bullets && d.bullets ? (
            <ul className="flex flex-col gap-2 border-t border-slate-100 py-3.5 pr-16 pl-11">
              {d.bullets.map((b) => (
                <li key={b.text} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[b.tone])} />
                  {b.text}
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-t border-slate-100 py-3.5 pr-16 pl-11 text-sm leading-relaxed">
              <p className="font-medium text-slate-900">{d.summary[0]}</p>
              <p className="mt-0.5 text-slate-600">{d.summary[1]}</p>
            </div>
          )}
          {d.workTypes.map((wt) => (
            <WorkTypeRow key={wt.id} wt={wt} projectedFirst={bullets} />
          ))}
          {resultsHref && (
            <div className="border-t border-slate-100 py-3 pl-11">
              <Link href={resultsHref} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
                See SKU-level results and method
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
