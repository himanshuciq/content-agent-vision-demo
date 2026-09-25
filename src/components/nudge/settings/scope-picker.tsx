"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PILL =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-colors hover:border-brand-300 data-[popup-open]:border-brand-300"
const MENU = "min-w-48 rounded-xl p-1.5 shadow-md ring-1 ring-slate-200/80"
const ITEM = "cursor-pointer rounded-lg px-2.5 py-1.5 text-sm outline-hidden select-none focus:bg-brand-50 data-checked:bg-brand-50 data-checked:text-slate-950"

/** One pick from a list (retailer, tier, mode), shown as a pill like the Knowledge page. */
export function SinglePicker({ label, value, options, onChange }: { label: string; value: string; options: { id: string; label: string }[]; onChange: (v: string) => void }) {
  const current = options.find((o) => o.id === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={PILL} aria-label={label}>
        <span className={cn(!current && "text-slate-400")}>{current?.label ?? label}</span>
        <ChevronDown className="size-3.5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className={MENU}>
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(String(v))}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.id} value={o.id} className={cn(ITEM, "**:data-[slot=dropdown-menu-radio-item-indicator]:hidden")}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Several picks (brands, SKU groups). Empty means "all". */
export function MultiPicker({ label, value, options, onChange }: { label: string; value: string[]; options: string[]; onChange: (v: string[]) => void }) {
  const text = value.length === 0 ? label : value.length === 1 ? value[0] : `${value[0]} +${value.length - 1}`
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={PILL} aria-label={label}>
        <span className={cn(value.length === 0 && "text-slate-400")}>{text}</span>
        <ChevronDown className="size-3.5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className={MENU}>
        {options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o}
            checked={value.includes(o)}
            onCheckedChange={(on) => onChange(on ? [...value, o] : value.filter((x) => x !== o))}
            className={ITEM}
          >
            {o}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** A scope shown on a card: neutral chips, "All brands" when nothing is picked. */
export function ScopeChips({ parts }: { parts: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {parts.map((p) => (
        <span key={p} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {p}
        </span>
      ))}
    </div>
  )
}
