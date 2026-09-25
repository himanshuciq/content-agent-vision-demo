"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { candleThumbnail } from "@/lib/candle-thumbnails"
import { BUSINESS, INFLIGHT, contentBatches, fmtBiz, launchedIds, opsBatches } from "../data"
import { AGENT_DOT } from "../agent-style"
import { useLive } from "../live-model"
import { playById } from "../market"
import { useLaunch } from "../market/plays"
import { useNudge } from "../nudge-context"
import { ChatThread, useChat, useChatSource } from "../chat/inline-chat"
import type { Chip } from "../chat/inline-chat"
import type { AgentId, Period } from "../types"
import { GAP_TREE, GAP_WEEK, nodesAt, skusUnder } from "./gap-data"
import type { Driver, Fix, GapNode } from "./gap-data"
import { GapAnalysis } from "./gap-view"

/** $M → "$5.8K" / "$240K" / "$2.1M"; signed when asked. */
const m = (v: number, signed = false) => {
  const a = Math.abs(v)
  const s = a >= 1 ? `$${+a.toFixed(2)}M` : a >= 0.1 ? `$${Math.round(a * 1000)}K` : `$${+(a * 1000).toFixed(1)}K`
  return signed ? `${v < 0 ? "−" : "+"}${s}` : s
}
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`
const PERIOD_WORDS: Record<Period, string> = { week: "this week", month: "this month", quarter: "this quarter", year: "this year" }
const STATE: Record<Driver["tag"], string> = { Live: "text-error-700", Resolved: "text-success-700", "Worth watching": "text-warning-700" }
const live = (d: Driver) => d.tag !== "Resolved"

/* ------------------------------------------------------------------------- */
/* Hero: follows the period switch, like Claire's                              */
/* ------------------------------------------------------------------------- */

export function BusinessHero() {
  const l = useLive()
  const { plan } = BUSINESS[l.period]
  const pace = l.pace(l.period)
  const weekGap = GAP_TREE.eow.projected - GAP_TREE.eow.plan
  return (
    <div className="px-10 pt-4 pb-7">
      <div className="text-2xl font-semibold tracking-tight text-slate-700">
        Amazon is projected to land at <span className="font-mono text-slate-950">{fmtBiz(pace)}</span> {PERIOD_WORDS[l.period]}.
      </div>
      <h1 className="mt-1 text-[40px] leading-tight font-bold tracking-tight text-slate-950">
        That&apos;s <span className="font-mono">{fmtBiz(plan - pace)}</span> short of your <span className="font-mono">{fmtBiz(plan)}</span> plan.{" "}
        <span className="font-mono text-brand-600">{l.open.totalLabel}</span> of work is in flight to close it.
      </h1>
      <div className="mt-2 text-base text-slate-500">
        {l.open.byArea.map((a, i) => (
          <span key={a.agent}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            <span className="font-semibold text-slate-700">{a.value}</span> in {a.agent}
          </span>
        ))}
        {l.period !== "week" && (
          <>
            <span className="text-slate-300"> · </span>
            This week <span className={cn("font-mono font-semibold", weekGap < 0 ? "text-error-600" : "text-success-700")}>{m(weekGap, true)}</span> vs plan
          </>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------- */
/* Fixes: what's in flight for a cause, named for a business reader, linked    */
/* ------------------------------------------------------------------------- */

interface FixView {
  lever: AgentId
  name: string
  owner: string
  status: string
  tone: "todo" | "moving" | "done"
  open: () => void
  openLabel: string
}

function useFixes(onOpenOps: (batchId: string, asin?: string) => void) {
  const { approved, nudged, policy } = useNudge()
  const { launch, isLaunched } = useLaunch()
  const ops = opsBatches(policy)
  const content = contentBatches(policy, launchedIds(approved))
  return (fix: Fix, asin?: string): FixView | undefined => {
    if (fix.kind === "ops") {
      const b = ops.find((x) => x.id === fix.id) ?? ops.find((x) => x.id.startsWith(fix.id))
      if (!b) return undefined
      const done = !!approved[b.id]
      return { lever: "ops", name: b.fixName ?? b.name, owner: "You", status: done ? "sent" : "drafted, not sent", tone: done ? "done" : "todo", open: () => onOpenOps(b.id, asin), openLabel: "Open" }
    }
    if (fix.kind === "content") {
      const b = content.find((x) => x.id === fix.id)
      if (!b) return undefined
      const done = !!approved[b.id]
      const pinged = b.nudgeKey && nudged[b.nudgeKey]
      const status = done ? (b.tier === "input" ? "sent to Ally" : "approved") : b.tier === "input" ? "waiting on your team" : pinged ? "nudged, waiting for approval" : "waiting for approval"
      return { lever: "content", name: b.fixName ?? b.name, owner: "Mike", status, tone: done ? "done" : b.tier === "input" ? "todo" : "moving", open: () => (window.location.href = `/mike?batch=${b.id}`), openLabel: "Open in Mike's queue" }
    }
    const p = playById(fix.id)
    if (!p) return undefined
    const on = isLaunched(p)
    return { lever: p.owner === "human" ? "content" : p.owner, name: p.what, owner: p.owner === "media" ? "Ally for Media" : "Ally", status: on ? "launched" : "ready to launch", tone: on ? "moving" : "todo", open: () => launch([p]), openLabel: on ? "Launched" : "Launch" }
  }
}

const TONE = { todo: "text-warning-700", moving: "text-info-700", done: "text-success-700" }

function FixLine({ f }: { f: FixView }) {
  return (
    <span className="flex items-start gap-2">
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-sm", AGENT_DOT[f.lever])} />
      <span className="min-w-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            f.open()
          }}
          className="text-left text-slate-950 underline decoration-slate-300 underline-offset-2 hover:text-brand-700 hover:decoration-brand-300"
        >
          {f.name}
        </button>
        <span className="block text-xs text-slate-500">
          {f.owner} · <span className={TONE[f.tone]}>{f.status}</span>
        </span>
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------------- */
/* The view                                                                   */
/* ------------------------------------------------------------------------- */

const GRID = "grid grid-cols-[minmax(0,1.4fr)_104px_minmax(0,1.3fr)_104px_minmax(0,1.6fr)] items-start gap-x-5"

/**
 * The quarterback view, weekly. A scope (all, a category or a brand) says what's
 * wrong in it, then its top SKUs behind plan: last week against plan and why,
 * this week's projection, and what's wrong right now paired with the fix in
 * flight. A row opens its full analysis, answered right under it.
 */
export function BusinessView({ onOpenOps }: { onOpenOps: (batchId: string, asin?: string) => void }) {
  const { businessSort, businessGroup } = useNudge()
  const { ask } = useChat()
  const fixFor = useFixes(onOpenOps)
  const [scopeId, setScopeId] = useState("overall")
  const [open, setOpen] = useState<string | null>(null)
  const [all, setAll] = useState(false)

  const scopes = [...nodesAt(businessGroup)].sort((a, b) => a.lastWeek.sales - a.lastWeek.plan - (b.lastWeek.sales - b.lastWeek.plan))
  const scope = scopes.find((s) => s.id === scopeId) ?? GAP_TREE
  const gapOf = (n: GapNode) => n.lastWeek.sales - n.lastWeek.plan
  const ranked = skusUnder(scope)
    .filter((n) => (businessSort === "sales" ? true : gapOf(n) < 0))
    .sort((a, b) => (businessSort === "sales" ? b.lastWeek.sales - a.lastWeek.sales : gapOf(a) - gapOf(b)))
  const rows = all ? ranked : ranked.slice(0, 5)

  const chipsFor = (n: GapNode): Chip[] => [{ q: `Run gap-to-plan analysis for ${n.name} for last week`, render: () => <GapAnalysis node={n} onInbox={(id) => onOpenOps(id, n.asin)} /> }]
  const openNode = rows.find((r) => r.id === open)
  // The bar follows what's open: questions about the open row are answered under it.
  useChatSource(openNode ? { about: openNode.name, anchor: openNode.id, chips: chipsFor(openNode) } : { about: scope.id === "overall" ? undefined : scope.name, chips: chipsFor(scope) }, `business-${open ?? scope.id}`)

  const scopeGap = gapOf(scope)
  const causes = [...scope.drivers].sort((a, b) => a.value - b.value)

  return (
    <section className="px-10 pb-10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-slate-500">Where the gap is</span>
        {[GAP_TREE, ...scopes].map((s) => {
          const g = gapOf(s)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setScopeId(s.id)
                setOpen(null)
                setAll(false)
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                scope.id === s.id ? "border-slate-300 bg-slate-100 text-slate-950" : "border-slate-200 text-slate-600 hover:border-slate-300",
              )}
            >
              {s.id === "overall" ? "All" : s.name}
              <span className={cn("font-mono text-xs font-semibold", g < 0 ? "text-error-600" : "text-success-700")}>{m(g, true)}</span>
            </button>
          )
        })}
      </div>

      {/* What's wrong in this scope, before its SKUs. */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="text-lg font-semibold text-slate-950">
            {scope.id === "overall" ? "Amazon" : scope.name} · last week <span className={cn("font-mono", scopeGap < 0 ? "text-error-600" : "text-success-700")}>{m(scopeGap, true)}</span>{" "}
            <span className="text-base font-normal text-slate-500">vs plan ({pct(scope.lastWeek.sales, scope.lastWeek.plan)})</span>
          </div>
          <div className="text-sm text-slate-500">
            This week, projected <span className={cn("font-mono font-semibold", scope.eow.projected < scope.eow.plan ? "text-error-600" : "text-success-700")}>{m(scope.eow.projected - scope.eow.plan, true)}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {causes.map((d) => {
            const f = d.fix && fixFor(d.fix)
            return (
              <div key={d.title} className="grid grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] items-start gap-4 text-sm">
                <span>
                  <span className="text-slate-950">{d.title}</span> <span className={cn("text-xs", STATE[d.tag])}>· {d.tag}</span>
                </span>
                <span className={cn("text-right font-mono font-semibold", d.value < 0 ? "text-error-600" : "text-success-700")}>{m(d.value, true)}</span>
                <span>{f ? <FixLine f={f} /> : <span className="text-slate-500">{d.tag === "Resolved" ? "No action needed" : d.tag === "Worth watching" ? "Watching · no action yet" : "See the SKUs below"}</span>}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-950">
            {businessSort === "sales" ? "Top SKUs by sales" : `Top SKUs behind plan`}
            {scope.id !== "overall" && <span className="font-normal text-slate-500"> in {scope.name}</span>}
          </div>
          <div className="mt-0.5 text-sm text-slate-500">
            Weekly view · last week {GAP_WEEK.last} and this week ·{" "}
            <Link href="/settings?tab=business" className="text-brand-700 hover:underline">
              ranking
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        <div className={cn(GRID, "border-b border-slate-100 bg-slate-25 px-5 py-3 text-xs font-medium text-slate-500")}>
          <span>SKU</span>
          <span className="text-right">Last week vs plan</span>
          <span>Why last week</span>
          <span className="text-right">This week, projected</span>
          <span>Right now → the fix</span>
        </div>
        {rows.map((n) => {
          const gap = gapOf(n)
          const eow = n.eow.projected - n.eow.plan
          const byValue = [...n.drivers].sort((a, b) => (gap < 0 ? a.value - b.value : b.value - a.value))
          const why = byValue[0]
          const now = byValue.filter(live)
          const isOpen = open === n.id
          return (
            <Fragment key={n.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen(isOpen ? null : n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(isOpen ? null : n.id)}
                className={cn(GRID, "cursor-pointer border-t border-slate-100 px-5 py-3.5 text-sm outline-none first-of-type:border-t-0 hover:bg-slate-25", isOpen && "bg-slate-25")}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <ChevronRight className={cn("-ml-1 size-4 shrink-0 text-slate-400 transition-transform", isOpen && "rotate-90")} />
                  {n.asin && <img src={candleThumbnail(n.asin)} alt="" className="size-8 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />}
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-slate-950">{n.name}</span>
                    <span className="block truncate font-mono text-xs text-slate-500">{n.asin}</span>
                  </span>
                </span>
                <span className="text-right">
                  <span className={cn("block font-mono font-semibold", gap < 0 ? "text-error-600" : "text-success-700")}>{m(gap, true)}</span>
                  <span className="block text-xs text-slate-500">{pct(n.lastWeek.sales, n.lastWeek.plan)} of plan</span>
                </span>
                <span className="min-w-0">
                  {why && (
                    <>
                      <span className="block text-slate-950">{why.title}</span>
                      <span className={cn("block text-xs", STATE[why.tag])}>{why.tag}</span>
                    </>
                  )}
                </span>
                <span className="text-right">
                  <span className={cn("block font-mono font-semibold", eow < 0 ? "text-error-600" : "text-success-700")}>{m(eow, true)}</span>
                  <span className="block text-xs text-slate-500">{pct(n.eow.projected, n.eow.plan)} of plan</span>
                </span>
                <span className="flex min-w-0 flex-col gap-2">
                  {now.length ? (
                    now.slice(0, 2).map((d) => {
                      const f = d.fix && fixFor(d.fix, n.asin)
                      return (
                        <span key={d.title} className="flex flex-col gap-1">
                          <span className="text-slate-700">{d === why ? "Still live" : d.title}</span>
                          {f ? <FixLine f={f} /> : <span className="text-xs text-slate-500">{d.tag === "Worth watching" ? "Watching · no action yet" : "No fix in flight"}</span>}
                        </span>
                      )
                    })
                  ) : (
                    <span className="text-success-700">{gap < 0 ? "Resolved · no action needed" : "On track"}</span>
                  )}
                  {now.length > 2 && <span className="text-xs text-slate-500">+{now.length - 2} more</span>}
                </span>
              </div>
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-25 px-5 py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {chipsFor(n).map((c) => (
                      <button
                        key={c.q}
                        type="button"
                        onClick={() => ask(c, n.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm text-brand-700 transition-colors hover:bg-brand-50"
                      >
                        <Sparkles className="size-3.5" /> Run gap-to-plan analysis
                      </button>
                    ))}
                    <span className="text-xs text-slate-500">or ask about {n.name} in the bar below</span>
                  </div>
                  {/* Answers about this SKU appear here, under its row. */}
                  <ChatThread anchor={n.id} className="mt-4" />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
      {ranked.length > 5 && (
        <button type="button" onClick={() => setAll((a) => !a)} className="mt-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
          {all ? "Show the top 5" : `Show all ${ranked.length} SKUs ${businessSort === "sales" ? "" : "behind plan"}`}
          <ArrowRight className="size-3.5" />
        </button>
      )}
    </section>
  )
}

/** For the hero's period label elsewhere. */
export const periodName = (p: Period) => INFLIGHT[p].name
