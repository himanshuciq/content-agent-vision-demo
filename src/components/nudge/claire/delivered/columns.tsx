import { cn } from "@/lib/utils"
import { fmtValue } from "../../data"
import { MethodTag } from "./method-tag"

/** Shared columns for "How we did": name · Delivered · Promised · vs promise · chevron. Header is said once. */
export const DELIVERED_GRID = "grid grid-cols-[minmax(0,1fr)_96px_96px_96px_20px] items-center gap-4"

/** projectedFirst: the waterfall version's order, Projected · Delivered · vs projected. */
export function DeliveredHeader({ first = "Delivered", projectedFirst = false }: { first?: string; projectedFirst?: boolean }) {
  return (
    <div className={cn(DELIVERED_GRID, "px-6 py-2.5 text-xs font-medium text-slate-500")}>
      <span />
      <span className="text-right">{projectedFirst ? "Projected" : first}</span>
      <span className="text-right">{projectedFirst ? first : "Promised"}</span>
      <span className="text-right">{projectedFirst ? "vs projected" : "vs promise"}</span>
      <span />
    </div>
  )
}

/** Row label: the name, then what we did or why, on the same line. */
export function RowLabel({ name, note, tag, top, indent }: { name: string; note: string; tag?: string; top?: boolean; indent?: boolean }) {
  return (
    <div className={cn("flex min-w-0 items-baseline gap-2.5", indent && "pl-5")}>
      <span className={cn("shrink-0", top ? "text-[15px] font-semibold text-slate-950" : "text-sm text-slate-900")}>{name}</span>
      <span className="truncate text-sm text-slate-500">{note}</span>
      {tag && <MethodTag method={tag} />}
    </div>
  )
}

/** Delivered is the one emphasis; promised stays gray; the gap is colored but not bold. */
export function ValueCells({
  delivered,
  promised,
  strong,
  projectedFirst,
}: {
  delivered: number
  promised: number
  strong?: boolean
  projectedFirst?: boolean
}) {
  const delta = delivered - promised
  const del = (
    <span className={cn("text-right font-mono tabular-nums text-slate-950", strong ? "text-base font-bold" : "text-sm")}>{fmtValue(delivered)}</span>
  )
  const proj = <span className="text-right font-mono text-sm tabular-nums text-slate-500">{fmtValue(promised)}</span>
  return (
    <>
      {projectedFirst ? proj : del}
      {projectedFirst ? del : proj}
      <span className={cn("text-right font-mono text-sm tabular-nums", delta >= 0 ? "text-success-700" : "text-error-600")}>
        {delta >= 0 ? "+" : "−"}
        {fmtValue(Math.abs(delta))}
      </span>
    </>
  )
}
