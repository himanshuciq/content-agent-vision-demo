import { cn } from "@/lib/utils"
import type { SkuSection } from "../types"

type Op<T> = { t: "same" | "del" | "add"; v: T }

/** Longest-common-subsequence diff: what stayed, what was removed, what was added, in order. */
function diff<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean): Op<T>[] {
  const n = a.length
  const m = b.length
  const L = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = eq(a[i], b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1])
  const out: Op<T>[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (eq(a[i], b[j])) {
      out.push({ t: "same", v: b[j] })
      i++
      j++
    } else if (L[i + 1][j] >= L[i][j + 1]) out.push({ t: "del", v: a[i++] })
    else out.push({ t: "add", v: b[j++] })
  }
  while (i < n) out.push({ t: "del", v: a[i++] })
  while (j < m) out.push({ t: "add", v: b[j++] })
  return out
}

/** Words compare without trailing punctuation, so "Jar" and "Jar," count as the same word. */
const norm = (w: string) => w.replace(/[,.;:]+$/, "").toLowerCase()
const words = (s: string) => s.split(/\s+/).filter(Boolean)

function Words({ ops }: { ops: Op<string>[] }) {
  // Merge runs of the same kind, so "Spooky Party Décor" is one green span, not three pills.
  const runs = ops.reduce<Op<string>[]>((acc, o) => {
    const last = acc[acc.length - 1]
    if (last && last.t === o.t) last.v += " " + o.v
    else acc.push({ ...o })
    return acc
  }, [])
  return (
    <>
      {runs.map((o, k) => (
        <span key={k}>
          {k > 0 && " "}
          <span
            className={cn(
              o.t === "del" && "text-slate-400 line-through",
              o.t === "add" && "rounded bg-success-50 px-0.5 font-medium text-success-800",
              o.t === "same" && "text-slate-900",
            )}
          >
            {o.v}
          </span>
        </span>
      ))}
    </>
  )
}

/**
 * One text field as an edit: lines that stayed are black, removed lines are
 * struck, new lines are green; a line that changed shows its word-level edit.
 */
function TextDiff({ live, draft }: { live: string[]; draft: string[] }) {
  const lines = diff(live, draft, (x, y) => x === y)
  const rows: { kind: "same" | "del" | "add" | "edit"; ops?: Op<string>[]; text?: string }[] = []
  for (let k = 0; k < lines.length; k++) {
    const cur = lines[k]
    const next = lines[k + 1]
    if (cur.t === "del" && next?.t === "add") {
      rows.push({ kind: "edit", ops: diff(words(cur.v), words(next.v), (x, y) => norm(x) === norm(y)) })
      k++
    } else rows.push({ kind: cur.t, text: cur.v })
  }
  return (
    <div className="flex flex-col gap-1.5 text-sm leading-relaxed">
      {rows.map((r, k) => (
        <p
          key={k}
          className={cn(
            r.kind === "del" && "text-slate-400 line-through",
            r.kind === "add" && "w-fit rounded bg-success-50 px-1 font-medium text-success-800",
            r.kind === "same" && "text-slate-900",
          )}
        >
          {r.kind === "edit" ? <Words ops={r.ops!} /> : r.text}
        </p>
      ))}
    </div>
  )
}

/** Every changed field for one SKU. Text fields show a single inline edit; images show before and after. */
export function SkuSections({ sections, thumbnailUrl }: { sections: SkuSection[]; thumbnailUrl?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-950">{section.label}</div>
          {section.kind === "text" ? (
            <div className="px-5 py-4">
              <TextDiff live={section.live} draft={section.draft.map((d) => d.text)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 px-5 py-4">
              {[
                { label: section.liveLabel, live: true },
                { label: section.draftLabel, live: false },
              ].map((img) => (
                <div key={img.label} className={cn("relative h-32 overflow-hidden rounded-md", img.live ? "bg-slate-100" : "ring-2 ring-success-300")}>
                  <img src={thumbnailUrl} alt={img.label} className={cn("size-full object-cover", img.live && "opacity-60 grayscale")} />
                  <span
                    className={cn(
                      "absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold shadow-xs",
                      img.live ? "bg-white/90 text-slate-500 line-through" : "bg-success-600 text-white",
                    )}
                  >
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-4 px-1 text-xs text-slate-500">
        <span>
          <span className="text-slate-400 line-through">Removed</span>
        </span>
        <span className="text-slate-900">Kept</span>
        <span className="rounded bg-success-50 px-1 font-medium text-success-800">Added</span>
      </div>
    </div>
  )
}
