"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Info, Send, Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { COMPETITORS, MARKET, NEXT_EVENT, SEGMENTS } from "../market"
import type { Play } from "../market"
import { agentPlays, annual, humanPlays, useLaunch } from "./plays"

/** What the panel is about: a segment, a competitor, or the next event. */
export type PanelContext = { kind: "segment"; id: string } | { kind: "competitor"; id: string } | { kind: "event" }

interface Action {
  label: string
  /** Plays this action launches; otherwise it asks a follow-up or confirms a watch. */
  plays?: Play[]
  ask?: string
  watch?: string
}

/** The answer contract: verdict, why (and what was ruled out), if we do nothing, next actions, trust. */
interface Answer {
  verdict: string
  why: string
  ifNothing?: string
  actions: Action[]
  trust: string
}

const aboutLabel = (c: PanelContext) =>
  c.kind === "segment" ? SEGMENTS.find((s) => s.id === c.id)!.name : c.kind === "competitor" ? COMPETITORS.find((x) => x.id === c.id)!.name : NEXT_EVENT.name

/** Suggested questions per context; typed questions land on the closest one. */
function suggestions(c: PanelContext): string[] {
  if (c.kind === "segment") return ["Who's taking share here, and what should we do?", "Break this down by competitor", "What if we do nothing?"]
  if (c.kind === "competitor") return ["What did they change, and what should we do?", "Should we match their price?", "Which of our SKUs are hit?"]
  return ["Are we ready, and what's at risk?", "What went wrong last year?", "What should I approve first?"]
}

function answerFor(c: PanelContext, q: string): Answer {
  const i = Math.max(0, suggestions(c).indexOf(q))
  if (c.kind === "segment") {
    const s = SEGMENTS.find((x) => x.id === c.id)!
    const agents = agentPlays(s.plays)
    const briefs = humanPlays(s.plays)
    const launch: Action[] = [
      ...(agents.length ? [{ label: `Launch the ${agents.length === 1 ? "play" : `${agents.length} plays`} · +${fmtValue(annual(agents))} a year`, plays: agents }] : []),
      ...briefs.map((b) => ({ label: "Draft the NPI brief", plays: [b] })),
    ]
    const adds = Math.round(s.size * (s.growth / 100))
    if (i === 1)
      return {
        verdict: `In ${s.name.toLowerCase()}, Brightwick holds 31% and Lumen & Co 18%. You hold ${s.share}%.`,
        why: "Brightwick leads on sponsored slots and the clean-burn wording; Lumen & Co leads on price per ounce. Neither has a 12 oz jar at the median price, which is the gap an NPI brief would fill.",
        actions: [...launch, { label: "Watch this segment weekly", watch: s.name }],
        trust: "Medium confidence: competitor sales are estimated from share and rank.",
      }
    if (i === 2)
      return {
        verdict: `You'd stay near ${s.share}% while the segment adds about $${adds}M next year.`,
        why: `The segment grows ${s.growth}% against ${MARKET.growth}% for the category, so standing still means losing ground.`,
        actions: launch,
        trust: "Projection from the last 12 months' trend; shown as a direction, not a forecast.",
      }
    return {
      verdict:
        s.change < 0
          ? `Brightwick is. They hold 31% and 7 of 12 sponsored slots on ${s.name.toLowerCase()} terms.`
          : `No one is taking share from you here: you're ${s.change > 0 ? "gaining" : "flat"} at ${s.share}%.`,
      why:
        s.plays.length > 0
          ? `The segment grew ${s.growth}%, against ${MARKET.growth}% for the category. You hold ${s.share}% because your PDPs don't use the words shoppers search, and your only pack is priced above the median. Ruled out: availability (in stock all period) and ratings (above the segment).`
          : `The segment is ${s.growth > MARKET.growth ? "growing faster than" : "growing slower than"} the category. No play beats holding position here.`,
      ifNothing: s.plays.length ? `You stay near ${s.share}% while the segment adds about $${adds}M next year.` : undefined,
      actions: [...launch, { label: "Break this down by competitor", ask: suggestions(c)[1] }, { label: "Watch this segment weekly", watch: s.name }],
      trust: `Medium confidence: competitor sales are estimated from share and rank. Data as of ${MARKET.asOf}.`,
    }
  }
  if (c.kind === "competitor") {
    const comp = COMPETITORS.find((x) => x.id === c.id)!
    const agents = agentPlays(comp.plays)
    const brief = humanPlays(comp.plays)[0]
    if (i === 1)
      return {
        verdict: "Not across the range. Match only where you're losing the most, or hold and win on slots and content.",
        why: "A full match on 8 hero gift sets costs about $40K of margin this quarter to protect $180K of sales. Holding price and winning back sponsored slots recovers most of it without the margin hit. Ally won't change prices; this is your call.",
        actions: [...(brief ? [{ label: "Draft the pricing brief", plays: [brief] }] : []), ...(agents.length ? [{ label: "Launch the slot and content plays", plays: agents }] : [])],
        trust: "Margin estimate uses your cost file; competitor promo funding isn't visible.",
      }
    if (i === 2)
      return {
        verdict: "8 hero gift sets carry most of the risk: they compete head to head with Brightwick's cut SKUs.",
        why: "Those 8 lost the most sponsored slots and conversion since the cut. The other gift sets aren't priced against Brightwick's.",
        actions: agents.length ? [{ label: "Launch the plays for those 8 SKUs", plays: agents }] : [],
        trust: "SKU match from co-listing in search results.",
      }
    return {
      verdict: `${comp.name} cut gift-set prices 20% and took 7 of 12 sponsored slots. You're down 0.6 pts, about ${fmtValue(comp.atRisk)} at risk this quarter.`,
      why: "Your gift sets now sit 25% above theirs, and their ads crowd you out on gift terms. Your branded terms still hold. Their stock covers about 3 weeks at this pace, so the cut may be temporary.",
      ifNothing: `You lose about ${fmtValue(comp.atRisk)} this quarter, most of it in the gift-giving weeks.`,
      actions: [
        ...(agents.length ? [{ label: `Launch ${agents.length} plays · +${fmtValue(annual(agents))} a year`, plays: agents }] : []),
        ...(brief ? [{ label: "Draft the pricing brief", plays: [brief] }] : []),
        { label: "Should we match their price?", ask: suggestions(c)[1] },
        { label: `Watch ${comp.name} weekly`, watch: comp.name },
      ],
      trust: "Medium confidence: competitor sales and promo funding are estimated.",
    }
  }
  const ev = NEXT_EVENT
  const risks = ev.levers.filter((l) => l.state !== "ready")
  if (i === 1)
    return {
      verdict: `Last ${ev.name} cost you ${fmtValue(ev.lastYear.lost)} in sales you could have had.`,
      why: `${ev.lastYear.points.join("; ")}. All three are the same risks showing again this year.`,
      actions: [{ label: `Launch the ${ev.plays.length} readiness plays`, plays: ev.plays }],
      trust: "From last year's sales, deals and sponsored-slot crawls.",
    }
  if (i === 2)
    return {
      verdict: "Stock first: the PO expedite for 6 hero SKUs. It protects the most sales and takes the longest to land.",
      why: "Vendor managers need 2–3 weeks to move a PO. Deals come next (they need retailer approval), then the content, which Ally can finish in days.",
      actions: [{ label: "Launch the stock and deal plays", plays: ev.plays.filter((p) => p.owner === "ops") }],
      trust: "Lead times from your last 12 POs.",
    }
  return {
    verdict: `${ev.name} is ${ev.weeks} weeks out and ${risks.length} of ${ev.levers.length} levers aren't ready. About $${ev.atStake}M is at stake.`,
    why: `${risks.map((r) => `${r.name}: ${r.note.charAt(0).toLowerCase()}${r.note.slice(1)}`).join(". ")}. Media is planned and paced.`,
    ifNothing: `Expect a repeat of last year: about ${fmtValue(ev.lastYear.lost)} lost.`,
    actions: [
      { label: `Launch the ${ev.plays.length} readiness plays · +${fmtValue(ev.plays.reduce((n, p) => n + p.quarter, 0))}`, plays: ev.plays },
      { label: "What went wrong last year?", ask: suggestions(c)[1] },
      { label: `Remind me weekly until ${ev.name}`, watch: ev.name },
    ],
    trust: "Readiness from today's crawl, stock cover and deal setup.",
  }
}

/** Typed questions land on the suggestion sharing the most words with them. */
function match(c: PanelContext, text: string) {
  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  let best = suggestions(c)[0]
  let score = 0
  for (const q of suggestions(c)) {
    const n = words.filter((w) => q.toLowerCase().includes(w)).length
    if (n > score) [best, score] = [q, n]
  }
  return best
}

function AnswerCard({ a, onAsk }: { a: Answer; onAsk: (q: string) => void }) {
  const { launch, isLaunched } = useLaunch()
  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-white px-4 py-3.5 text-sm ring-1 ring-slate-200">
      <p className="font-semibold text-slate-950">{a.verdict}</p>
      <p className="leading-relaxed text-slate-700">{a.why}</p>
      {a.ifNothing && <p className="leading-relaxed text-slate-700">If nothing changes: {a.ifNothing}</p>}
      <div className="mt-1 flex flex-col gap-1.5">
        {a.actions.map((act, i) => {
          const done = act.plays?.every(isLaunched)
          return (
            <button
              key={act.label}
              type="button"
              disabled={done}
              onClick={() => {
                if (act.plays) launch(act.plays)
                else if (act.ask) onAsk(act.ask)
                else if (act.watch) toast.success(`Watching ${act.watch}. Ally will tell you Monday if it moves.`, { position: "top-right" })
              }}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                done
                  ? "bg-success-50 text-success-700"
                  : i === 0 && act.plays
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:bg-white",
              )}
            >
              {done ? `✓ ${act.label.replace(/^Launch|^Draft/, (m) => (m === "Launch" ? "Launched" : "Drafted"))}` : act.label}
              {!done && <ArrowRight className="size-3.5 shrink-0" />}
            </button>
          )
        })}
      </div>
      <div className="mt-1 flex items-start gap-1.5 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
        <Info className="mt-px size-3 shrink-0" /> {a.trust}
      </div>
    </div>
  )
}

/**
 * Ally beside a view: one thread per context, opened with the first suggested
 * question answered. The context chip shows what it's about; picking another
 * bubble or card switches the thread. Actions change the page (plays land on
 * the bridge and in the owner's inbox).
 */
export function AllyPanel({ context, onClose }: { context: PanelContext; onClose: () => void }) {
  const key = JSON.stringify(context)
  const [threads, setThreads] = useState<Record<string, string[]>>({})
  const [text, setText] = useState("")
  const listRef = useRef<HTMLDivElement>(null)
  const asked = threads[key] ?? [suggestions(context)[0]]

  // Scroll the thread itself to the newest answer, never the page behind it.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [asked.length, key])

  function ask(q: string) {
    setThreads((t) => ({ ...t, [key]: [...(t[key] ?? [suggestions(context)[0]]), q] }))
  }

  const unasked = suggestions(context).filter((q) => !asked.includes(q))

  return (
    <aside className="sticky top-0 flex h-screen max-h-[calc(100vh-3rem)] w-[380px] shrink-0 flex-col border-l border-slate-200 bg-slate-25">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Sparkles className="size-4 text-brand-600" /> Ask Ally
        </span>
        <button type="button" onClick={onClose} aria-label="Close Ask Ally" className="text-slate-400 hover:text-slate-700">
          <X className="size-4" />
        </button>
      </div>
      <div ref={listRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
        <span className="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">About: {aboutLabel(context)}</span>
        {asked.map((q, i) => (
          <div key={`${q}-${i}`} className="flex flex-col gap-3">
            <div className="ml-8 rounded-xl bg-brand-500 px-3.5 py-2.5 text-white">{q}</div>
            <AnswerCard a={answerFor(context, q)} onAsk={ask} />
          </div>
        ))}
        {unasked.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {unasked.map((q) => (
              <button key={q} type="button" onClick={() => ask(q)} className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300">
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
      <form
        className="border-t border-slate-200 p-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          ask(match(context, text))
          setText("")
        }}
      >
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200 focus-within:ring-brand-300">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Ask about ${aboutLabel(context).toLowerCase()}`}
            className="flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
          />
          <button type="submit" aria-label="Ask" className="text-brand-500 hover:text-brand-700">
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </aside>
  )
}
