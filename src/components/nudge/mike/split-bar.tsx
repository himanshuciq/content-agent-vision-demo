import { cn } from "@/lib/utils"

const fmt = (v: number) => (v >= 1 ? `$${+v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`)

/**
 * Banked, unlocked and open as separate pieces, each with its own label, so the
 * bar never implies a total the user hasn't seen (banked + open). The open piece
 * keeps the number from the headline. `aside` sits on the right (the celebration).
 */
export function SplitBar({ banked, unlocked, open, aside }: { banked: number; unlocked: number; open: number; aside?: React.ReactNode }) {
  const parts = [
    { key: "banked", value: banked, label: "banked this quarter", dot: "bg-brand-600", bar: "bg-brand-600" },
    { key: "unlocked", value: unlocked, label: "unlocked today", dot: "bg-brand-400", bar: "bg-brand-400" },
    { key: "open", value: open, label: "open", dot: "border-2 border-brand-300 bg-white", bar: "bg-white ring-1 ring-inset ring-brand-300" },
  ].filter((p) => p.value > 0.0005)

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500 tabular-nums">
          {parts.map((p) => (
            <span key={p.key} className="inline-flex items-center gap-2">
              <span className={cn("size-2.5 rounded-full", p.dot)} />
              <span className="font-mono font-semibold text-slate-950">{fmt(p.value)}</span>
              {p.label}
            </span>
          ))}
        </div>
        {aside}
      </div>
      <div className="mt-2.5 flex h-2 gap-1">
        {parts.map((p) => (
          <div key={p.key} className={cn("h-full rounded-full transition-[flex-grow] duration-500 ease-out", p.bar)} style={{ flex: `${p.value} 1 0` }} />
        ))}
      </div>
    </div>
  )
}
