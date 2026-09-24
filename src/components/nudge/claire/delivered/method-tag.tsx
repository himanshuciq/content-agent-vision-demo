"use client"

import { useState } from "react"
import { Info } from "lucide-react"

const EXPLAIN: Record<string, string> = {
  "vs category": "Compared with the category over the same weeks. We don't split event traffic, so every shopper sees your event content.",
  "A/B tested": "Half your shoppers saw the old content and half the new, at the same time.",
  "Leakage prevented": "Each fix is worth the SKU's normal daily sales times the days sooner it was fixed: 48 hours instead of about 2 weeks.",
}

/** The row's method in two words; hover or click for the one-sentence explanation. */
export function MethodTag({ method }: { method: string }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative shrink-0" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-px text-[11px] text-slate-500 hover:border-slate-300 hover:text-slate-700"
      >
        {method}
        <Info className="size-3" />
      </button>
      {open && (
        <span className="absolute top-full left-0 z-20 mt-1.5 block w-72 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed whitespace-normal text-slate-700 shadow-md">
          {EXPLAIN[method]}
        </span>
      )}
    </span>
  )
}
