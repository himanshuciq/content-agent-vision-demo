import { ArrowUp } from "lucide-react"
import { CONTENT_BANKED_Q3 } from "../delivered-content-data"
import { OPEN_BY_AREA } from "../data"

const CONTENT_OPEN = OPEN_BY_AREA.find((a) => a.agent === "content")!.value
const k = (v: number) => `$${Math.round(v * 1000)}K`

const METRICS: { label: string; value: string; delta?: string; note?: string }[] = [
  { label: "Value delivered", value: k(CONTENT_BANKED_Q3.delivered), note: `of ${k(CONTENT_BANKED_Q3.promised)} projected` },
  { label: "SEO share of voice", value: "42%", delta: "0.8 pts" },
  { label: "AI share of voice", value: "34%", delta: "1.4 pts" },
  { label: "Days saved", value: "7.7" },
]

/**
 * Where Mike's content stands this quarter before he's asked to act: the same
 * open number Claire sees for content, then four quiet numbers. No cards.
 */
export function MikeGrounding() {
  return (
    <div className="px-10 pt-8">
      <div className="text-xl font-semibold tracking-tight text-slate-950">
        <span className="font-mono">{CONTENT_OPEN}</span> of content opportunity is open this quarter.
      </div>
      <div className="mt-5 grid grid-cols-4 divide-x divide-slate-100 border-y border-slate-100">
        {METRICS.map((m) => (
          <div key={m.label} className="px-5 py-4 first:pl-0">
            <div className="text-xs text-slate-500">{m.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold tracking-tight text-slate-950 tabular-nums">{m.value}</span>
              {m.delta && (
                <span className="inline-flex items-center gap-0.5 text-sm font-medium text-success-700">
                  <ArrowUp className="size-3.5" />
                  {m.delta}
                </span>
              )}
            </div>
            {m.note && <div className="mt-0.5 text-xs text-slate-500">{m.note}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
