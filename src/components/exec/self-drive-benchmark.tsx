import { BENCHMARK_SELF_DRIVE_PCT, BENCHMARK_SELF_DRIVE_VALUE, DELIVERED_SELF_DRIVE } from "./data"
import { formatCompactUsd } from "./format"

/** The persuasion, stated without judgment — the number sits next to the benchmark. */
export function SelfDriveAndBenchmark() {
  return (
    <div className="space-y-3">
      <p className="text-base text-slate-700">
        <span className="mr-2 inline-flex items-center rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700 tabular-nums">
          {formatCompactUsd(DELIVERED_SELF_DRIVE)}
        </span>
        of that ran on self-drive. Everything else waited for someone on your team.
      </p>
      <p className="border-l-2 border-brand-200 pl-3 text-sm text-slate-500">
        {`Brands at benchmark run ${BENCHMARK_SELF_DRIVE_PCT}% of this on self-drive. At your volume that's about ${formatCompactUsd(
          BENCHMARK_SELF_DRIVE_VALUE,
        )} a quarter that ships without anyone opening this screen.`}
      </p>
    </div>
  )
}
