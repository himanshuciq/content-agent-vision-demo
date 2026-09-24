"use client"

import { ALLY_BRAIN_HREF } from "@/components/home/app-module-tabs"
import { ProfileSwitcher } from "@/components/home/profile-switcher"
import { PeriodSwitcher } from "./period-switcher"
import type { PeriodId } from "./data"

interface ExecHeaderProps {
  period: PeriodId
  onPeriodChange: (id: PeriodId) => void
}

/**
 * Stripped chrome for /exec: no LaunchpadTabs, no AppModuleTabs (Home / Content /
 * Ops / Insights / Media). The absence of navigation is deliberate — this screen
 * is a destination for an exec, not a hub into the rest of the app. Only the
 * logo, the period switcher, and the avatar remain.
 */
export function ExecHeader({ period, onPeriodChange }: ExecHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/70 px-4 backdrop-blur-xl">
      <a
        href={ALLY_BRAIN_HREF}
        className="truncate text-2xl font-bold tracking-tight text-brand-900 transition-colors hover:text-brand-950"
      >
        Ally
      </a>
      <PeriodSwitcher value={period} onChange={onPeriodChange} showChevron />
      <ProfileSwitcher />
    </header>
  )
}
