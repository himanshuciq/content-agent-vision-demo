"use client"

import { useState } from "react"
import { ChevronDown, FileText, Megaphone, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CLOSED, DEFAULT_CLOSED_GRAIN, INFLIGHT } from "../data"
import type { ClosedGrain, Period } from "../types"

const PERIODS: { id: Period; label: string }[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "quarter", label: "This quarter" },
  { id: "year", label: "This year" },
]

const GRAINS: { id: ClosedGrain; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
  { id: "year", label: "Year" },
]

const LAST_LABEL: Record<ClosedGrain, string> = {
  month: "last month",
  quarter: "last quarter",
  year: "last year",
}

interface StatusStripProps {
  period: Period
  onPeriodChange: (p: Period) => void
}

/**
 * The in-flight business context Claire reports on. The "driven by Ally" pill
 * on the right expands the agent breakdown for the closed period. Shared by
 * both the tier (/claire) and waterfall (/claire-waterfall) versions.
 */
export function StatusStrip({ period, onPeriodChange }: StatusStripProps) {
  const [periodOpen, setPeriodOpen] = useState(false)
  const [retroOpen, setRetroOpen] = useState(false)
  const [grain, setGrain] = useState<ClosedGrain>(DEFAULT_CLOSED_GRAIN)
  const cur = INFLIGHT[period]
  const closed = CLOSED[grain]

  return (
    <div className="border-b border-slate-200">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-12 py-3.5 text-sm">
        <DropdownMenu open={periodOpen} onOpenChange={setPeriodOpen}>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md py-1 pr-1 outline-none">
            <span className="font-semibold text-slate-950">{cur.name}</span>
            <span className="font-mono text-[11px] tracking-wide text-slate-400 uppercase">In flight</span>
            <ChevronDown className={cn("size-3.5 text-slate-400 transition-transform", periodOpen && "rotate-180")} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={6} className="min-w-40 rounded-xl p-1.5 shadow-md ring-1 ring-slate-200/80">
            <DropdownMenuRadioGroup value={period} onValueChange={(v) => { onPeriodChange(v as Period); setPeriodOpen(false) }}>
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

        <Divider />
        <Metric value={cur.ptd} label={cur.ptdLabel} />
        <Divider />
        <span className="text-slate-600">
          <span className="font-mono font-semibold text-slate-950">{cur.plan}</span> to plan
        </span>
        <Divider />
        <span className="text-slate-600">{cur.share}</span>

        <button
          type="button"
          onClick={() => setRetroOpen((v) => !v)}
          className={cn(
            "ml-auto flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors",
            retroOpen ? "border-brand-200 bg-brand-25" : "border-slate-200 bg-slate-25 hover:bg-slate-100",
          )}
        >
          <span className="text-slate-500">{closed.name}</span>
          <span className="text-slate-700">
            <span className="font-mono font-semibold text-slate-950">{closed.total}</span> driven by Ally
          </span>
          <ChevronDown className={cn("size-3.5 text-slate-400 transition-transform", retroOpen && "rotate-180")} />
        </button>
      </div>

      {retroOpen && (
        <div className="border-t border-slate-100 bg-slate-25/60 px-12 pt-5 pb-7">
          <div className="flex items-center justify-between gap-6">
            <div className="text-[15px] text-slate-600">
              <span className="font-semibold text-slate-950">AllyAI</span> drove{" "}
              <span className="font-semibold text-slate-950">{closed.total}</span> in incremental sales {LAST_LABEL[grain]}
            </div>
            <div className="flex gap-1 rounded-md bg-slate-100 p-1">
              {GRAINS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrain(g.id)}
                  className={cn(
                    "rounded px-3.5 py-1.5 text-sm",
                    grain === g.id ? "bg-white font-semibold text-slate-950 shadow-xs" : "text-slate-600",
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-7">
            <BreakdownRow icon={FileText} tint="bg-brand-100 text-brand-700" agent="content" story={closed.contentStory} value={closed.content} />
            <BreakdownRow icon={Megaphone} tint="bg-info-100 text-info-700" agent="media" story={closed.mediaStory} value={closed.media} />
            <BreakdownRow icon={Wrench} tint="bg-success-100 text-success-700" agent="ops" story={closed.opsStory} value={closed.ops} last />
          </div>
        </div>
      )}
    </div>
  )
}

function Divider() {
  return <span className="h-3.5 w-px shrink-0 bg-slate-200" />
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <span className="text-slate-600">
      <span className="font-mono font-semibold text-slate-950">{value}</span> {label}
    </span>
  )
}

function BreakdownRow({
  icon: Icon,
  tint,
  agent,
  story,
  value,
  last,
}: {
  icon: typeof Megaphone
  tint: string
  agent: string
  story: string
  value: string
  last?: boolean
}) {
  return (
    <div className={cn("grid grid-cols-[36px_1fr_140px] items-start gap-4.5 py-4.5", !last && "border-b border-slate-100")}>
      <div className={cn("flex size-9 items-center justify-center rounded-lg", tint)}>
        <Icon className="size-4.5" />
      </div>
      <div className="text-[15px] leading-relaxed text-slate-700">
        <span className="font-semibold text-slate-950">{agent} agent</span> {story}
      </div>
      <div className="text-right font-mono text-lg font-semibold text-slate-950 tabular-nums">{value}</div>
    </div>
  )
}
