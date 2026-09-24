"use client"

import { PublishConfetti } from "@/components/home/publish-confetti"
import { BATCHES, DEADLINE } from "../data"
import { CONTENT_BANKED_Q3 } from "../delivered-content-data"
import { useNudge } from "../nudge-context"

function fmt(v: number) {
  return v >= 1 ? `$${+v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`
}
/** "$500K" → 0.5 ($M). */
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)

const BANKED = CONTENT_BANKED_Q3.delivered

interface Celebrate {
  value: number
  skus: number
}

/**
 * Mike's headline in Claire's words, for his slice: what's open, then what's
 * one approval from live. The bar is the quarter's content: banked, then what
 * he approves, against what's open.
 */
export function MikeProgress({ celebrate }: { celebrate: Celebrate | null }) {
  const { approved } = useNudge()

  const approvalBatches = BATCHES.filter((b) => b.tier === "approval")
  const doneValue = approvalBatches.reduce((sum, b) => sum + (approved[b.id] ? b.approveValue : 0), 0)
  // Every action moves the bar: approving a batch, or giving Ally the input it asked for.
  const actedValue = BATCHES.filter((b) => b.tier !== "autopilot" && approved[b.id]).reduce((sum, b) => sum + b.approveValue, 0)
  const left = approvalBatches.filter((b) => !approved[b.id]).reduce((sum, b) => sum + money(b.value), 0)
  // The bar is the quarter's content: banked so far, what Mike just approved, and what's still open.
  const total = BATCHES.reduce((sum, b) => sum + money(b.value), 0)
  const open = total - actedValue
  const whole = BANKED + total

  return (
    <>
      <div className="px-10 pt-4 pb-7">
        <div className="text-2xl font-semibold tracking-tight text-slate-700">
          <span className="font-mono text-slate-950">{fmt(open)}</span> of content opportunity is {actedValue > 0 ? "still " : ""}open this quarter.
        </div>
        <h1 className="mt-1 text-[40px] leading-tight font-bold tracking-tight text-slate-950">
          {left > 0.005 ? (
            <>
              <span className="font-mono">{fmt(left)}</span> {doneValue > 0 ? "still" : "is"} one approval from live.{" "}
              <span className="text-warning-600">All of it expires in {DEADLINE.days} days.</span>
            </>
          ) : (
            "Everything one approval away is live."
          )}
        </h1>
      </div>
      <div className="relative border-y border-slate-200 bg-brand-25 px-10 py-4">
        <div className="flex items-baseline justify-between gap-6">
          <div className="text-sm text-slate-500 tabular-nums">
            <span className="font-semibold text-slate-950">{fmt(BANKED)} banked</span>
            {actedValue > 0 && (
              <>
                <span className="text-slate-300"> · </span>
                <span className="font-semibold text-brand-700">{fmt(actedValue)} unlocked</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3.5">
            {celebrate && (
              <div className="relative text-sm font-semibold text-success-700">
                +{fmt(celebrate.value)} · {celebrate.skus} SKUs live
                <div className="absolute -top-1 left-0 size-16">
                  <PublishConfetti />
                </div>
              </div>
            )}
            <div className="text-sm text-slate-500 tabular-nums">{fmt(open)} open</div>
          </div>
        </div>
        <div className="mt-2.5 flex h-2 gap-0.5 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-l-full bg-brand-600" style={{ width: `${(BANKED / whole) * 100}%` }} />
          <div className="h-full bg-brand-400 transition-[width] duration-500 ease-out" style={{ width: `${(actedValue / whole) * 100}%` }} />
        </div>
      </div>
    </>
  )
}
