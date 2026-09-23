"use client"

import { cn } from "@/lib/utils"
import { fmtValue } from "../../data"
import type { FunnelRow } from "../../delivered-content-data"

const GRID = "grid grid-cols-[minmax(0,1fr)_88px_150px] items-center gap-4"

function scrollToAutopilot() {
  document.getElementById("autopilot-compare")?.scrollIntoView({ behavior: "smooth", block: "center" })
}

/** Promised → what didn't go live → stockouts → expected → delivered, then the one number content owns. */
export function Funnel({ rows }: { rows: FunnelRow[] }) {
  const expected = rows.find((r) => r.tone === "sub")?.value ?? 0
  const delivered = rows.find((r) => r.tone === "total")?.value ?? 0
  const diff = delivered - expected

  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} className={cn(GRID, "py-2.5", i > 0 && "border-t border-slate-100")}>
          <div className="min-w-0">
            <div
              className={cn(
                "text-sm",
                r.tone === "total" && "font-semibold text-slate-950",
                r.tone === "sub" && "text-slate-500",
                r.tone === "base" && "font-medium text-slate-900",
                r.tone === "minus" && "text-slate-800",
              )}
            >
              {r.label}
            </div>
            {r.note && <div className="mt-0.5 text-[13px] leading-snug text-slate-500">{r.note}</div>}
          </div>
          <div
            className={cn(
              "text-right font-mono text-sm tabular-nums",
              r.tone === "total" ? "font-bold text-slate-950" : r.tone === "sub" ? "text-slate-500" : "font-semibold text-slate-900",
            )}
          >
            {r.tone === "minus" ? "−" : ""}
            {fmtValue(Math.abs(r.value))}
          </div>
          <div className="justify-self-end">
            {r.action === "autopilot" && (
              <button
                type="button"
                onClick={scrollToAutopilot}
                className="rounded-md border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-brand-700 hover:bg-brand-50"
              >
                Increase autopilot
              </button>
            )}
          </div>
        </div>
      ))}
      <div className={GRID}>
        <div className={cn("col-span-2 text-right text-[13px] font-medium", diff >= 0 ? "text-success-700" : "text-warning-700")}>
          {diff >= 0 ? "+" : "−"}
          {fmtValue(Math.abs(diff))} {diff >= 0 ? "more" : "less"} than expected
        </div>
        <div />
      </div>
    </div>
  )
}
