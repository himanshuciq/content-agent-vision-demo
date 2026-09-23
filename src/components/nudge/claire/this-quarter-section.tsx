"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { BANKED_OTHER, INFLIGHT, fmtValue } from "../data"
import { CONTENT_BANKED_Q3 } from "../delivered-content-data"
import { AGENT_LABEL } from "../types"

interface Pair {
  key: string
  label: string
  projected: number
  delivered: number
}

const DOT = { orange: "bg-warning-500", red: "bg-error-500", green: "bg-success-500" }

function Delta({ v }: { v: number }) {
  return (
    <span className={cn("font-mono text-xs font-semibold tabular-nums", v >= 0 ? "text-success-700" : "text-warning-700")}>
      {v >= 0 ? "+" : "−"}
      {fmtValue(Math.abs(v))}
    </span>
  )
}

/** Projected vs delivered as paired vertical bars; a selectable group opens the next level. */
function PairedBars({ items, height, selectable, selected, onSelect }: { items: Pair[]; height: number; selectable?: string; selected?: boolean; onSelect?: () => void }) {
  const max = Math.max(...items.flatMap((i) => [i.projected, i.delivered]))
  return (
    <div className="flex items-end justify-around gap-6">
      {items.map((i) => {
        const canSelect = i.key === selectable
        const Tag = canSelect ? "button" : "div"
        return (
          <Tag
            key={i.key}
            {...(canSelect ? { type: "button" as const, onClick: onSelect } : {})}
            className={cn(
              "flex w-44 flex-col items-center gap-2 rounded-xl px-3 pt-3 pb-2.5",
              canSelect && "group cursor-pointer hover:bg-slate-50",
              canSelect && selected && "bg-brand-50 ring-1 ring-brand-200 hover:bg-brand-50",
            )}
          >
            <div className="flex items-end gap-1.5" style={{ height }}>
              {[
                { v: i.projected, cls: "bg-slate-200", text: "text-slate-500" },
                { v: i.delivered, cls: "bg-brand-500", text: "text-slate-950" },
              ].map((b, n) => (
                <div key={n} className="flex w-9 flex-col items-center justify-end gap-1" style={{ height }}>
                  <span className={cn("font-mono text-[11px] font-semibold tabular-nums", b.text)}>{fmtValue(b.v)}</span>
                  <div className={cn("w-full rounded-t", b.cls)} style={{ height: `${(b.v / max) * (height - 18)}px` }} />
                </div>
              ))}
            </div>
            <span className={cn("text-sm", canSelect && selected ? "font-semibold text-brand-700" : "font-medium text-slate-900")}>{i.label}</span>
            <Delta v={i.delivered - i.projected} />
            {canSelect && <span className="text-[11px] text-brand-600">{selected ? "Viewing ▾" : "Open"}</span>}
          </Tag>
        )
      })}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex gap-4 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-slate-200" />
        Projected
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-brand-500" />
        Delivered
      </span>
    </div>
  )
}

/**
 * The proof, kept below the actions: what this quarter has delivered so far
 * against projection, by area, then content by type with its reasons as dot
 * bullets. Anything deeper is one link away on the results page.
 */
export function ThisQuarterSection() {
  const [open, setOpen] = useState(false)
  const c = CONTENT_BANKED_Q3
  const areas: Pair[] = [
    { key: "content", label: "Content", projected: c.promised, delivered: c.delivered },
    ...BANKED_OTHER.map((b) => ({ key: b.agent, label: AGENT_LABEL[b.agent], projected: b.promised, delivered: b.delivered })),
  ]
  const projected = areas.reduce((s, a) => s + a.projected, 0)
  const delivered = areas.reduce((s, a) => s + a.delivered, 0)
  const types: Pair[] = c.workTypes.map((w) => ({ key: w.id, label: w.name, projected: w.promised, delivered: w.delivered }))

  return (
    <section className="px-12 pt-10 pb-4">
      <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">This quarter so far · {INFLIGHT.quarter.name}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight text-slate-500">
          Projected <span className="font-mono">{fmtValue(projected)}</span>
        </span>
        <span className="text-2xl font-semibold tracking-tight text-slate-950">
          Delivered <span className="font-mono text-brand-600">{fmtValue(delivered)}</span>
        </span>
        <Delta v={delivered - projected} />
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-6 pt-4 pb-4">
        <PairedBars items={areas} height={150} selectable="content" selected={open} onSelect={() => setOpen((o) => !o)} />
        <Legend />
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-6 py-5">
          <div className="text-base font-semibold text-slate-950">
            Content · <span className="font-mono">{fmtValue(c.delivered)}</span>{" "}
            <span className="font-normal text-slate-500">of {fmtValue(c.promised)} projected</span>
          </div>
          <PairedBars items={types} height={110} />
          {c.bullets && (
            <ul className="flex flex-col gap-2">
              {c.bullets.map((b) => (
                <li key={b.text} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[b.tone])} />
                  {b.text}
                </li>
              ))}
            </ul>
          )}
          <Link href="/content-results?period=qtd" className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
            See SKU-level results and method
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </section>
  )
}
