"use client"

import { PublishConfetti } from "@/components/home/publish-confetti"
import { BATCHES, TOTAL_WAITING_APPROVAL } from "../data"
import { useNudge } from "../nudge-context"

function fmt(v: number) {
  return v >= 1 ? `$${v.toFixed(2)}M` : `$${Math.round(v * 1000)}K`
}

interface Celebrate {
  value: number
  skus: number
}

/** Headline + progress bar. Approving a batch nudges both, plus a confetti burst. */
export function MikeProgress({ celebrate }: { celebrate: Celebrate | null }) {
  const { approved } = useNudge()

  const doneValue = BATCHES.reduce((sum, b) => sum + (approved[b.id] ? b.approveValue : 0), 0)
  const remaining = BATCHES.filter((b) => !approved[b.id])
  const left = Math.max(0, TOTAL_WAITING_APPROVAL - doneValue)
  const pct = Math.min(100, (doneValue / TOTAL_WAITING_APPROVAL) * 100)

  const headline =
    doneValue > 0 ? `${fmt(left)} still waiting for your approval` : `${fmt(TOTAL_WAITING_APPROVAL)} is waiting for your approval`
  const subhead =
    remaining.length === 0 ? "All caught up — every batch is published." : "Most of it is one bulk approve away."
  const approvedLine = doneValue > 0 ? `${fmt(doneValue)} approved` : "Not started"

  return (
    <>
      <div className="px-10 pt-8 pb-5">
        <div className="text-[30px] leading-tight font-semibold tracking-tight text-slate-950">{headline}</div>
        <div className="mt-1.5 text-lg text-slate-600">{subhead}</div>
      </div>
      <div className="relative border-y border-slate-200 bg-brand-25 px-10 py-4">
        <div className="flex items-baseline justify-between gap-6">
          <div className="text-sm font-semibold text-slate-950 tabular-nums">{approvedLine}</div>
          <div className="flex items-center gap-3.5">
            {celebrate && (
              <div className="relative text-sm font-semibold text-success-700">
                +{fmt(celebrate.value)} · {celebrate.skus} SKUs live
                <div className="absolute -top-1 left-0 size-16">
                  <PublishConfetti />
                </div>
              </div>
            )}
            <div className="text-sm text-slate-600 tabular-nums">{fmt(left)} left</div>
          </div>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </>
  )
}
