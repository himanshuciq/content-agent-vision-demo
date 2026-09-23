import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { MethodTag } from "../claire/delivered/method-tag"
import type { ResultSection, SkuLiftRow } from "../content-results-data"

const signed = (v?: number) => (v === undefined ? "—" : `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`)
const money = (v?: number) => (v === undefined ? "—" : `${v >= 0 ? "" : "−"}${fmtValue(Math.abs(v))}`)

const TONE: Record<SkuLiftRow["tone"], string> = {
  won: "text-slate-800",
  lost: "text-slate-600",
  oos: "text-warning-700",
  "not-live": "text-slate-500",
}

function Num({ v, format }: { v?: number; format: (v?: number) => string }) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-right font-mono tabular-nums",
        v === undefined ? "text-slate-300" : v >= 0 ? "text-slate-900" : "text-warning-700",
      )}
    >
      {format(v)}
    </td>
  )
}

/** One type of work: its header line and the SKU rows, with every lift measured the way the tag says. */
export function ResultsTable({ section }: { section: ResultSection }) {
  const t = section.totals
  return (
    <section id={section.type} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-lg font-semibold text-slate-950">{section.name}</h2>
        <MethodTag method={section.method} />
        <span className="text-sm text-slate-500">
          {t.live.toLocaleString()} of {t.promisedSkus.toLocaleString()} SKUs live ·{" "}
          <span className="font-mono font-semibold text-slate-900">{fmtValue(t.incremental)}</span> of{" "}
          <span className="font-mono">{fmtValue(t.promised)}</span> projected
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
              <th className="w-[26%] px-4 py-2.5 font-medium">SKU</th>
              <th className="w-[22%] px-4 py-2.5 font-medium">What happened</th>
              <th className="px-4 py-2.5 text-right font-medium">Incremental sales</th>
              <th className="px-4 py-2.5 text-right font-medium">Sales lift</th>
              <th className="px-4 py-2.5 text-right font-medium">Units lift</th>
              <th className="px-4 py-2.5 text-right font-medium">Traffic lift</th>
              <th className="px-4 py-2.5 text-right font-medium">Conversion lift</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((r) => (
              <tr key={r.asin} className="border-t border-slate-100 first:border-t-0">
                <td className="px-4 py-3">
                  <div className="truncate text-slate-900">{r.name}</div>
                  <div className="font-mono text-[11px] text-slate-400">{r.asin}</div>
                </td>
                <td className={cn("px-4 py-3", TONE[r.tone])}>{r.happened}</td>
                <Num v={r.incremental} format={money} />
                <Num v={r.sales} format={signed} />
                <Num v={r.units} format={signed} />
                <Num v={r.traffic} format={signed} />
                <Num v={r.conversion} format={signed} />
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-100 bg-slate-25 px-4 py-2.5 text-xs text-slate-500">
          Showing {section.rows.length} of {t.promisedSkus.toLocaleString()}
        </div>
      </div>
    </section>
  )
}
