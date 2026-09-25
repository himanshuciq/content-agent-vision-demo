import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { AS_OF } from "../data"
import { daysUntil, shortDate } from "../model"

/**
 * The inbox rail shared by Mike's and Michelle's pages. Calm by design: a white
 * rail, a small dot per bucket (the same colors as Claire's chart) instead of
 * filled headers and side bars, the shared deadline said once in the header, and
 * a neutral selection. Color is a hint, never a fill.
 */
export const GROUPS = [
  { tier: "approval", label: "One approval away", dot: "bg-brand-500" },
  { tier: "input", label: "Needs your input", dot: "bg-warning-500" },
  { tier: "autopilot", label: "On autopilot", dot: "bg-info-500" },
] as const

/** Selected item: a soft neutral card, same as the selection box elsewhere. */
export const ITEM_ACTIVE = "bg-slate-100 ring-1 ring-slate-200"
export const ITEM_IDLE = "hover:bg-slate-50"

/** "Expires Oct 8 · 18 days" when every item in the group shares one deadline; else nothing (items say their own). */
export function sharedDeadline(deadlines: (string | undefined)[]): string | undefined {
  if (deadlines.length === 0 || deadlines.some((d) => !d)) return undefined
  const unique = [...new Set(deadlines)]
  if (unique.length !== 1) return undefined
  return `Expires ${shortDate(unique[0]!)} · ${daysUntil(unique[0]!, AS_OF)} days`
}

export function RailGroup({
  dot,
  label,
  value,
  meta,
  action,
  first,
  children,
}: {
  dot: string
  label: string
  value: string
  meta?: string
  action?: React.ReactNode
  first?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={cn(!first && "border-t border-slate-200")}>
      <div className="flex items-start justify-between gap-3 px-5.5 pt-5 pb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-950">
            <span className={cn("size-2 shrink-0 rounded-full", dot)} />
            {label}
            <span className="font-mono font-medium text-slate-500 tabular-nums">{value}</span>
          </div>
          {meta && <div className="mt-0.5 pl-4 text-xs font-medium text-warning-700">{meta}</div>}
        </div>
        {action}
      </div>
      <div className="flex flex-col gap-0.5 px-2 pb-3">{children}</div>
    </section>
  )
}

/** "Approve all" as a quiet text action: the detail pane's button stays the one strong action. */
export function ApproveAll({ pending, onClick }: { pending: number; onClick: () => void }) {
  return pending === 0 ? (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-success-700">
      <Check className="size-3.5" />
      All approved
    </span>
  ) : (
    <button type="button" onClick={onClick} className="shrink-0 text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline">
      Approve all
    </button>
  )
}

/** One quiet meta line under an item: parts joined by dots, each with its own tone. */
export function MetaLine({ parts }: { parts: (React.ReactNode | false | undefined)[] }) {
  const shown = parts.filter(Boolean)
  if (shown.length === 0) return null
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
      {shown.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-300">·</span>}
          {p}
        </span>
      ))}
    </div>
  )
}
