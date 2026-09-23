"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { useNudge } from "./nudge-context"
import { NUDGE_TARGETS } from "./data"
import { useSlackNudgeToast } from "./slack-toast"
import type { TierRow } from "./types"

/**
 * `fire` handles a single-row nudge (mark + Slack for rows that map to a real
 * recipient — Mike for content, Michelle for ops). `sendSlack` fires only the
 * Slack DM + in-app popup, used by "Nudge team" after `nudgeMany` marks the rows.
 */
export function useFireNudge() {
  const { nudge } = useNudge()
  const showSlackToast = useSlackNudgeToast()

  const sendSlack = useCallback(
    (row: TierRow) => {
      if (!row.nudgeKey) return
      const t = NUDGE_TARGETS[row.nudgeKey]
      if (!t) return
      showSlackToast({ batchName: t.batchName, description: row.description, value: t.value, skus: t.skus, deadlineDays: t.deadlineDays, queuePath: t.queuePath })
      void fetch("/api/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchName: t.batchName,
          description: row.description,
          value: t.value,
          skus: t.skus,
          deadlineDays: t.deadlineDays,
          recipient: t.recipient,
          queuePath: t.queuePath,
        }),
      }).catch(() => {})
    },
    [showSlackToast],
  )

  const fire = useCallback(
    (row: TierRow) => {
      if (!row.nudgeKey) return
      nudge(row.nudgeKey)
      if (NUDGE_TARGETS[row.nudgeKey]) sendSlack(row)
      else toast.success(`Nudged ${row.analystName}`, { position: "top-right" })
    },
    [nudge, sendSlack],
  )

  return { fire, sendSlack }
}
