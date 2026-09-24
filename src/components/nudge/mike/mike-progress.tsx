"use client"

import { PublishConfetti } from "@/components/home/publish-confetti"
import { AUTOPILOT_TIER, BATCHES, DEADLINE, OPEN_BY_AREA, TOTAL_WAITING_APPROVAL } from "../data"
import { useNudge } from "../nudge-context"

function fmt(v: number) {
  return v >= 1 ? `$${v.toFixed(2)}M` : `$${Math.round(v * 1000)}K`
}
/** "$500K" → 0.5 ($M). */
const money = (s: string) => parseFloat(s.replace(/[$KM,]/g, "")) / (s.endsWith("K") ? 1000 : 1)

const CONTENT_OPEN = OPEN_BY_AREA.find((a) => a.agent === "content")!.value
const tierTotal = (tier: "approval" | "input") => fmt(BATCHES.filter((b) => b.tier === tier).reduce((sum, b) => sum + money(b.value), 0))
const TIERS = [
  { label: "one approval away", value: tierTotal("approval") },
  { label: "needs your input", value: tierTotal("input") },
  { label: "on autopilot", value: fmt(money(AUTOPILOT_TIER.rows.find((r) => r.agent === "content")!.value)) },
]

interface Celebrate {
  value: number
  skus: number
}

/**
 * Mike's headline in Claire's words, for his slice: what's one approval from
 * live and what of it expires. The bar fills as he approves.
 */
export function MikeProgress({ celebrate }: { celebrate: Celebrate | null }) {
  const { approved } = useNudge()

  const approvalBatches = BATCHES.filter((b) => b.tier === "approval")
  const doneValue = approvalBatches.reduce((sum, b) => sum + (approved[b.id] ? b.approveValue : 0), 0)
  // What's left is the pending batches' value; approving ships a batch's reviewed SKUs (e.g. 378 of 384), so don't subtract.
  const left = approvalBatches.filter((b) => !approved[b.id]).reduce((sum, b) => sum + money(b.value), 0)
  const pct = Math.min(100, ((TOTAL_WAITING_APPROVAL - left) / TOTAL_WAITING_APPROVAL) * 100)

  return (
    <>
      <div className="px-10 pt-4 pb-7">
        <h1 className="text-[40px] leading-tight font-bold tracking-tight text-slate-950">
          {left > 0.005 ? (
            <>
              <span className="font-mono">{fmt(left)}</span> {doneValue > 0 ? "still" : "is"} one approval from live.{" "}
              <span className="text-warning-600">All of it expires in {DEADLINE.days} days.</span>
            </>
          ) : (
            "Everything one approval away is live."
          )}
        </h1>
        <div className="mt-2 text-base text-slate-500">
          <span className="font-semibold text-slate-700">{CONTENT_OPEN}</span> open in content
          {TIERS.map((t) => (
            <span key={t.label}>
              <span className="text-slate-300"> · </span>
              <span className="font-semibold text-slate-700">{t.value}</span> {t.label}
            </span>
          ))}
        </div>
      </div>
      <div className="relative border-y border-slate-200 bg-brand-25 px-10 py-4">
        <div className="flex items-baseline justify-between gap-6">
          <div className="text-sm font-semibold text-slate-950 tabular-nums">{doneValue > 0 ? `${fmt(doneValue)} approved` : "Not started"}</div>
          <div className="flex items-center gap-3.5">
            {celebrate && (
              <div className="relative text-sm font-semibold text-success-700">
                +{fmt(celebrate.value)} · {celebrate.skus} SKUs live
                <div className="absolute -top-1 left-0 size-16">
                  <PublishConfetti />
                </div>
              </div>
            )}
            <div className="text-sm text-slate-600 tabular-nums">{left > 0.005 ? `${fmt(left)} left` : "Nothing left"}</div>
          </div>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-full bg-brand-500 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </>
  )
}
