"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { APPROVAL_TIER, BUSINESS, DEADLINE, INFLIGHT, OPEN_BY_AREA, OPEN_TOTAL, fmtBiz } from "../data"
import type { Period } from "../types"

const PERIODS: { id: Period; label: string }[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "quarter", label: "This quarter" },
  { id: "year", label: "This year" },
]

/**
 * The top of Claire's page, in her business terms: where she's landing against
 * plan, the gap, and the open opportunity that closes it. Then where it sits and
 * how fast it unlocks.
 */
export function BusinessHero({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false)
  const b = BUSINESS[period]
  const gap = b.plan - b.pace

  return (
    <section className="px-12 pt-9 pb-7">
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
        <span className="mr-1 flex size-5 items-center justify-center rounded-md bg-brand-500" aria-label="Ally">
          <span className="size-1.5 rounded-full bg-brand-200" />
        </span>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md py-0.5 font-semibold text-slate-950 outline-none">
            {INFLIGHT[period].name}
            <ChevronDown className={cn("size-3.5 text-slate-400 transition-transform", open && "rotate-180")} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={6} className="min-w-40 rounded-xl p-1.5 shadow-md ring-1 ring-slate-200/80">
            <DropdownMenuRadioGroup
              value={period}
              onValueChange={(v) => {
                onPeriodChange(v as Period)
                setOpen(false)
              }}
            >
              {PERIODS.map((p) => (
                <DropdownMenuRadioItem
                  key={p.id}
                  value={p.id}
                  className="cursor-pointer rounded-lg px-2.5 py-1.5 text-sm outline-hidden select-none focus:bg-brand-50 data-checked:bg-brand-100 data-checked:text-slate-900 **:data-[slot=dropdown-menu-radio-item-indicator]:hidden"
                >
                  {p.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-slate-300">·</span>
        <span>
          <span className="font-mono font-semibold text-slate-950">{fmtBiz(b.soFar)}</span> so far · on pace for{" "}
          <span className="font-mono font-semibold text-slate-950">{fmtBiz(b.pace)}</span> against a{" "}
          <span className="font-mono font-semibold text-slate-950">{fmtBiz(b.plan)}</span> plan
        </span>
      </div>

      <h1 className="mt-4 text-[44px] leading-tight font-bold tracking-tight text-slate-950">
        <span className="font-mono">{fmtBiz(gap)}</span> gap to plan. <span className="font-mono text-brand-600">{OPEN_TOTAL}</span> of opportunity can close it.
      </h1>

      <div className="mt-2 text-base text-slate-500">
        {OPEN_BY_AREA.map((a, i) => (
          <span key={a.agent}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            <span className="font-semibold text-slate-700">{a.value}</span> in {a.agent}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xl font-semibold">
        <span className="text-brand-600">
          {APPROVAL_TIER.effort} of your team&apos;s time unlocks {APPROVAL_TIER.value}
        </span>
        <span className="text-slate-300"> · </span>
        <span className="text-warning-600">
          {DEADLINE.expiring}
          {" "}expires in {DEADLINE.days} days
        </span>
      </div>
    </section>
  )
}
