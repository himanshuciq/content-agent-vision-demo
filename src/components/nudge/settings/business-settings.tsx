"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNudge } from "../nudge-context"
import type { BusinessGroup, BusinessSort } from "../nudge-context"

const OPTIONS: { id: BusinessSort; label: string; note: string }[] = [
  { id: "gap", label: "Gap to plan", note: "Furthest behind first: where the money is" },
  { id: "sales", label: "Sales", note: "Top SKUs first, whatever their gap" },
]

const GROUPS: { id: BusinessGroup; label: string; note: string }[] = [
  { id: "Brand", label: "Brand › Category › SKU", note: "Several brands, each with its own owner (default)" },
  { id: "Category", label: "Category › Brand › SKU", note: "Category managers, or brands sharing categories" },
]

/** How the Business view ranks its list and which scope it offers, set once per customer. */
export function BusinessSettings() {
  const { businessSort, setBusinessSort, businessGroup, setBusinessGroup } = useNudge()
  return (
    <div className="flex flex-col gap-6">
    <Choice title="Rank the Business view by" options={OPTIONS} value={businessSort} onChange={setBusinessSort} />
    <Choice title="Organize the Business view as" options={GROUPS} value={businessGroup} onChange={setBusinessGroup} />
    </div>
  )
}

function Choice<T extends string>({ title, options, value, onChange }: { title: string; options: { id: T; label: string; note: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-25 px-6 py-4">
        <div className="text-lg font-semibold text-slate-950">{title}</div>
      </div>
      <div className="px-6 py-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className="flex w-full items-center justify-between gap-4 border-t border-slate-100 py-3.5 text-left first:border-t-0"
          >
            <span>
              <span className="block text-[15px] font-semibold text-slate-950">{o.label}</span>
              <span className="block text-sm text-slate-500">{o.note}</span>
            </span>
            <span className={cn("flex size-5 items-center justify-center rounded-full border", value === o.id ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300")}>
              {value === o.id && <Check className="size-3" />}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
