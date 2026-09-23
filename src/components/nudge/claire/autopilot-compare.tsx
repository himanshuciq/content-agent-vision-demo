import { COMPARE } from "../data"

/** "How you compare" — the persuasion for widening autopilot, stated without judgment. */
export function AutopilotCompare() {
  return (
    <div id="autopilot-compare" className="mx-12 mt-6 mb-8 rounded-xl border border-slate-200 bg-slate-25 px-7 py-5">
      <div className="font-mono text-xs tracking-wide text-slate-500 uppercase">How you compare</div>
      <div className="mt-4.5 flex flex-wrap items-center gap-11">
        <div className="w-[150px] shrink-0">
          <div className="text-[17px] font-semibold tracking-tight text-slate-950">Autopilot</div>
          <div className="mt-0.5 text-[13px] text-slate-500">share of value Ally ships alone</div>
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          <Bar label="You" pct={COMPARE.youPct} tone="brand" />
          <Bar label="Best in class" pct={COMPARE.bestInClassPct} tone="neutral" />
        </div>
        <div className="shrink-0 text-[15px] font-medium text-warning-700">
          <span className="font-bold">{COMPARE.expiredYtd}</span> expired YTD waiting on approval
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-brand-500 px-5.5 py-3 text-sm font-medium text-white shadow-xs hover:bg-brand-600"
        >
          Increase autopilot
        </button>
      </div>
    </div>
  )
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: "brand" | "neutral" }) {
  return (
    <div className="grid grid-cols-[110px_1fr_48px] items-center gap-4">
      <div className="text-sm text-slate-700">{label}</div>
      <div className="h-4.5 overflow-hidden rounded-md bg-slate-200">
        <div
          className={`h-full rounded-md ${tone === "brand" ? "bg-brand-500" : "bg-slate-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`text-right text-sm font-bold tabular-nums ${tone === "brand" ? "text-slate-950" : "text-slate-700"}`}>
        {pct}%
      </div>
    </div>
  )
}
