import { PERIODS, type PeriodId } from "./data"
import { PeriodSwitcher } from "./period-switcher"

interface WhatWeDidHeaderProps {
  period: PeriodId
  onPeriodChange: (id: PeriodId) => void
}

/**
 * "Here's what your Ally team did for you last quarter." The underlined
 * period word is the same control as the header-bar switcher — both read
 * from and write to the one piece of state lifted to the page.
 */
export function WhatWeDidHeader({ period, onPeriodChange }: WhatWeDidHeaderProps) {
  const active = PERIODS.find((p) => p.id === period) ?? PERIODS[0]
  const prefix = active.pastLabel.slice(0, active.pastLabel.length - active.label.length).trim()

  return (
    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
      {"Here's what your Ally team did for you "}
      {prefix}{" "}
      <PeriodSwitcher value={period} onChange={onPeriodChange} className="text-3xl sm:text-4xl" />
      {"."}
    </h1>
  )
}
