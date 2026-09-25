"use client"

import { BUSINESS, fmtBiz } from "../data"
import { PeriodSwitch } from "../period-switch"
import { useLive } from "../live-model"
import { SettingsGear } from "../settings-gear"
import { EmailPdfButton } from "./email-pdf-button"
import { TeamBell } from "./team-bell"
import type { Period } from "../types"

const PERIOD_WORDS: Record<Period, string> = { week: "this week", month: "this month", quarter: "this quarter", year: "this year" }

/**
 * The top of Claire's page, in her business terms: where she's landing against
 * plan, the gap, and the open opportunity that closes it. Then where it sits and
 * how fast it unlocks.
 */
/** `topLineOnly`: just the greeting, period and icons (above a Grow view, which has its own headline). */
export function BusinessHero({ topLineOnly = false }: { topLineOnly?: boolean } = {}) {
  const live = useLive()
  const { period } = live
  const b = { ...BUSINESS[period], pace: live.pace(period) }
  const gap = b.plan - b.pace

  return (
    <section className={topLineOnly ? "px-12 pt-9" : "px-12 pt-9 pb-7"}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
          <span className="mr-1 flex size-5 items-center justify-center rounded-md bg-brand-500" aria-label="Ally">
            <span className="size-1.5 rounded-full bg-brand-200" />
          </span>
          <span>Hi Claire</span>
          <span className="text-slate-300">·</span>
          <PeriodSwitch />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <EmailPdfButton period={period} />
          <TeamBell />
          <SettingsGear />
        </div>
      </div>

      {!topLineOnly && (<>
      {/* Fact, then the gap, then what closes it. The fact line is the same size as the first line on Mike's and Michelle's pages. */}
      <div className="mt-5 text-2xl font-semibold tracking-tight text-slate-700">
        You&apos;re tracking to <span className="font-mono text-slate-950">{fmtBiz(b.pace)}</span> in sales {PERIOD_WORDS[period]}.
      </div>

      <h1 className="mt-1 text-[44px] leading-tight font-bold tracking-tight text-slate-950">
        <span className="block">
          That&apos;s <span className="font-mono">{fmtBiz(gap)}</span> short of your <span className="font-mono">{fmtBiz(b.plan)}</span> plan.
        </span>
        <span className="block">
          We have <span className="font-mono text-brand-600">{live.open.totalLabel}</span> in the pipeline to close it.
        </span>
      </h1>

      <div className="mt-2 text-base text-slate-500">
        {live.open.byArea.map((a, i) => (
          <span key={a.agent}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            <span className="font-semibold text-slate-700">{a.value}</span> in {a.agent}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xl font-semibold">
        <span className="text-brand-600">
          {live.approval.effort} of your team&apos;s time unlocks {live.approval.value}
        </span>
        {live.deadline && (
          <>
            <span className="text-slate-300"> · </span>
            <span className="text-warning-600">
              {live.deadline.expiring} expires in {live.deadline.days} days
            </span>
          </>
        )}
      </div>
      </>)}
    </section>
  )
}
