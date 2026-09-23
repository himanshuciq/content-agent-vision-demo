import { fmtValue } from "../data"
import type { ResultTotals } from "../content-results-data"

const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`

/** The five numbers for the current view, in one quiet strip: dollars first, then the lifts that explain them. */
export function ResultsMetrics({ totals, comparedWith }: { totals: ResultTotals; comparedWith: string }) {
  const cells = [
    { label: "Incremental sales", value: fmtValue(totals.incremental), sub: `of ${fmtValue(totals.promised)} projected` },
    { label: "Sales lift", value: signed(totals.sales), sub: comparedWith },
    { label: "Units lift", value: signed(totals.units), sub: comparedWith },
    { label: "Traffic lift", value: signed(totals.traffic), sub: "page views" },
    { label: "Conversion lift", value: signed(totals.conversion), sub: "orders per page view" },
  ]

  return (
    <div className="grid grid-cols-5 divide-x divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {cells.map((c, i) => (
        <div key={c.label} className="px-5 py-4">
          <div className="text-xs font-medium text-slate-500">{c.label}</div>
          <div className={`mt-1 font-mono font-bold tracking-tight text-slate-950 tabular-nums ${i === 0 ? "text-[26px]" : "text-[22px]"}`}>
            {c.value}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}
