"use client"

import { useState } from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmtBiz, fmtValue } from "../data"
import { COMPETITORS, MARKET, NEXT_EVENT, SEGMENTS, TOP_COMPETITOR, TOP_SEGMENT } from "../market"
import { Num, Points } from "../points"
import { AllyPanel } from "./ally-panel"
import type { PanelContext } from "./ally-panel"
import { ReadinessDot } from "./grow-cards"
import type { GrowView } from "./grow-cards"
import { MarketMap } from "./market-map"
import { PlayList } from "./plays"

const BOX = "rounded-xl border border-slate-200 bg-white"

/** A view that opens from a "Grow beyond plan" card: back to home, the content, and Ally beside it. */
function Shell({ eyebrow, title, sub, context, onBack, children }: { eyebrow: string; title: string; sub: string; context: PanelContext; onBack: () => void; children: React.ReactNode }) {
  const [chat, setChat] = useState(true)
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-12 pt-8 pb-16">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
            <ArrowLeft className="size-4" />
            Back to home
          </button>
          {!chat && (
            <button type="button" onClick={() => setChat(true)} className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
              <Sparkles className="size-3.5" /> Ask Ally
            </button>
          )}
        </div>
        <div className="mt-4 font-mono text-xs tracking-wide text-slate-500 uppercase">{eyebrow}</div>
        <h1 className="mt-2 text-[28px] leading-tight font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 text-base text-slate-500">{sub}</p>
        <div className="mt-6">{children}</div>
      </div>
      {chat && <AllyPanel context={context} onClose={() => setChat(false)} />}
    </div>
  )
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div>
      <div className={cn("font-mono font-semibold", bad ? "text-error-600" : "text-slate-950")}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}

export function MarketView({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(TOP_SEGMENT.id)
  const s = SEGMENTS.find((x) => x.id === selected)!
  const lead = [...SEGMENTS].sort((a, b) => b.share * b.size - a.share * a.size)[0]
  const losing = SEGMENTS.filter((x) => x.change < 0).sort((a, b) => a.change - b.change)[0]
  return (
    <Shell
      eyebrow={`Your market · ${MARKET.name} · last 12 months`}
      title={`You lead ${lead.name.toLowerCase()}. ${TOP_SEGMENT.name} is the fastest-growing segment, and you hold ${TOP_SEGMENT.share}% of it.`}
      sub={`You're losing share in ${losing.name.toLowerCase()} (${losing.change} pts) to ${TOP_COMPETITOR.name}'s price cut.`}
      context={{ kind: "segment", id: selected }}
      onBack={onBack}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className={cn(BOX, "p-4")}>
          <MarketMap selected={selected} onSelect={setSelected} />
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 px-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-success-500/70" /> Gaining share</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-error-500/70" /> Losing share</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-slate-400/70" /> Flat</span>
            <span className="ml-auto">Size = segment sales · click a bubble</span>
          </div>
        </div>
        <div className={cn(BOX, "flex flex-col")}>
          <div className="border-b border-slate-100 bg-slate-25 px-5 py-3.5">
            <div className="text-lg font-semibold text-slate-950">{s.name}</div>
            <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
              <Stat label="Segment" value={`$${s.size}M`} />
              <Stat label="Growth" value={`${s.growth > 0 ? "+" : ""}${s.growth}%`} bad={s.growth < 0} />
              <Stat label="Your share" value={`${s.share}% (${s.change > 0 ? "+" : ""}${s.change} pts)`} bad={s.change < 0} />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 px-5 py-4">
            <Points items={s.points} />
            <PlayList plays={s.plays} />
          </div>
        </div>
      </div>
    </Shell>
  )
}

export function CompetitionView({ onBack }: { onBack: () => void }) {
  const comp = COMPETITORS[0]
  const seg = SEGMENTS.find((x) => x.id === comp.segmentId)!
  const rows = [
    { k: "Market share in gift sets", you: `${seg.share}%`, them: "22%", bad: true },
    { k: "Price index (you vs them)", you: "125", them: "100", bad: true },
    { k: "Sponsored slots on gift terms", you: "3 of 12", them: "7 of 12", bad: true },
    { k: "Rating", you: "4.6", them: "4.3" },
    { k: "In stock", you: "98%", them: "91%" },
  ]
  return (
    <Shell
      eyebrow={`Competition · ${seg.name} · last 4 weeks`}
      title={`${comp.headline}.`}
      sub={`They cut prices 20% and took 7 of 12 sponsored slots. You're down 0.6 pts, about ${fmtValue(comp.atRisk)} at risk this quarter.`}
      context={{ kind: "competitor", id: comp.id }}
      onBack={onBack}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className={BOX}>
          <div className="grid grid-cols-[minmax(0,1fr)_96px_96px] border-b border-slate-100 bg-slate-25 px-5 py-3 text-xs font-medium text-slate-500">
            <span>How you stack up</span>
            <span className="text-right">You</span>
            <span className="text-right">{comp.name}</span>
          </div>
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-[minmax(0,1fr)_96px_96px] border-t border-slate-100 px-5 py-3 text-sm first-of-type:border-t-0">
              <span className="text-slate-700">{r.k}</span>
              <span className={cn("text-right font-mono font-semibold", r.bad ? "text-error-600" : "text-success-700")}>{r.you}</span>
              <span className="text-right font-mono text-slate-700">{r.them}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-2 text-xs font-medium text-slate-500">Their moves</div>
            <Points items={comp.moves} />
          </div>
        </div>
        <div className={cn(BOX, "flex flex-col gap-4 px-5 py-4")}>
          <Points items={comp.points} />
          <PlayList plays={comp.plays} />
        </div>
      </div>
    </Shell>
  )
}

export function EventView({ onBack }: { onBack: () => void }) {
  const ev = NEXT_EVENT
  return (
    <Shell
      eyebrow={`Event readiness · ${ev.date} · ${ev.weeks} weeks out`}
      title={`${ev.name}: ${ev.levers.filter((l) => l.state !== "ready").length} of ${ev.levers.length} levers aren't ready, ${fmtBiz(ev.atStake)} at stake.`}
      sub={`Last year you lost ${fmtValue(ev.lastYear.lost)}, and the same risks are back.`}
      context={{ kind: "event" }}
      onBack={onBack}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <div className={BOX}>
            <div className="border-b border-slate-100 bg-slate-25 px-5 py-3 text-xs font-medium text-slate-500">Readiness by lever</div>
            {ev.levers.map((l) => (
              <div key={l.name} className="flex items-center gap-3 border-t border-slate-100 px-5 py-3 text-sm first-of-type:border-t-0">
                <ReadinessDot state={l.state} />
                <span className="w-20 font-medium text-slate-950">{l.name}</span>
                <span className="text-slate-700">{l.note}</span>
              </div>
            ))}
          </div>
          <div className={cn(BOX, "px-5 py-4")}>
            <div className="mb-2 text-xs font-medium text-slate-500">Last year&apos;s replay</div>
            <Points
              items={[
                <>
                  Lost <Num bad>−{fmtValue(ev.lastYear.lost)}</Num>
                </>,
                ...ev.lastYear.points,
              ]}
            />
          </div>
        </div>
        <div className={cn(BOX, "px-5 py-4")}>
          <PlayList plays={ev.plays} />
        </div>
      </div>
    </Shell>
  )
}

export function GrowViewSwitch({ view, onBack }: { view: GrowView; onBack: () => void }) {
  if (view === "market") return <MarketView onBack={onBack} />
  if (view === "competition") return <CompetitionView onBack={onBack} />
  return <EventView onBack={onBack} />
}
