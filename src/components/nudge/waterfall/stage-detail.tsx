"use client"

import { Check } from "lucide-react"
import { NudgeRow } from "../claire/nudge-row"
import { TIER_GRID } from "../claire/nudge-tier"
import { useNudge } from "../nudge-context"
import { useFireNudge } from "../use-fire-nudge"
import { NUDGE_TARGETS, fmtM } from "../data"
import type { WaterfallStage } from "../data"
import type { NudgeKey } from "../types"

/** The drill-down for a selected waterfall stage: its line items + the nudge action. */
export function StageDetail({ stage }: { stage: WaterfallStage }) {
  const { nudged, nudgeMany } = useNudge()
  const { sendSlack } = useFireNudge()

  const nudgeable = stage.rows.filter((r) => r.nudgeKey)
  const teamNudged = nudgeable.length > 0 && nudgeable.every((r) => nudged[r.nudgeKey!])

  function nudgeTeam() {
    nudgeMany(nudgeable.map((r) => r.nudgeKey!) as NudgeKey[])
    stage.rows.filter((r) => r.nudgeKey && NUDGE_TARGETS[r.nudgeKey]).forEach(sendSlack)
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
      {/* Same grid as the rows below, so the total sits over the values and Nudge team over the Nudge again buttons. */}
      <div className={`${TIER_GRID} border-b border-slate-100 bg-slate-25 px-6 py-4`}>
        <span className="text-lg font-semibold text-slate-950">{stage.label}</span>
        <span className="text-right font-mono text-[15px] font-bold text-slate-950 tabular-nums">{fmtM(stage.value)}</span>
        <div className="justify-self-end">
          {stage.canNudgeTeam &&
            (teamNudged ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700">
                <Check className="size-4" />
                Team nudged
              </span>
            ) : (
              <button
                type="button"
                onClick={nudgeTeam}
                className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-600"
              >
                Nudge team
              </button>
            ))}
        </div>
        <div />
      </div>

      {stage.rows.length > 0 ? (
        <div className="px-6 py-1.5">
          {stage.rows.map((row, i) => (
            <NudgeRow key={i} row={row} grid={TIER_GRID} statusColumn />
          ))}
        </div>
      ) : (
        <div className="px-6 py-5 text-sm text-slate-500">{stage.note}</div>
      )}
    </div>
  )
}
