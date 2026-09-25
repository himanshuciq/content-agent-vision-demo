"use client"

import { useEffect, useState } from "react"
import { Check, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"
import { useNudge } from "../nudge-context"
import { PRIMARY } from "../mike/buttons"
import { AS_OF, fmtValue, periodEnd } from "../data"
import type { OpsBatch } from "../data"
import { daysUntil } from "../model"
import { EmailDraft, SellerEvidence, SkillsTrace } from "./ops-evidence"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface OpsBatchDetailProps {
  batch: OpsBatch
  onAction: (batch: OpsBatch) => void
}

/** A field only Michelle's team can fill: what Ally drafted, then a full-width box. Same look as Mike's input fields. */
function InputRow({ item }: { item: NonNullable<OpsBatch["inputs"]>[number] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-warning-200">
      <div className="flex items-center justify-between gap-3 border-b border-warning-100 bg-warning-50 px-5 py-2.5">
        <span className="text-sm font-semibold text-slate-950">{item.label}</span>
        <span className="font-mono text-[11px] tracking-wide text-warning-700 uppercase">Your input</span>
      </div>
      <div className="px-5 py-4">
        <div className="text-sm text-slate-500">{item.detail}</div>
        <input
          placeholder={item.placeholder}
          className="mt-3 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
      </div>
    </div>
  )
}

/**
 * Right pane for an ops batch, laid out like Mike's: type and name, value, what
 * Ally caught (or fixes on its own), then one action. One approval away: a single
 * sign-off Ally sends for you. Needs your input: review the items only your team
 * can answer, then send them to Ally. On autopilot: nothing to do.
 */
export function OpsBatchDetail({ batch, onAction }: OpsBatchDetailProps) {
  const { approved } = useNudge()
  const done = !!approved[batch.id]
  const [reviewing, setReviewing] = useState(false)
  const skus = batch.sellerSkus ?? []
  const [skuIdx, setSkuIdx] = useState(0)
  // One-by-one items: every SKU gets its own look before the escalation goes.
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  useEffect(() => {
    setReviewing(false)
    setSkuIdx(0)
    setChecked({})
  }, [batch.id])
  const sku = skus[Math.min(skuIdx, skus.length - 1)]
  const each = batch.mode === "each"
  const allChecked = skus.every((x) => checked[x.asin])
  const daily = fmtValue(batch.approveValue / Math.max(daysUntil(periodEnd("quarter"), AS_OF), 1))
  function send() {
    onAction(batch)
    toast.success(batch.email ? `Sent to ${batch.email.to}, ${batch.email.role} · evidence attached` : batch.doneLabel, { position: "top-right" })
  }

  return (
    <div className="flex min-w-0 flex-col px-10 py-8">
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-500">
            {batch.type}
            {batch.partLabel && ` · ${batch.partLabel}`}
          </div>
          <div className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{batch.name}</div>
          {batch.skills && (
            <div className="mt-2">
              <SkillsTrace skills={batch.skills} />
            </div>
          )}
          <div className="mt-1.5 text-sm text-slate-500">
            {batch.team} · {batch.skus} {batch.tier === "input" ? batch.inputNoun : "SKUs"}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className={`font-mono text-[28px] font-bold tracking-tight tabular-nums ${done ? "text-success-700" : "text-slate-950"}`}>+{batch.value}</div>
          <div className="mt-0.5 text-sm text-slate-500">
            {batch.tier === "autopilot" ? "leakage prevented this quarter" : done ? "sent" : "projected leakage prevented"}
          </div>
          {batch.urgent && !done && <div className="mt-0.5 font-mono text-sm font-semibold text-error-600">−{daily} a day</div>}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950">
          {batch.tier === "autopilot" ? <RefreshCw className="size-4 text-info-600" /> : <Search className="size-4 text-brand-600" />}
          {batch.tier === "autopilot" ? "What Ally fixes automatically" : "What Ally caught"}
        </div>
        {batch.fixes ? (
          batch.fixes.map((f, i) => (
            <div key={f.text} className={i > 0 ? "flex items-start gap-3 border-t border-slate-100 px-5 py-3.5" : "flex items-start gap-3 px-5 py-3.5"}>
              <Check className="mt-0.5 size-4 shrink-0 text-success-600" />
              <span className="flex-1 text-sm font-medium text-slate-950">{f.text}</span>
              <span className="font-mono text-sm font-semibold text-slate-950 tabular-nums">{f.count}</span>
              <span className="-ml-2 text-xs text-slate-500">this quarter</span>
            </div>
          ))
        ) : (
          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-950">{batch.detected}</p>
            {batch.evidence.length > 0 && (
              <div className="mt-4 rounded-lg bg-slate-25 p-4">
                {batch.exampleSku && (
                  <div className="text-xs font-medium text-slate-500">
                    Lead example · <span className="font-mono">{batch.exampleSku}</span> {batch.exampleName}
                  </div>
                )}
                <ul className={batch.exampleSku ? "mt-2.5 space-y-1.5" : "space-y-1.5"}>
                  {batch.evidence.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-slate-400" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        {batch.tier === "autopilot" ? (
          <div className="flex items-start gap-3 rounded-xl border border-info-100 bg-info-50 px-5 py-4 text-sm text-slate-700">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-info-600" />
            Running on autopilot. {batch.detected}
          </div>
        ) : done ? (
          <div className="flex items-center gap-2 text-[15px] font-medium text-success-700">
            <Check className="size-4" />
            {batch.doneLabel}
          </div>
        ) : batch.tier === "input" ? (
          <div className="flex flex-col gap-4 rounded-xl border border-warning-200 bg-warning-50 px-5 py-4">
            <div className="text-sm text-slate-700">
              {batch.inputCount} {batch.inputNoun} need something only your team has. Ally files the rest as soon as you send them.
            </div>
            {!reviewing && (
              <button type="button" onClick={() => setReviewing(true)} className={`${PRIMARY} w-fit`}>
                Review {batch.inputCount} {batch.inputNoun}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {sku && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-sm font-medium text-slate-500">SKUs ({skus.length})</span>
                  {skus.map((x, i) => (
                    <button
                      key={x.asin}
                      type="button"
                      onClick={() => setSkuIdx(i)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
                        i === skuIdx ? "border-slate-300 bg-slate-100 text-slate-950" : "border-slate-200 text-slate-600 hover:border-slate-300",
                      )}
                    >
                      {checked[x.asin] && <Check className="size-3.5 text-success-600" />}
                      {x.name.split(",")[0]}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-mono">{sku.asin}</span> · {sku.name}
                </div>
                <SellerEvidence sku={sku} />
                {each && (
                  <button
                    type="button"
                    onClick={() => {
                      setChecked((c) => ({ ...c, [sku.asin]: true }))
                      if (skuIdx < skus.length - 1) setSkuIdx(skuIdx + 1)
                    }}
                    disabled={!!checked[sku.asin]}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800 hover:border-brand-300 hover:text-brand-700 disabled:border-success-200 disabled:bg-success-50 disabled:text-success-700"
                  >
                    <Check className="size-4" />
                    {checked[sku.asin] ? "Checked" : skuIdx < skus.length - 1 ? "Looks right · next SKU" : "Looks right"}
                  </button>
                )}
              </div>
            )}
            {batch.email && <EmailDraft key={batch.id} email={batch.email} fill={{ n: String(batch.skus), daily }} />}
            <div className="flex flex-col gap-3">
              {batch.reassure && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <ShieldCheck className="size-4 shrink-0 text-success-600" />
                  {batch.reassure}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={send} disabled={each && !allChecked} className={cn(PRIMARY, "disabled:opacity-50")}>
                  {batch.action}
                  {each ? ` · ${batch.skus} hero SKUs` : ""}
                </button>
                {each && !allChecked && (
                  <span className="text-sm text-slate-500">
                    Check each hero SKU first · {skus.filter((x) => checked[x.asin]).length} of {skus.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {reviewing && !done && batch.inputs && (
        <div className="mt-6 flex flex-col gap-3">
          {batch.inputs.map((item) => (
            <InputRow key={item.label} item={item} />
          ))}
          <div className="text-xs text-slate-500">
            Showing {batch.inputs.length} of {batch.inputCount}
          </div>
          <div className="mt-2 flex items-center gap-4 rounded-xl border border-warning-200 bg-warning-50 px-6 py-5">
            <div className="min-w-0 flex-1 text-sm font-semibold text-slate-950">Filled in? Ally files every claim and tells you when they land.</div>
            <button
              type="button"
              onClick={() => {
                onAction(batch)
                toast.success(`Sent to Ally. ${batch.doneLabel}.`, { position: "top-right" })
              }}
              className={PRIMARY}
            >
              Send to Ally
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
