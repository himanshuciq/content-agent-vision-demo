"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
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
function WorkTypeRow({ wt }: { wt: WorkType }) {
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
        <ValueCells delivered={wt.delivered} promised={wt.promised} />
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
export function ContentDeliveredRow({ data = CONTENT_DELIVERED_Q2 }: { data?: ContentDelivered }) {
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
        <ValueCells delivered={d.delivered} promised={d.promised} strong />
        <Toggle open={open} />
      </div>
      {open && (
        <div className="bg-slate-25">
          <div className="border-t border-slate-100 py-3.5 pr-16 pl-11 text-sm leading-relaxed">
            <p className="font-medium text-slate-900">{d.summary[0]}</p>
            <p className="mt-0.5 text-slate-600">{d.summary[1]}</p>
          </div>
          {d.workTypes.map((wt) => (
            <WorkTypeRow key={wt.id} wt={wt} />
          ))}
        </div>
      )}
    </div>
  )
}
