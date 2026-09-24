"use client"

import { PublishConfetti } from "@/components/home/publish-confetti"
import { OPS_BATCHES } from "../data"
import { OPS_BANKED_Q3 } from "../delivered-content-data"
import { useNudge } from "../nudge-context"
import { SplitBar } from "../mike/split-bar"

function fmt(v: number) {
  return v >= 1 ? `$${+v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`
}
/** "$720K" → 0.72 ($M). */
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)
const BANKED = OPS_BANKED_Q3.delivered
const URGENT = OPS_BATCHES.find((b) => b.id === "buybox")!

interface Celebrate {
  value: number
  label: string
}

/**
 * Michelle's headline in Claire's words, for her slice: what's open, then what's
 * one approval from live and what's losing sales now. The bar is the quarter's
 * ops work: banked, then what she acts on, against what's open. Same as Mike's.
 */
export function OpsProgress({ celebrate }: { celebrate: Celebrate | null }) {
  const { approved } = useNudge()

  const approvalBatches = OPS_BATCHES.filter((b) => b.tier === "approval")
  const doneValue = approvalBatches.reduce((sum, b) => sum + (approved[b.id] ? b.approveValue : 0), 0)
  const actedValue = OPS_BATCHES.filter((b) => b.tier !== "autopilot" && approved[b.id]).reduce((sum, b) => sum + b.approveValue, 0)
  const left = approvalBatches.filter((b) => !approved[b.id]).reduce((sum, b) => sum + money(b.value), 0)
  const total = OPS_BATCHES.reduce((sum, b) => sum + money(b.value), 0)
  const open = total - actedValue

  return (
    <>
      <div className="px-10 pt-4 pb-7">
        <div className="text-2xl font-semibold tracking-tight text-slate-700">
          <span className="font-mono text-slate-950">{fmt(open)}</span> of ops opportunity is {actedValue > 0 ? "still " : ""}open this quarter.
        </div>
        <h1 className="mt-1 text-[40px] leading-tight font-bold tracking-tight text-slate-950">
          {left > 0.005 ? (
            <>
              <span className="font-mono">{fmt(left)}</span> {doneValue > 0 ? "still" : "is"} one approval from live.
              {!approved[URGENT.id] && (
                <>
                  {" "}
                  <span className="text-warning-600">
                    <span className="font-mono">{URGENT.value}</span> of it is losing the sale right now.
                  </span>
                </>
              )}
            </>
          ) : (
            "Everything one approval away is live."
          )}
        </h1>
      </div>
      <div className="relative border-y border-slate-200 bg-brand-25 px-10 py-4">
        <SplitBar
          banked={BANKED}
          unlocked={actedValue}
          open={open}
          aside={
            celebrate && (
              <div className="relative text-sm font-semibold text-success-700">
                +{fmt(celebrate.value)} · {celebrate.label}
                <div className="absolute -top-1 left-0 size-16">
                  <PublishConfetti />
                </div>
              </div>
            )
          }
        />
      </div>
    </>
  )
}
