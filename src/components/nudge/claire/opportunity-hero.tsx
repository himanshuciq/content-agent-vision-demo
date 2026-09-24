import { APPROVAL_TIER, DEADLINE, OPEN_BY_AREA, OPEN_TOTAL } from "../data"
import type { Period } from "../types"

/** The lead statement: greeting into the open-opportunity number, then the effort→value hook with urgency. */
export function OpportunityHero({ period }: { period: Period }) {
  return (
    <section className="px-12 pt-6 pb-7">
      <div className="text-sm font-medium text-slate-500">Hi Claire</div>
      <h1 className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-6xl font-bold tracking-tight text-slate-950 tabular-nums">{OPEN_TOTAL}</span>
        <span className="text-3xl font-semibold tracking-tight text-slate-950">
          incremental sales opportunity open this {period}
        </span>
      </h1>
      <div className="mt-2 text-base text-slate-500">
        {OPEN_BY_AREA.map((a, i) => (
          <span key={a.agent}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            <span className="font-semibold text-slate-700">{a.value}</span> in {a.agent}
          </span>
        ))}
      </div>
      <div className="mt-3 text-2xl font-semibold">
        <span className="text-brand-600">
          {APPROVAL_TIER.effort} of your team&apos;s time unlocks {APPROVAL_TIER.value}
        </span>
        <span className="text-slate-300"> · </span>
        <span className="text-warning-600">{DEADLINE.expiring} expires in {DEADLINE.days} days</span>
      </div>
    </section>
  )
}
