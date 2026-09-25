"use client"

import { useMemo } from "react"
import { BUSINESS, deadlineView, getSnapshot, openView, tierView, waterfallStages } from "./data"
import { useNudge } from "./nudge-context"
import type { Period } from "./types"

/**
 * The model for this session: the data plus what people have done (approvals and
 * inputs sent on Mike's and Michelle's pages). Claire's page reads this, so her
 * rows, totals, bridge and statuses move as her team acts.
 */
export function useLive() {
  const { approved } = useNudge()
  return useMemo(() => {
    const open = openView(approved)
    return {
      snapshot: getSnapshot(),
      stages: waterfallStages(approved),
      approval: tierView("approval", approved),
      open,
      deadline: deadlineView(approved),
      /** Where the period lands: the run rate plus what was approved this session (it's now on its way live). */
      pace: (period: Period) => BUSINESS[period].pace + (period === "quarter" || period === "year" ? open.acted : 0),
    }
  }, [approved])
}
