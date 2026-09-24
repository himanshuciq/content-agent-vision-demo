"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { MethodTag } from "./delivered/method-tag"
import type { ContentDelivered, WorkType } from "../delivered-content-data"

const HEIGHT = 190
const LABEL_HEIGHT = 44
const PAD_TOP = 28
const DOT = { orange: "bg-warning-500", red: "bg-error-500", green: "bg-success-500" }
/** Waterfall order: everyday content first, then the event, then unblocking. */
const ORDER = ["foundational", "seasonal", "retail-readiness"]
const BAR: Record<string, string> = { foundational: "bg-brand-500", seasonal: "bg-brand-500", "retail-readiness": "bg-brand-500", total: "bg-brand-700" }

/** Temporary: lets us feel the three interactions in the product before picking one. */
type Mode = "hover" | "click" | "panel"
const MODES: { id: Mode; label: string }[] = [
  { id: "hover", label: "Hover" },
  { id: "click", label: "Click" },
  { id: "panel", label: "Panel" },
]

type Bullets = NonNullable<WorkType["bullets"]>

function BulletCard({ title, method, bullets, className }: { title: string; method?: string; bullets?: Bullets; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white px-4 py-3.5", className)}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        {title}
        {method && <MethodTag method={method} />}
      </div>
      <ul className="flex flex-col gap-2">
        {bullets?.map((b) => (
          <li key={b.text} className="flex items-start gap-2.5 text-left text-sm font-normal text-slate-800">
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[b.tone])} />
            {b.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Content, opened: delivered by type stacked into the total, against the
 * projected line. Each bar's 2–3 bullets show on hover, on click as a
 * popover, or in a panel below, depending on the mode being tried.
 */
export function ContentWaterfall({ data, resultsHref }: { data: ContentDelivered; resultsHref: string }) {
  const [mode, setMode] = useState<Mode>("hover")
  const [selected, setSelected] = useState("total")
  const [active, setActive] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== "click" || !active) return
    const close = (e: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(e.target as Node)) setActive(null)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [mode, active])

  const types = ORDER.map((id) => data.workTypes.find((w) => w.id === id)!).filter(Boolean)
  const pct = (v: number) => (v / data.promised) * 100
  let acc = 0
  const cols = [
    ...types.map((w) => {
      const col = { key: w.id, label: w.name, method: w.method as string | undefined, bullets: w.bullets, sub: `of ${fmtValue(w.promised)} projected`, value: `+${fmtValue(w.delivered)}`, start: acc, end: acc + w.delivered }
      acc += w.delivered
      return col
    }),
    { key: "total", label: "Content", method: undefined, bullets: data.bullets, sub: `of ${fmtValue(data.promised)} projected`, value: fmtValue(data.delivered), start: 0, end: data.delivered },
  ]
  const panel = cols.find((c) => c.key === selected)!

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400">
        Try
        <div className="flex rounded-md border border-slate-200 bg-white p-0.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id)
                setActive(null)
              }}
              className={cn("rounded px-2 py-0.5 font-medium", mode === m.id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800")}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartRef} className="relative flex items-end gap-3">
        <div className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-slate-400" style={{ top: PAD_TOP }}>
          <span className="absolute -top-5 right-0 bg-slate-25 px-1 font-mono text-[11px] font-semibold text-slate-500">Projected {fmtValue(data.promised)}</span>
        </div>
        {cols.map((c, i) => {
          const highlighted = mode === "panel" ? c.key === selected : c.key === active
          const next = cols[i + 1]
          const align = i === 0 ? "left-0" : i === cols.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
          // Hover opens beside the bar (toward the middle of the chart) so it never covers the table above.
          const side = i < cols.length / 2 ? "left-full ml-2" : "right-full mr-2"
          return (
            <div
              key={c.key}
              className="relative flex-1"
              onMouseEnter={() => mode === "hover" && setActive(c.key)}
              onMouseLeave={() => mode === "hover" && setActive(null)}
            >
              <button
                type="button"
                onClick={() => (mode === "panel" ? setSelected(c.key) : mode === "click" && setActive(active === c.key ? null : c.key))}
                className={cn(
                  "group flex w-full flex-col items-center rounded-xl px-1 pb-2 transition-colors",
                  highlighted ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50",
                )}
                style={{ paddingTop: PAD_TOP }}
              >
                <div className="relative w-full" style={{ height: HEIGHT }}>
                  {next && next.key !== "total" && (
                    <div className="absolute right-0 left-1/2 border-t border-dashed border-slate-300" style={{ top: `${100 - pct(c.end)}%` }} />
                  )}
                  <div className="absolute inset-x-4 rounded-t-md" style={{ top: `${100 - pct(c.end)}%`, height: `${pct(c.end - c.start)}%` }}>
                    <div className={cn("size-full rounded-t-md", BAR[c.key], !highlighted && "opacity-60 group-hover:opacity-90")} />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-xs font-bold whitespace-nowrap text-slate-950 tabular-nums">{c.value}</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-col items-center gap-0.5 text-center" style={{ height: LABEL_HEIGHT }}>
                  <span className={cn("text-[13px] leading-tight", highlighted ? "font-semibold text-brand-700" : "text-slate-600")}>{c.label}</span>
                  <span className="text-[11px] text-slate-400">{c.sub}</span>
                </div>
              </button>

              {mode !== "panel" && active === c.key && (
                <BulletCard
                  title={c.label}
                  method={c.method}
                  bullets={c.bullets}
                  className={cn("absolute z-30 w-80 shadow-lg", mode === "hover" ? cn(side, "top-6") : cn(align, "top-full mt-2"))}
                />
              )}
            </div>
          )
        })}
      </div>

      {mode === "panel" && <BulletCard title={panel.label} method={panel.method} bullets={panel.bullets} />}

      <Link href={resultsHref} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
        See SKU-level results and method
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
