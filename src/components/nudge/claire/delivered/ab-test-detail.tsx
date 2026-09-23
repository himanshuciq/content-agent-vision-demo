"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmtValue } from "../../data"
import { Funnel } from "./funnel"
import { Learnings } from "./learnings"
import type { AbTestCard } from "../../delivered-content-data"

const pct = (v: number) => `${v.toFixed(1)}%`
const sales = (v: number) => (v >= 1 ? `$${v.toFixed(1)}M` : `$${Math.round(v * 1000)}K`)

/** This test's lift counts for N weeks; the next change is tested against today's content, so its gain stacks on top. */
function LiftAddsUp({ t }: { t: AbTestCard }) {
  const total = t.lift + t.nextGain
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-slate-700">How this lift adds up</div>
      <div className="flex h-7 overflow-hidden rounded text-[11px] font-semibold">
        <div className="flex items-center bg-brand-500 px-2.5 text-white" style={{ width: `${(t.lift / total) * 100}%` }}>
          This test +{pct(t.lift)}
        </div>
        <div
          className="flex items-center border-2 border-l-0 border-dashed border-brand-300 px-2.5 text-brand-700"
          style={{ width: `${(t.nextGain / total) * 100}%` }}
        >
          Next +{pct(t.nextGain)}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-slate-600">
        This test&apos;s <b className="font-mono text-slate-900">+{pct(t.lift)}</b> counts for {t.weeks}{" "}weeks after each change goes live. The next
        change is tested against today&apos;s content, so its gain adds on top: if it adds <span className="font-mono">+{pct(t.nextGain)}</span>, your
        SKUs are <b className="font-mono text-slate-900">+{pct(total)}</b> ahead of the original.
      </p>
    </div>
  )
}

/** Foundational or retail readiness, opened: the story, the A/B wins and losses, how the lift adds up, the funnel, learnings, the math. */
export function AbTestDetail({ t, skuType }: { t: AbTestCard; skuType: string }) {
  const [showCalc, setShowCalc] = useState(false)
  const lost = t.tested - t.won

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[15px] leading-relaxed text-slate-800">
        {t.story[0]}
        <br />
        {t.story[1]}
      </p>

      <div className="flex flex-col gap-2.5">
        <div className="text-sm text-slate-700">New content vs old content, same weeks · A/B tests on the {t.tested} SKUs</div>
        <div className="flex max-w-[560px] flex-wrap gap-1.5" aria-label={`${t.won} won, ${lost} lost`}>
          {Array.from({ length: t.tested }, (_, i) => (
            <span key={i} className={cn("size-2.5 rounded-full", i < t.won ? "bg-brand-500" : "border-[1.5px] border-slate-300")} />
          ))}
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-mono font-semibold text-slate-950">{t.won}</span> won ·{" "}
          <span className="font-mono font-semibold text-slate-950">{lost}</span> lost and went back to old content ·{" "}
          <span className="font-mono text-base font-bold text-slate-950 tabular-nums">+{pct(t.lift)}</span> sales from new content across all{" "}
          {t.tested}
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 text-sm">
          <Check className="size-3.5 shrink-0 translate-y-0.5 text-success-600" />
          <span>
            <span className="font-medium text-slate-900">Same shoppers, same weeks:</span>{" "}
            <span className="text-slate-600">half saw old content, half saw new, so price, ads and season can&apos;t explain the lift</span>
          </span>
        </div>
      </div>

      <LiftAddsUp t={t} />

      <div className="border-t border-slate-100 pt-1">
        <Funnel rows={t.funnel} />
      </div>

      <Learnings items={t.learnings} applied={t.learningsApplied} />

      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setShowCalc((v) => !v)}
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          How we calculated
          <ChevronDown className={cn("size-3.5 transition-transform", showCalc && "rotate-180")} />
        </button>
        <Link
          href={`/content-results?type=${skuType}&period=quarter`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          See all {t.promisedSkus} SKUs
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {showCalc && (
        <ol className="flex list-decimal flex-col gap-2 rounded-lg bg-slate-25 py-3.5 pr-4 pl-9 text-[13px] leading-relaxed text-slate-600">
          <li>
            <span className="font-medium text-slate-900">What new content added: </span>
            in 50/50 A/B tests, new content sold <b className="font-mono text-slate-900">{pct(t.lift)}</b> more than old content, averaged across all{" "}
            {t.tested} SKUs.
          </li>
          <li>
            <span className="font-medium text-slate-900">What we expected: </span>
            <b className="font-mono text-slate-900">{pct(t.expectedLift)}</b>, {t.expectedFrom}. {t.nextExpected}
          </li>
          <li>
            <span className="font-medium text-slate-900">Promised: </span>
            <b className="font-mono text-slate-900">{pct(t.expectedLift)}</b> × <b className="font-mono text-slate-900">{sales(t.expectedSales)}</b>{" "}
            expected sales on {t.promisedSkus} SKUs this quarter ≈ <b className="font-mono text-slate-900">{fmtValue(t.promised)}</b>
          </li>
          <li>
            <span className="font-medium text-slate-900">Delivered: </span>
            <b className="font-mono text-slate-900">{pct(t.lift)}</b> × <b className="font-mono text-slate-900">{sales(t.actualSales)}</b> actual sales
            on the {t.liveSkus} live SKUs in the {t.weeks}{" "}weeks after each change went live ≈{" "}
            <b className="font-mono text-slate-900">{fmtValue(t.delivered)}</b>. The next change on these SKUs is tested against today&apos;s content,
            so its gain adds to this one.
          </li>
        </ol>
      )}
    </div>
  )
}
