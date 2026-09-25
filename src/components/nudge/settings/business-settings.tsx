"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNudge } from "../nudge-context"
import type { BusinessSort } from "../nudge-context"

const OPTIONS: { id: BusinessSort; label: string; note: string }[] = [
  { id: "gap", label: "Gap to plan", note: "Furthest behind first: where the money is" },
  { id: "sales", label: "Sales", note: "Top SKUs first, whatever their gap" },
]

/** How the Business view ranks its list, set once per customer. */
export function BusinessSettings() {
  const { businessSort, setBusinessSort } = useNudge()
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-25 px-6 py-4">
        <div className="text-lg font-semibold text-slate-950">Rank the Business view by</div>
      </div>
      <div className="px-6 py-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setBusinessSort(o.id)}
            aria-pressed={businessSort === o.id}
            className="flex w-full items-center justify-between gap-4 border-t border-slate-100 py-3.5 text-left first:border-t-0"
          >
            <span>
              <span className="block text-[15px] font-semibold text-slate-950">{o.label}</span>
              <span className="block text-sm text-slate-500">{o.note}</span>
            </span>
            <span className={cn("flex size-5 items-center justify-center rounded-full border", businessSort === o.id ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300")}>
              {businessSort === o.id && <Check className="size-3" />}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
