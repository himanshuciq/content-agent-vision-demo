"use client"

import { useEffect, useState } from "react"
import { Check, Mail, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLive } from "../live-model"
import { useNudge } from "../nudge-context"
import { useFireNudge } from "../use-fire-nudge"

/**
 * Monday's automatic email, reported back to Claire: who's already on it and
 * who hasn't started, with one click to nudge again. Auto-send is on by default;
 * "review first" holds the email until Claire sends it.
 * overlay (waterfall version): a floating card at the top that hides itself
 * after 5 seconds, and stays while hovered so she can click Nudge.
 */
export function WeeklyBanner({ overlay = false }: { overlay?: boolean }) {
  const { nudged } = useNudge()
  const { fire } = useFireNudge()
  const live = useLive()
  const [autoSend, setAutoSend] = useState(true)
  const [sentManually, setSentManually] = useState(false)
  const [showSetting, setShowSetting] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!overlay || hovered || showSetting || dismissed) return
    const t = window.setTimeout(() => setDismissed(true), 5000)
    return () => window.clearTimeout(t)
  }, [overlay, hovered, showSetting, dismissed])

  if (dismissed) return null

  const sent = autoSend || sentManually
  const rows = live.approval.rows.filter((r) => r.weekly)
  const inProgress = rows.filter((r) => r.weekly?.state !== "not-started")
  const notStarted = rows.filter((r) => r.weekly?.state === "not-started")
  const names = (list: typeof rows) => {
    const n = list.map((r) => r.analystName)
    return n.length > 1 ? `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}` : n.join("")
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm",
        overlay
          ? "fixed top-4 left-1/2 z-50 w-[min(880px,calc(100%-32px))] -translate-x-1/2 animate-in rounded-xl border border-brand-200 bg-white/95 px-5 py-3 shadow-pane-lg backdrop-blur fade-in slide-in-from-top-2"
          : "relative border-b border-slate-200 bg-brand-25 px-12 py-3",
      )}
    >
      <Mail className="size-4 shrink-0 text-brand-600" />
      {sent ? (
        <>
          <span className="font-medium text-slate-900">
            {autoSend ? "Monday 8:00 AM: " : "Sent: "}we emailed this week&apos;s actions to your team.
          </span>
          <span className="text-slate-600">
            {inProgress.length > 0 && `${names(inProgress)} ${inProgress.length > 1 ? "have" : "has"} started`}
            {inProgress.length > 0 && notStarted.length > 0 && " · "}
            {notStarted.length > 0 && `${names(notStarted)} ${notStarted.length > 1 ? "haven't" : "hasn't"} yet`}
          </span>
          {notStarted.map((r) =>
            r.nudgeKey && nudged[r.nudgeKey] ? (
              <span key={r.nudgeKey} className="inline-flex items-center gap-1 font-medium text-success-700">
                <Check className="size-4" />
                {r.analystName} nudged today
              </span>
            ) : (
              <button
                key={r.nudgeKey}
                type="button"
                onClick={() => fire(r)}
                className="rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600"
              >
                Nudge {r.analystName}
              </button>
            ),
          )}
        </>
      ) : (
        <>
          <span className="font-medium text-slate-900">This week&apos;s actions are ready for {names(rows)}.</span>
          <button
            type="button"
            onClick={() => setSentManually(true)}
            className="rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600"
          >
            Review and send
          </button>
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button type="button" onClick={() => setShowSetting((v) => !v)} className="text-xs text-slate-500 hover:text-slate-800">
            Auto-send {autoSend ? "on" : "off"}
          </button>
          {showSetting && (
            <div className="absolute top-full right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-1.5 text-sm shadow-md">
              {[
                { on: true, label: "Send every Monday automatically" },
                { on: false, label: "Let me review first" },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => {
                    setAutoSend(o.on)
                    setSentManually(false)
                    setShowSetting(false)
                  }}
                  className={cn("flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left hover:bg-slate-50", autoSend === o.on && "font-medium")}
                >
                  {o.label}
                  {autoSend === o.on && <Check className="size-4 text-brand-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" aria-label="Dismiss" onClick={() => setDismissed(true)} className="text-slate-400 hover:text-slate-700">
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
