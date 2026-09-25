"use client"

import { PeriodSwitch } from "../period-switch"
import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNudge } from "../nudge-context"
import { SettingsGear } from "../settings-gear"
import { nudgeTargets } from "../data"
import type { NudgeKey } from "../types"

const Dot = () => <span className="text-slate-300">·</span>
const Num = ({ children }: { children: React.ReactNode }) => <span className="font-mono font-semibold text-slate-950">{children}</span>
const Up = ({ children }: { children: React.ReactNode }) => <span className="font-medium text-success-700">↑{children}</span>

/** Mike's top line, shaped like Claire's: greeting, quarter, how his content is doing. Then the bell that ties back to Claire's nudge. */
export function MikeHeader() {
  const { mikeNotified, clearNotification, nudged, policy } = useNudge()
  // What Claire actually nudged Mike about, from the nudges sent (not a fixed batch).
  const targets = nudgeTargets(policy)
  const nudgedTargets = (Object.keys(targets) as NudgeKey[]).filter((k) => nudged[k] && targets[k]?.recipient === "mike").map((k) => targets[k]!)

  return (
    <header className="flex items-start justify-between gap-6 px-10 pt-8">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-500">
        <span className="mr-1 flex size-5 items-center justify-center rounded-md bg-brand-500" aria-label="Ally">
          <span className="size-1.5 rounded-full bg-brand-200" />
        </span>
        <span>Hi Mike</span>
        <Dot />
        <PeriodSwitch />
        <Dot />
        <span>
          SEO share of voice <Num>42%</Num> <Up>0.8 pts</Up>
        </span>
        <Dot />
        <span>
          AI share of voice <Num>34%</Num> <Up>1.4 pts</Up>
        </span>
        <Dot />
        <span>
          <Num>7.7</Num> days saved
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Link href="/claire-waterfall" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700">
          <ArrowLeft className="size-3" />
          Claire&apos;s view
        </Link>
        <DropdownMenu onOpenChange={(open) => { if (!open) clearNotification() }}>
          <DropdownMenuTrigger className="relative flex size-9 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50">
            <Bell className="size-4 text-slate-500" />
            {mikeNotified && (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-error-600" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-80 rounded-xl p-1.5 shadow-md ring-1 ring-slate-200/80">
            {mikeNotified ? (
              <DropdownMenuItem className="flex items-start gap-3 p-2.5">
                <span className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  C
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">Claire nudged you</span>
                  {nudgedTargets.map((t) => (
                    <span key={t.batchName} className="mt-0.5 block text-sm text-slate-500">
                      {t.batchName} · {t.value}, {t.skus} SKUs
                    </span>
                  ))}
                </span>
              </DropdownMenuItem>
            ) : (
              <div className="p-3 text-sm text-slate-500">No new notifications.</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <SettingsGear />
      </div>
    </header>
  )
}
