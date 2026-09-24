"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { MethodTag } from "./delivered/method-tag"
import type { ContentDelivered } from "../delivered-content-data"

const HEIGHT = 190
const LABEL_HEIGHT = 44
const PAD_TOP = 28
const DOT = { orange: "bg-warning-500", red: "bg-error-500", green: "bg-success-500" }
/** Waterfall order: everyday content first, then the event, then unblocking. */
const ORDER = ["foundational", "seasonal", "retail-readiness"]

/**
 * Content, opened: delivered by type stacked into the total, against the
 * projected line. Selecting a bar shows its 2–3 bullets; the total shows the
 * content-level bullets. Anything deeper is the results link.
 */
export function ContentWaterfall({ data, resultsHref }: { data: ContentDelivered; resultsHref: string }) {
  const [selected, setSelected] = useState("total")
  const types = ORDER.map((id) => data.workTypes.find((w) => w.id === id)!).filter(Boolean)
  const max = data.promised
  const pct = (v: number) => (v / max) * 100

  let acc = 0
  const cols = [
    ...types.map((w) => {
      const col = { key: w.id, label: w.name, sub: `of ${fmtValue(w.promised)} projected`, value: `+${fmtValue(w.delivered)}`, start: acc, end: acc + w.delivered }
      acc += w.delivered
      return col
    }),
    { key: "total", label: "Content", sub: `of ${fmtValue(data.promised)} projected`, value: fmtValue(data.delivered), start: 0, end: data.delivered },
  ]
  const BAR: Record<string, string> = { foundational: "bg-brand-500", seasonal: "bg-brand-500", "retail-readiness": "bg-brand-500", total: "bg-brand-700" }

  const sel = types.find((t) => t.id === selected)
  const bullets = sel ? sel.bullets : data.bullets
  const projectedTop = PAD_TOP

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex items-end gap-3">
        <div className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-slate-400" style={{ top: projectedTop }}>
          <span className="absolute -top-5 right-0 bg-white px-1 font-mono text-[11px] font-semibold text-slate-500">
            Projected {fmtValue(data.promised)}
          </span>
        </div>
        {cols.map((c, i) => {
          const isSel = c.key === selected
          const next = cols[i + 1]
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelected(c.key)}
              className={cn(
                "group relative flex flex-1 flex-col items-center rounded-xl px-1 pb-2 transition-colors",
                isSel ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50",
              )}
              style={{ paddingTop: PAD_TOP }}
            >
              <div className="relative w-full" style={{ height: HEIGHT }}>
                {next && next.key !== "total" && (
                  <div className="absolute right-0 left-1/2 border-t border-dashed border-slate-300" style={{ top: `${100 - pct(c.end)}%` }} />
                )}
                <div className="absolute inset-x-4 rounded-t-md" style={{ top: `${100 - pct(c.end)}%`, height: `${pct(c.end - c.start)}%` }}>
                  <div className={cn("size-full rounded-t-md", BAR[c.key], !isSel && "opacity-60 group-hover:opacity-90")} />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-xs font-bold whitespace-nowrap text-slate-950 tabular-nums">
                    {c.value}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex flex-col items-center gap-0.5 text-center" style={{ height: LABEL_HEIGHT }}>
                <span className={cn("text-[13px] leading-tight", isSel ? "font-semibold text-brand-700" : "text-slate-600")}>{c.label}</span>
                <span className="text-[11px] text-slate-400">{c.sub}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
          {sel ? sel.name : "Content"}
          {sel && <MethodTag method={sel.method} />}
        </div>
        <ul className="flex flex-col gap-2">
          {bullets?.map((b) => (
            <li key={b.text} className="flex items-start gap-2.5 text-sm text-slate-800">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[b.tone])} />
              {b.text}
            </li>
          ))}
        </ul>
      </div>

      <Link href={resultsHref} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
        See SKU-level results and method
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
