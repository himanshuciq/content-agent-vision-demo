"use client"

import { useState } from "react"
import { Bell, Check, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLive } from "../live-model"
import { useNudge } from "../nudge-context"
import { useFireNudge } from "../use-fire-nudge"
import { OwnerName } from "../owner-name"
import type { TierRow } from "../types"

/** Same square outline as the gear, so the three icons read as one group. */
export const ICON_BTN =
  "relative flex size-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 outline-none transition-colors hover:border-brand-300 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-300 data-[popup-open]:border-brand-300 data-[popup-open]:text-brand-700"

const names = (rows: TierRow[]) => {
  const n = rows.map((r) => r.analystName)
  return n.length > 1 ? `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}` : n.join("")
}

/** One line in the panel: a small mark, then the sentence. */
function Line({ mark, children }: { mark: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="flex h-5 w-4 shrink-0 items-center justify-center">{mark}</span>
      <div className="min-w-0 flex-1 text-sm leading-5 text-slate-700">{children}</div>
    </div>
  )
}

/**
 * Claire's bell: this week's Monday email and where each owner stands, read
 * from the same rows as her tables. Starts closed; the count is the owners who
 * haven't started and haven't been nudged. Nudge works from here too.
 */
export function TeamBell() {
  const { nudged } = useNudge()
  const { fire } = useFireNudge()
  const live = useLive()
  const [autoSend, setAutoSend] = useState(true)
  const [sentManually, setSentManually] = useState(false)
  const sent = autoSend || sentManually

  const rows = live.approval.rows.filter((r) => r.weekly && r.analystName)
  const started = rows.filter((r) => r.weekly?.state !== "not-started")
  const notStarted = rows.filter((r) => r.weekly?.state === "not-started")
  const waiting = sent ? notStarted.filter((r) => !(r.nudgeKey && nudged[r.nudgeKey])) : []

  return (
    <Popover>
      <PopoverTrigger className={ICON_BTN} aria-label={waiting.length ? `Notifications, ${waiting.length} waiting` : "Notifications"}>
        <Bell className="size-4" />
        {waiting.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full border-2 border-white bg-brand-500 font-mono text-[10px] leading-none font-bold text-white">
            {waiting.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-90 gap-0 rounded-xl p-0 shadow-pane-lg ring-1 ring-slate-200/80">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-sm font-semibold text-slate-950">This week</span>
          <button
            type="button"
            onClick={() => {
              setAutoSend((v) => !v)
              setSentManually(false)
            }}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Auto-send <span className="font-medium text-slate-700">{autoSend ? "on" : "off"}</span>
          </button>
        </div>
        <div className="px-4 py-2">
          {sent ? (
            <>
              <Line mark={<Mail className="size-3.5 text-slate-400" />}>
                {autoSend ? "Emailed your team Monday, 8:00 AM" : "Emailed your team just now"}
              </Line>
              {started.length > 0 && (
                <Line mark={<span className="size-2 rounded-full bg-info-500" />}>
                  {started.length === rows.length ? "Everyone has started" : `${names(started)} started`}
                </Line>
              )}
              {notStarted.map((r) =>
                r.nudgeKey && nudged[r.nudgeKey] ? (
                  <Line key={r.nudgeKey} mark={<Check className="size-3.5 text-success-600" />}>
                    <span className="font-medium text-success-700">
                      <OwnerName lever={r.agent} name={r.analystName} /> nudged today
                    </span>
                  </Line>
                ) : (
                  <Line key={r.nudgeKey ?? r.analystName} mark={<span className="size-2 rounded-full border-[1.5px] border-slate-400" />}>
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        <OwnerName lever={r.agent} name={r.analystName} /> hasn&apos;t started · <span className="font-mono font-semibold text-slate-950">{r.value}</span>
                      </span>
                      {r.nudgeKey && (
                        <button
                          type="button"
                          onClick={() => fire(r)}
                          className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:border-brand-300 hover:text-brand-700"
                        >
                          Nudge
                        </button>
                      )}
                    </div>
                  </Line>
                ),
              )}
            </>
          ) : (
            <Line mark={<Mail className="size-3.5 text-slate-400" />}>
              <div className="flex items-center justify-between gap-3">
                <span>Not sent yet</span>
                <button type="button" onClick={() => setSentManually(true)} className={cn("shrink-0 text-xs font-semibold text-brand-700 hover:underline")}>
                  Send now
                </button>
              </div>
            </Line>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
