"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNudge } from "../nudge-context"
import { useFireNudge } from "../use-fire-nudge"
import { AGENT_DOT } from "../agent-style"
import { AGENT_LABEL, type TierRow } from "../types"

/**
 * One row in a Claire tier. Read-only until hovered, when the individual
 * nudge appears in the shared action column — aligned under the tier's
 * "Nudge team". Once nudged (individually or via team) it stays marked.
 */
export function NudgeRow({ row, grid }: { row: TierRow; grid: string }) {
  const { nudged } = useNudge()
  const { fire } = useFireNudge()
  const isNudged = row.nudgeKey ? !!nudged[row.nudgeKey] : false

  return (
    <div className={cn(grid, "group border-t border-slate-100 py-3.5 first:border-t-0")}>
      <div className="grid grid-cols-[168px_minmax(0,1fr)] items-start gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className={`size-2 rounded-sm ${AGENT_DOT[row.agent]}`} />
            {row.analystName ? (
              <span className="text-sm text-slate-950">
                <span className="font-medium">{row.analystName}</span>{" "}
                <span className="text-slate-500">{AGENT_LABEL[row.agent]}</span>
              </span>
            ) : (
              <span className="text-sm font-medium text-slate-950">{AGENT_LABEL[row.agent]}</span>
            )}
          </div>
          {row.weekly && (
            <div className="mt-1 ml-4.5 text-xs">
              {row.weekly.state === "in-progress" ? (
                <span className="font-medium text-info-700">In progress · {row.weekly.progress}</span>
              ) : (
                <span className="text-slate-500">Emailed Mon · not started</span>
              )}
            </div>
          )}
          {row.deadline && (
            <span className="mt-1.5 ml-4.5 inline-block rounded bg-warning-100 px-1.5 py-0.5 text-[11px] font-semibold text-warning-700">
              {row.deadline}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{row.description}</p>
      </div>

      <div className="text-right font-mono text-[15px] font-semibold text-slate-950 tabular-nums">{row.value}</div>

      <div className="justify-self-end">
        {row.nudgeKey &&
          (isNudged ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700">
              <Check className="size-4" />
              Nudged today
            </span>
          ) : (
            <button
              type="button"
              onClick={() => fire(row)}
              className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-800 opacity-0 shadow-xs transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:border-brand-300 hover:text-brand-700"
            >
              {row.weekly ? "Nudge again" : `Nudge ${row.analystName}`}
            </button>
          ))}
      </div>

      <div />
    </div>
  )
}
