import { formatCompactUsd } from "./format"

interface AttributionStatProps {
  value: number
  /** Bad-quarter variant: shown against the shortfall instead of "of it". */
  shortfall?: number
}

/**
 * "We delivered $1.26M of it." — the load-bearing sentence, per the copy
 * deck: it attaches our number to their number. Rendered as the hero stat
 * so it reads as the answer, not one more line of prose.
 */
export function AttributionStat({ value, shortfall }: AttributionStatProps) {
  return (
    <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">We delivered</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-brand-700 tabular-nums">
          {formatCompactUsd(value)}
        </p>
      </div>
      <p className="pb-1 text-sm text-slate-500">
        {shortfall ? `against a ${formatCompactUsd(shortfall)} shortfall` : "of it"}
      </p>
    </div>
  )
}
