"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PERIODS, type PeriodId } from "./data"

interface PeriodSwitcherProps {
  value: PeriodId
  onChange: (id: PeriodId) => void
  /** Header-bar placement shows a chevron; inline-in-sentence placement doesn't need one. */
  showChevron?: boolean
  className?: string
}

/**
 * The underlined period word is the control per the copy deck — click it to
 * change week/month/quarter/year. One shared instance drives both the
 * stripped header bar and the "what we did" heading, so they never drift.
 */
export function PeriodSwitcher({ value, onChange, showChevron, className }: PeriodSwitcherProps) {
  const [open, setOpen] = useState(false)
  const active = PERIODS.find((period) => period.id === value) ?? PERIODS[0]

  function select(id: string) {
    onChange(id as PeriodId)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label="Change period"
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 underline decoration-2 underline-offset-2",
          "decoration-slate-300 font-semibold text-slate-900 outline-none transition-colors",
          "hover:decoration-brand-400 focus-visible:decoration-brand-500 data-open:decoration-brand-500",
          className,
        )}
      >
        {active.label}
        {showChevron && <ChevronDown className="size-3.5 text-slate-400" aria-hidden />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={6}
        className="min-w-28 rounded-xl p-1.5 shadow-lg ring-1 ring-slate-200/80"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={select}>
          {PERIODS.map((period) => (
            <DropdownMenuRadioItem
              key={period.id}
              value={period.id}
              className={cn(
                "cursor-pointer rounded-lg px-2.5 py-1.5 text-sm capitalize outline-hidden select-none",
                "focus:bg-brand-50 focus:text-slate-900",
                "data-checked:bg-brand-100 data-checked:text-slate-900",
                "**:data-[slot=dropdown-menu-radio-item-indicator]:hidden",
              )}
            >
              {period.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
