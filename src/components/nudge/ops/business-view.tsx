"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { candleThumbnail } from "@/lib/candle-thumbnails"
import { BUSINESS, contentBatches, fmtBiz, launchedIds, opsBatches, opsSkus, skuById } from "../data"
import { AGENT_DOT } from "../agent-style"
import { useLive } from "../live-model"
import { useNudge } from "../nudge-context"
import { Points } from "../points"
import { useChat, useChatSource } from "../chat/inline-chat"
import type { AgentId } from "../types"
import { GAP_TREE, GAP_WEEK, nodesAt } from "./gap-data"
import type { Driver, GapNode } from "./gap-data"
import { ActionButton, GapAnalysis } from "./gap-view"

type Grain = "SKU" | "Category" | "Brand"

/** $M → "$5.8K" / "$240K" / "$2.1M"; signed when asked. */
const m = (v: number, signed = false) => {
  const a = Math.abs(v)
  const s = a >= 1 ? `$${+a.toFixed(2)}M` : a >= 0.1 ? `$${Math.round(a * 1000)}K` : `$${+(a * 1000).toFixed(1)}K`
  return signed ? `${v < 0 ? "−" : "+"}${s}` : s
}
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`

const TAG: Record<Driver["tag"], string> = { Live: "text-error-700", Resolved: "text-success-700", "Worth watching": "text-warning-700" }

interface Work {
  lever: AgentId
  label: string
  owner: string
  status: string
  tone: "todo" | "moving" | "done"
  /** Open it where it's worked: the ops queue here, Mike's page for content. */
  href?: string
  opsId?: string
}

/**
 * The work already in flight on a node, read from the same items as the queues:
 * ops issues that include its SKUs, content batches that include them, and for
 * brands and categories the inbox items its recommendations point to.
 */
function useWork() {
  const { approved, nudged, policy } = useNudge()
  const ops = opsBatches(policy)
  const content = contentBatches(policy, launchedIds(approved))
  return (n: GapNode): Work[] => {
    const opsIds = n.asin
      ? ops.filter((b) => opsSkus(b).some((s) => s.asin === n.asin)).map((b) => b.id)
      : n.recommendations.flatMap((r) => (r.action.kind === "inbox" ? [r.action.batchId] : []))
    const opsWork: Work[] = [...new Set(opsIds)].flatMap((id) => {
      const b = ops.find((x) => x.id === id)
      if (!b) return []
      const done = !!approved[b.id]
      return [{ lever: "ops" as AgentId, label: b.name, owner: "You", status: done ? "Sent" : "Drafted · not sent", tone: done ? ("done" as const) : ("todo" as const), opsId: b.id }]
    })
    const contentWork: Work[] = n.asin
      ? content
          .filter((b) => b.skuRows.some((r) => skuById(r.skuId).asin === n.asin))
          .map((b) => {
            const done = !!approved[b.id]
            const pinged = b.nudgeKey && nudged[b.nudgeKey]
            // Say where it stands in its own bucket: waiting on input is not "one approval away".
            const where = b.tier === "input" ? "Needs your team's input" : b.tier === "autopilot" ? "On autopilot" : "One approval away"
            const status = done ? (b.tier === "input" ? "Sent to Ally" : "Approved") : pinged ? `Nudged · ${where.toLowerCase()}` : where
            return { lever: "content" as AgentId, label: b.name, owner: "Mike", status, tone: done ? ("done" as const) : b.tier === "input" ? ("todo" as const) : ("moving" as const), href: "/mike" }
          })
      : []
    return [...contentWork, ...opsWork]
  }
}

const TONE = { todo: "text-warning-700", moving: "text-info-700", done: "text-success-700" }

/** Forward-looking hero for the business view: where Amazon lands, the gap, what's in flight, then this week. */
export function BusinessHero() {
  const live = useLive()
  const plan = BUSINESS.quarter.plan
  const pace = live.pace("quarter")
  const weekGap = GAP_TREE.eow.projected - GAP_TREE.eow.plan
  return (
    <div className="px-10 pt-4 pb-7">
      <div className="text-2xl font-semibold tracking-tight text-slate-700">
        Amazon is projected to land at <span className="font-mono text-slate-950">{fmtBiz(pace)}</span> this quarter.
      </div>
      <h1 className="mt-1 text-[40px] leading-tight font-bold tracking-tight text-slate-950">
        That&apos;s <span className="font-mono">{fmtBiz(plan - pace)}</span> short of plan. <span className="font-mono text-brand-600">{live.open.totalLabel}</span> of work is in flight to close it.
      </h1>
      <div className="mt-2 text-base text-slate-500">
        {live.open.byArea.map((a, i) => (
          <span key={a.agent}>
            {i > 0 && <span className="text-slate-300"> · </span>}
            <span className="font-semibold text-slate-700">{a.value}</span> in {a.agent}
          </span>
        ))}
        <span className="text-slate-300"> · </span>
        This week <span className={cn("font-mono font-semibold", weekGap < 0 ? "text-error-600" : "text-success-700")}>{m(weekGap, true)}</span> vs plan ({pct(GAP_TREE.eow.projected, GAP_TREE.eow.plan)})
      </div>
    </div>
  )
}

const GRID = "grid grid-cols-[minmax(0,1.5fr)_112px_112px_minmax(0,1.3fr)_minmax(0,1.4fr)] items-start gap-x-5"

/**
 * The quarterback view: top SKUs (or categories, or brands) against plan, why,
 * and whether the work to fix it is moving. Ranked by gap to plan, or by sales
 * when Settings says so. A row opens its causes, its work and the analysis.
 */
export function BusinessView({ onOpenOps }: { onOpenOps: (opsId: string) => void }) {
  const { businessSort } = useNudge()
  const { ask } = useChat()
  const workFor = useWork()
  const [grain, setGrain] = useState<Grain>("SKU")
  const [open, setOpen] = useState<string | null>(null)

  const rows = [...nodesAt(grain)].sort((a, b) =>
    businessSort === "sales" ? b.lastWeek.sales - a.lastWeek.sales : a.lastWeek.sales - a.lastWeek.plan - (b.lastWeek.sales - b.lastWeek.plan),
  )
  const analysis = (n: GapNode) => ({ q: `Run gap-to-plan analysis for ${n.name} for last week`, render: () => <GapAnalysis node={n} onInbox={onOpenOps} /> })
  const openNode = rows.find((r) => r.id === open)
  useChatSource(
    openNode
      ? { about: openNode.name, chips: [analysis(openNode)] }
      : { chips: [analysis(GAP_TREE), ...rows.slice(0, 2).map(analysis)] },
    `business-${open ?? "all"}-${grain}`,
  )

  return (
    <section className="px-10 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-950">Where you stand against plan</div>
          <div className="mt-0.5 text-sm text-slate-500">
            Last week, {GAP_WEEK.last} · ranked by {businessSort === "sales" ? "sales" : "gap to plan"} ·{" "}
            <Link href="/settings?tab=business" className="text-brand-700 hover:underline">
              change
            </Link>
          </div>
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-slate-25 p-1">
          {(["SKU", "Category", "Brand"] as Grain[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGrain(g)
                setOpen(null)
              }}
              className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors", grain === g ? "bg-white text-slate-950 shadow-xs ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800")}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <div className={cn(GRID, "border-b border-slate-100 bg-slate-25 px-5 py-3 text-xs font-medium text-slate-500")}>
          <span>{grain}</span>
          <span className="text-right">Last week vs plan</span>
          <span className="text-right">This week, projected</span>
          <span>Why</span>
          <span>Work in flight</span>
        </div>
        {rows.map((n) => {
          const gap = n.lastWeek.sales - n.lastWeek.plan
          const eow = n.eow.projected - n.eow.plan
          const top = [...n.drivers].sort((a, b) => (gap < 0 ? a.value - b.value : b.value - a.value))[0]
          const work = workFor(n)
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
                    <span className="block truncate text-xs text-slate-500">{n.asin ?? `${m(n.lastWeek.sales)} last week`}</span>
                  </span>
                </span>
                <span className="text-right">
                  <span className={cn("block font-mono font-semibold", gap < 0 ? "text-error-600" : "text-success-700")}>{m(gap, true)}</span>
                  <span className="block text-xs text-slate-500">{pct(n.lastWeek.sales, n.lastWeek.plan)} of plan</span>
                </span>
                <span className="text-right">
                  <span className={cn("block font-mono font-semibold", eow < 0 ? "text-error-600" : "text-success-700")}>{m(eow, true)}</span>
                  <span className="block text-xs text-slate-500">{pct(n.eow.projected, n.eow.plan)} of plan</span>
                </span>
                <span className="min-w-0">
                  {top && (
                    <>
                      <span className="block text-slate-950">{top.title}</span>
                      <span className={cn("block text-xs", TAG[top.tag])}>{top.tag}</span>
                    </>
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-1.5">
                  {work.length ? (
                    work.map((w) => (
                      <span key={w.label + w.lever} className="flex items-start gap-2">
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-sm", AGENT_DOT[w.lever])} />
                        <span className="min-w-0">
                          <span className="block truncate text-slate-950">{w.label}</span>
                          <span className="block text-xs text-slate-500">
                            {w.owner} · <span className={TONE[w.tone]}>{w.status}</span>
                          </span>
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">{gap >= 0 ? "On track" : "Nothing assigned"}</span>
                  )}
                </span>
              </div>
              {isOpen && (
                <div className="grid gap-6 border-t border-slate-100 bg-slate-25 px-5 py-5 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 text-xs font-medium text-slate-500">Why, ranked by dollars</div>
                    <div className="flex flex-col gap-2.5">
                      {[...n.drivers]
                        .sort((a, b) => a.value - b.value)
                        .map((d) => (
                          <div key={d.title} className="rounded-lg bg-white px-3.5 py-2.5 ring-1 ring-slate-200">
                            <div className="flex items-start justify-between gap-3 text-sm">
                              <span className="font-medium text-slate-950">{d.title}</span>
                              <span className={cn("shrink-0 font-mono font-semibold", d.value < 0 ? "text-error-600" : "text-success-700")}>{m(d.value, true)}</span>
                            </div>
                            <div className={cn("mt-0.5 text-xs", TAG[d.tag])}>{d.tag}</div>
                            <Points className="mt-1.5" items={d.points} />
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-medium text-slate-500">What to do</div>
                    <div className="flex flex-col gap-2.5">
                      {n.recommendations.map((r) => (
                        <div key={r.title} className="flex flex-col gap-2 rounded-lg bg-white px-3.5 py-2.5 ring-1 ring-slate-200">
                          <div className="text-sm font-medium text-slate-950">{r.title}</div>
                          <Points items={r.points} />
                          <ActionButton action={r.action} onInbox={onOpenOps} />
                        </div>
                      ))}
                      {work
                        .filter((w) => w.href)
                        .map((w) => (
                          <Link key={w.label} href={w.href!} className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
                            Open {w.owner}&apos;s queue: {w.label} →
                          </Link>
                        ))}
                      <button
                        type="button"
                        onClick={() => ask(analysis(n))}
                        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm text-brand-700 transition-colors hover:bg-brand-50"
                      >
                        <Sparkles className="size-3.5" /> Run gap-to-plan analysis
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
