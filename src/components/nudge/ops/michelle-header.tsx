"use client"

import { PeriodSwitch } from "../period-switch"
import { SettingsGear } from "../settings-gear"

const Dot = () => <span className="text-slate-300">·</span>
const Num = ({ children }: { children: React.ReactNode }) => <span className="font-mono font-semibold text-slate-950">{children}</span>
const Up = ({ children }: { children: React.ReactNode }) => <span className="font-medium text-success-700">↑{children}</span>

/** Michelle's top line, shaped like Mike's and Claire's: greeting, quarter, how her ops work is doing; the view switch sits by the gear. */
export function MichelleHeader({ viewSwitch }: { viewSwitch?: React.ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-6 px-10 pt-8">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-500">
        <span className="mr-1 flex size-5 items-center justify-center rounded-md bg-brand-500" aria-label="Ally">
          <span className="size-1.5 rounded-full bg-brand-200" />
        </span>
        <span>Hi Michelle</span>
        <Dot />
        <PeriodSwitch />
        <Dot />
        <span>
          Buy box win rate <Num>94%</Num> <Up>2 pts</Up>
        </span>
        <Dot />
        <span>
          Promo badges live <Num>97%</Num> <Up>3 pts</Up>
        </span>
        <Dot />
        <span>
          <Num>2</Num> days to fix, down from 14
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {viewSwitch}
        <SettingsGear />
      </div>
    </header>
  )
}
