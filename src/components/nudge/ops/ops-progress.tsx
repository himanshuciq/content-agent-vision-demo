"use client"

import { PublishConfetti } from "@/components/home/publish-confetti"
import { OPS_BATCHES } from "../data"
import { useNudge } from "../nudge-context"

const OPS_TOTAL = OPS_BATCHES.reduce((s, b) => s + b.approveValue, 0)

function fmt(v: number) {
  return v >= 1 ? `$${v.toFixed(2)}M` : `$${Math.round(v * 1000)}K`
}

interface Celebrate {
  value: number
  label: string
}

/** Store-walk value waiting on Michelle's sign-off, with a confetti burst per action. */
export function OpsProgress({ celebrate }: { celebrate: Celebrate | null }) {
  const { approved } = useNudge()

  const doneValue = OPS_BATCHES.reduce((sum, b) => sum + (approved[b.id] ? b.approveValue : 0), 0)
  const remaining = OPS_BATCHES.filter((b) => !approved[b.id])
  const left = Math.max(0, OPS_TOTAL - doneValue)
  const pct = Math.min(100, (doneValue / OPS_TOTAL) * 100)

  const headline = doneValue > 0 ? `${fmt(left)} in store-walk fixes still on you` : `${fmt(OPS_TOTAL)} in store-walk fixes waiting on you`
  const subhead = remaining.length === 0 ? "All caught up — every issue is actioned." : "Each one is a single sign-off Ally sends for you."
  const clearedLine = doneValue > 0 ? `${fmt(doneValue)} actioned` : "Not started"

  return (
    <>
      <div className="px-10 pt-8 pb-5">
        <div className="text-[30px] leading-tight font-semibold tracking-tight text-slate-950">{headline}</div>
        <div className="mt-1.5 text-lg text-slate-600">{subhead}</div>
      </div>
      <div className="relative border-y border-slate-200 bg-brand-25 px-10 py-4">
        <div className="flex items-baseline justify-between gap-6">
          <div className="text-sm font-semibold text-slate-950 tabular-nums">{clearedLine}</div>
          <div className="flex items-center gap-3.5">
            {celebrate && (
              <div className="relative text-sm font-semibold text-success-700">
                +{fmt(celebrate.value)} · {celebrate.label}
                <div className="absolute -top-1 left-0 size-16">
                  <PublishConfetti />
                </div>
              </div>
            )}
            <div className="text-sm text-slate-600 tabular-nums">{fmt(left)} left</div>
          </div>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-full bg-brand-500 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </>
  )
}
