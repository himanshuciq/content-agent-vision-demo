"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { TIER_GRID } from "./nudge-tier"
import { BankedTable } from "./banked-table"
import { BANKED_VALUE } from "../data"

/** Banked tier: no action, but expands to show what went live and how it was delivered. */
export function BankedTier() {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-success-200 bg-success-50/50">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
        className={cn(TIER_GRID, "cursor-pointer px-6 py-3.5 hover:bg-success-50")}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-slate-950">Already banked</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
            <Check className="size-3" />
            Live this quarter
          </span>
        </div>
        <div className="text-right font-mono text-xl font-bold tracking-tight text-slate-950 tabular-nums">{BANKED_VALUE}</div>
        <div />
        <ChevronDown className={cn("size-4 justify-self-end text-slate-400 transition-transform", open && "rotate-180")} />
      </div>

      {open && (
        <div className="border-t border-success-200/70 px-6 py-5">
          <BankedTable />
        </div>
      )}
    </div>
  )
}
