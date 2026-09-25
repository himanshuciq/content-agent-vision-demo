"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BUSINESS, INFLIGHT, fmtBiz } from "../data"
import { useLive } from "../live-model"
import { SettingsGear } from "../settings-gear"
import type { Period } from "../types"

const PERIOD_WORDS: Record<Period, string> = { week: "this week", month: "this month", quarter: "this quarter", year: "this year" }

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
  const live = useLive()
  const b = { ...BUSINESS[period], pace: live.pace(period) }
  const gap = b.plan - b.pace

  return (
    <section className="px-12 pt-9 pb-7">
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
          <span className="mr-1 flex size-5 items-center justify-center rounded-md bg-brand-500" aria-label="Ally">
            <span className="size-1.5 rounded-full bg-brand-200" />
          </span>
          <span>Hi Claire</span>
          <span className="text-slate-300">·</span>
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
                    className="cursor-pointer rounded-lg px-2.5 py-1.5 text-sm outline-hidden select-none focus:bg-brand-50 data-checked:bg-brand-100 data-checked:text-slate-950 **:data-[slot=dropdown-menu-radio-item-indicator]:hidden"
                  >
                    {p.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SettingsGear />
      </div>

      {/* Fact, then the gap, then what closes it. The fact line is the same size as the first line on Mike's and Michelle's pages. */}
      <div className="mt-5 text-2xl font-semibold tracking-tight text-slate-700">
        You&apos;re tracking to <span className="font-mono text-slate-950">{fmtBiz(b.pace)}</span> in sales {PERIOD_WORDS[period]}.
      </div>

      <h1 className="mt-1 text-[44px] leading-tight font-bold tracking-tight text-slate-950">
        <span className="block">
          That&apos;s <span className="font-mono">{fmtBiz(gap)}</span> short of your <span className="font-mono">{fmtBiz(b.plan)}</span> plan.
        </span>
        <span className="block">
          We have <span className="font-mono text-brand-600">{live.open.totalLabel}</span> in the pipeline to close it.
        </span>
      </h1>

      <div className="mt-2 text-base text-slate-500">
        {live.open.byArea.map((a, i) => (
          <span key={a.agent}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            <span className="font-semibold text-slate-700">{a.value}</span> in {a.agent}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xl font-semibold">
        <span className="text-brand-600">
          {live.approval.effort} of your team&apos;s time unlocks {live.approval.value}
        </span>
        {live.deadline && (
          <>
            <span className="text-slate-300"> · </span>
            <span className="text-warning-600">
              {live.deadline.expiring} expires in {live.deadline.days} days
            </span>
          </>
        )}
      </div>
    </section>
  )
}
