import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { MethodTag } from "../claire/delivered/method-tag"
import type { ResultSection, SkuLiftRow } from "../content-results-data"

const pct = (v?: number) => (v === undefined ? "—" : `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`)
const pts = (v?: number) => (v === undefined ? "—" : `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)} pts`)
const money = (v?: number) => (v === undefined ? "—" : `${v >= 0 ? "+" : "−"}${fmtValue(Math.abs(v))}`)

/** Status as a small mark plus text, not a filled pill. */
const MARK: Record<SkuLiftRow["tone"], string> = {
  won: "bg-success-500",
  lost: "bg-slate-400",
  oos: "bg-warning-500",
  "not-live": "border border-slate-300 bg-white",
}

const CAPTION: Record<ResultSection["method"], string> = {
  "vs category":
    "Impressions compared with the category's over the same weeks, event weeks vs the 4 weeks before. Incremental sales are after adjusting for price, ad spend and stockouts.",
  "A/B tested": "New content vs old on a 50/50 traffic split. Both halves see the same price, ads and stock, so nothing needs adjusting.",
}

const TH = "px-4 py-2.5 align-bottom font-medium"
const TD_NUM = "px-4 py-3 text-right font-mono tabular-nums text-slate-950"
/** Only the verdict column is colored: green when content won, red when it lost. */
const verdict = (v?: number) => (v === undefined ? "text-slate-300" : v >= 0 ? "text-success-700" : "text-error-600")

function Result({ r }: { r: SkuLiftRow }) {
  return (
    <td className="px-4 py-3">
      <span className={cn("flex items-center gap-2", r.tone === "oos" ? "text-warning-700" : r.tone === "not-live" ? "text-slate-500" : "text-slate-700")}>
        <span className={cn("size-2 shrink-0 rounded-full", MARK[r.tone])} />
        {r.happened}
      </span>
    </td>
  )
}

/** The factors normalized out, shown only when they moved. Material ones (a stockout, a 3%+ price change) in amber. */
function Adjusted({ r }: { r: SkuLiftRow }) {
  if (r.skuImpr === undefined) return <td className="px-4 py-3 text-slate-300">—</td>
  const items = [
    r.price ? { text: `Price ${r.price > 0 ? "+" : "−"}${Math.abs(r.price)}%`, strong: Math.abs(r.price) >= 3 } : null,
    r.ads ? { text: `Ads ${r.ads > 0 ? "+" : "−"}${Math.abs(r.ads)}%`, strong: false } : null,
    r.oosDays ? { text: `Out of stock ${r.oosDays} days`, strong: true } : null,
  ].filter(Boolean) as { text: string; strong: boolean }[]
  return (
    <td className="px-4 py-3 text-sm">
      {items.length === 0 ? (
        <span className="text-slate-400">Nothing to adjust</span>
      ) : (
        items.map((it, i) => (
          <span key={it.text} className={it.strong ? "text-warning-700" : "text-slate-500"}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            {it.text}
          </span>
        ))
      )}
    </td>
  )
}

/** One type of work: its claim, how it's measured, then every SKU with the evidence its method produces. */
export function ResultsTable({ section }: { section: ResultSection }) {
  const t = section.totals
  const byCategory = section.method === "vs category"

  return (
    <section id={section.type} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-lg font-semibold text-slate-950">{section.name}</h2>
          <MethodTag method={section.method} />
          <span className="text-sm text-slate-500">
            {t.live.toLocaleString()} of {t.promisedSkus.toLocaleString()} SKUs live ·{" "}
            <span className="font-mono font-semibold text-slate-950">{fmtValue(t.incremental)}</span> of <span className="font-mono">{fmtValue(t.promised)}</span>{" "}
            projected
          </span>
        </div>
        <p className="text-sm text-slate-500">{CAPTION[section.method]}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
              <th className={cn(TH, "w-[22%]")}>SKU</th>
              <th className={cn(TH, "w-[20%]")}>Result</th>
              {byCategory ? (
                <>
                  <th className={cn(TH, "text-right")}>SKU impressions</th>
                  <th className={cn(TH, "text-right")}>Category impressions</th>
                  <th className={cn(TH, "text-right")}>Lead</th>
                  <th className={cn(TH, "w-[17%]")}>Adjusted for</th>
                </>
              ) : (
                <>
                  <th className={cn(TH, "text-right")}>Lift vs old content</th>
                  <th className={cn(TH, "text-right")}>Confidence</th>
                  <th className={cn(TH, "text-right")}>Test length</th>
                </>
              )}
              <th className={cn(TH, "text-right")}>Incremental sales</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((r) => {
              const lead = r.skuImpr !== undefined && r.catImpr !== undefined ? r.skuImpr - r.catImpr : undefined
              return (
                <tr key={r.asin} className="border-t border-slate-100 first:border-t-0">
                  <td className="px-4 py-3">
                    <div className="truncate text-slate-950">{r.name}</div>
                    <div className="font-mono text-[11px] text-slate-400">{r.asin}</div>
                  </td>
                  <Result r={r} />
                  {byCategory ? (
                    <>
                      <td className={TD_NUM}>{pct(r.skuImpr)}</td>
                      <td className={cn(TD_NUM, "text-slate-500")}>{pct(r.catImpr)}</td>
                      <td className={cn(TD_NUM, "font-semibold", verdict(lead))}>{pts(lead)}</td>
                      <Adjusted r={r} />
                    </>
                  ) : (
                    <>
                      <td className={cn(TD_NUM, "font-semibold", verdict(r.lift))}>{pct(r.lift)}</td>
                      <td className={cn(TD_NUM, r.confidence === undefined && "text-slate-300")}>{r.confidence === undefined ? "—" : `${r.confidence}%`}</td>
                      <td className={cn(TD_NUM, "text-slate-500", r.days === undefined && "text-slate-300")}>{r.days === undefined ? "—" : `${r.days} days`}</td>
                    </>
                  )}
                  <td className={cn(TD_NUM, "font-semibold", r.incremental === undefined && "text-slate-300")}>{money(r.incremental)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="border-t border-slate-100 bg-slate-25 px-4 py-2.5 text-xs text-slate-500">
          Showing {section.rows.length} of {t.promisedSkus.toLocaleString()}
        </div>
      </div>
    </section>
  )
}
