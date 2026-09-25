"use client"

import { cn } from "@/lib/utils"

/** Share of the segment by brand, you highlighted. Shares add to 100%. */
export function CompetitorShares({ rows }: { rows: { name: string; share: number; you?: boolean }[] }) {
  const max = Math.max(...rows.map((r) => r.share))
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-25 px-4 py-3.5 ring-1 ring-slate-100">
      <div className="text-xs font-medium text-slate-500">Share of the segment, last 12 months</div>
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[120px_minmax(0,1fr)_44px] items-center gap-3 text-sm">
          <span className={cn(r.you ? "font-semibold text-slate-950" : "text-slate-700")}>{r.name}</span>
          <div className="h-2.5 rounded-full bg-slate-100">
            <div className={cn("h-full rounded-full", r.you ? "bg-brand-500" : "bg-slate-400")} style={{ width: `${(r.share / max) * 100}%` }} />
          </div>
          <span className="text-right font-mono font-semibold text-slate-950 tabular-nums">{r.share}%</span>
        </div>
      ))}
    </div>
  )
}

/** Two shares on one axis over time, the last point dashed as the "if nothing changes" projection. */
export function ShareTrend({ labels, series }: { labels: string[]; series: { name: string; values: number[]; you?: boolean }[] }) {
  const W = 520
  const H = 170
  const pad = { l: 36, r: 90, t: 12, b: 26 }
  const max = Math.ceil(Math.max(...series.flatMap((s) => s.values)) / 10) * 10
  const x = (i: number) => pad.l + (i / (labels.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b)
  const last = labels.length - 1
  return (
    <div className="rounded-xl bg-slate-25 px-4 py-3.5 ring-1 ring-slate-100">
      <div className="text-xs font-medium text-slate-500">Share of the segment · dashed = if nothing changes</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full max-w-[560px]" role="img" aria-label="Share trend">
        {[0, max / 2, max].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--color-slate-200)" />
            <text x={pad.l - 6} y={y(v) + 3.5} textAnchor="end" className="fill-slate-400 font-mono text-[10px]">
              {v}%
            </text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 8} textAnchor="middle" className="fill-slate-500 text-[11px]">
            {l}
          </text>
        ))}
        {series.map((s) => {
          const stroke = s.you ? "var(--color-brand-500)" : "var(--color-slate-400)"
          const solid = s.values.slice(0, last).map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")
          return (
            <g key={s.name}>
              <path d={solid} fill="none" stroke={stroke} strokeWidth={2} />
              <path d={`M${x(last - 1)},${y(s.values[last - 1])} L${x(last)},${y(s.values[last])}`} fill="none" stroke={stroke} strokeWidth={2} strokeDasharray="4 4" />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill="white" stroke={stroke} strokeWidth={2} />
              ))}
              <text x={x(last) + 8} y={y(s.values[last]) + 4} className={cn("text-[11px]", s.you ? "fill-brand-700 font-semibold" : "fill-slate-600")}>
                {s.name} {s.values[last]}%
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
