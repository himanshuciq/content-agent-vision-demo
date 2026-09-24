import { fmtValue } from "../data"
import type { ResultSection, ResultTotals } from "../content-results-data"

const pct = (v = 0) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`
const pts = (v = 0) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)} pts`

type Cell = { label: string; value: string; sub: string }

/**
 * Four numbers for the current view, dollars first, then the evidence its
 * method produces: impressions against the category for seasonal, test results
 * for A/B tested work, and one of each when looking at all types.
 */
export function ResultsMetrics({ totals, sections, current }: { totals: ResultTotals; sections: ResultSection[]; current: ResultSection | null }) {
  const dollars: Cell = { label: "Incremental sales", value: fmtValue(totals.incremental), sub: `of ${fmtValue(totals.promised)} projected` }
  const seasonal = sections.find((s) => s.method === "vs category")?.totals
  const ab = sections.filter((s) => s.method === "A/B tested").map((s) => s.totals)
  const won = ab.reduce((n, t) => n + (t.won ?? 0), 0)
  const tested = ab.reduce((n, t) => n + (t.tested ?? 0), 0)

  let cells: Cell[]
  if (current?.method === "vs category") {
    const t = current.totals
    cells = [
      dollars,
      { label: "Your impressions", value: pct(t.skuImpr), sub: "event weeks vs the 4 weeks before" },
      { label: "Category impressions", value: pct(t.catImpr), sub: "same weeks, the benchmark" },
      { label: "Lead over category", value: pts((t.skuImpr ?? 0) - (t.catImpr ?? 0)), sub: "after price, ad spend and stockouts" },
    ]
  } else if (current) {
    const t = current.totals
    cells = [
      dollars,
      { label: "Lift vs old content", value: pct(t.sales), sub: "50/50 traffic split" },
      { label: "Tests won", value: `${t.won} of ${t.tested}`, sub: "the rest went back to old content" },
      { label: "Average confidence", value: `${t.confidence}%`, sub: "across tests that finished" },
    ]
  } else {
    cells = [
      dollars,
      { label: "Sales lift", value: pct(totals.sales), sub: "each type vs its own comparison" },
      { label: "Seasonal lead over category", value: pts((seasonal?.skuImpr ?? 0) - (seasonal?.catImpr ?? 0)), sub: "impressions, after adjustments" },
      { label: "A/B tests won", value: `${won} of ${tested}`, sub: "foundational and retail readiness" },
    ]
  }

  return (
    <div className="grid grid-cols-4 divide-x divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {cells.map((c, i) => (
        <div key={c.label} className="px-5 py-4">
          <div className="text-xs font-medium text-slate-500">{c.label}</div>
          <div className={`mt-1 font-mono font-bold tracking-tight text-slate-950 tabular-nums ${i === 0 ? "text-[26px]" : "text-[22px]"}`}>{c.value}</div>
          <div className="mt-0.5 text-xs text-slate-500">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}
