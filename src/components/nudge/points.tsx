import { cn } from "@/lib/utils"

/** Card and panel copy: bullets of fragments, never sentences (a label, a number, a few words). */
export function Points({ items, className }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-1.5 text-sm text-slate-700", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-slate-400" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

/** A number inside copy: mono, dark, red when it's a loss. */
export const Num = ({ children, bad }: { children: React.ReactNode; bad?: boolean }) => (
  <span className={cn("font-mono font-semibold", bad ? "text-error-600" : "text-slate-950")}>{children}</span>
)
