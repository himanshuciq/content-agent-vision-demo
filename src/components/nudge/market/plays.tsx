"use client"

import { Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { fmtValue } from "../data"
import { useNudge } from "../nudge-context"
import type { Play } from "../market"

const OWNER: Record<Play["owner"], string> = { content: "Ally for Content", media: "Ally for Media", ops: "Ally for Ops", human: "Your team" }
/** Where a launched play lands, said on the confirmation. */
const LANDS: Record<Play["owner"], string> = {
  content: "in Mike's inbox, one approval away",
  media: "with Ally for Media, one approval away",
  ops: "in Michelle's queue, one approval away",
  human: "in Reports as a brief",
}

/** Launch state for plays: a launched play is a work item on the bridge ("launch:<id>" in the shared state). */
export function useLaunch() {
  const { approved, approve } = useNudge()
  const isLaunched = (p: Play) => !!approved[`launch:${p.id}`]
  function launch(plays: Play[]) {
    const fresh = plays.filter((p) => !isLaunched(p))
    fresh.forEach((p) => approve(`launch:${p.id}`))
    if (fresh.length) {
      const agents = fresh.filter((p) => p.owner !== "human")
      toast.success(
        agents.length
          ? `${agents.length} ${agents.length === 1 ? "play" : "plays"} launched · +${fmtValue(agents.reduce((n, p) => n + p.quarter, 0))} this quarter, ${
              new Set(agents.map((p) => p.owner)).size === 1 ? LANDS[agents[0].owner] : "one approval away on your bridge"
            }`
          : "Brief drafted · in Reports",
        { position: "top-right" },
      )
    }
  }
  return { isLaunched, launch }
}

export const agentPlays = (plays: Play[]) => plays.filter((p) => p.owner !== "human")
export const humanPlays = (plays: Play[]) => plays.filter((p) => p.owner === "human")
export const annual = (plays: Play[]) => plays.reduce((n, p) => n + p.annual, 0)
/** Event plays land inside the quarter; the rest are yearly run-rate gains. */
export const unit = (plays: Play[]) => (plays.every((p) => p.annual === p.quarter) ? "this quarter" : "a year")

/** The plays for a finding, then the two actions: launch the agents' plays, draft the brief. */
export function PlayList({ plays }: { plays: Play[] }) {
  const { isLaunched, launch } = useLaunch()
  const agents = agentPlays(plays)
  const briefs = humanPlays(plays)
  const pending = agents.filter((p) => !isLaunched(p))
  if (!plays.length) return <div className="text-sm text-slate-500">No move needed here.</div>
  return (
    <div className="flex flex-col">
      <div className="text-xs font-medium text-slate-500">What Ally can do</div>
      {plays.map((p) => (
        <div key={p.id} className="flex items-start justify-between gap-3 border-t border-slate-100 py-2.5 first-of-type:border-t-0">
          <div className="min-w-0">
            <div className="text-sm text-slate-950">{p.what}</div>
            <div className="mt-0.5 text-xs text-slate-500">
              {OWNER[p.owner]}
              {isLaunched(p) && <span className="ml-1.5 font-medium text-success-700">· {p.owner === "human" ? "Drafted" : "Launched"}</span>}
            </div>
          </div>
          <span className="shrink-0 text-right">
            <span className="block font-mono text-sm font-semibold text-slate-950">+{fmtValue(p.annual)}</span>
            <span className="block text-[11px] text-slate-400">{unit([p])}</span>
          </span>
        </div>
      ))}
      <div className="mt-3 flex flex-wrap gap-2">
        {agents.length > 0 &&
          (pending.length ? (
            <button type="button" onClick={() => launch(pending)} className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
              Launch {pending.length} {pending.length === 1 ? "play" : "plays"} · +{fmtValue(annual(pending))} {unit(pending)}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 py-2.5 text-sm font-medium text-success-700">
              <Check className="size-4" /> Plays launched
            </span>
          ))}
        {briefs.map((b) => (
          <button
            key={b.id}
            type="button"
            disabled={isLaunched(b)}
            onClick={() => launch([b])}
            className={cn("rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50", isLaunched(b) && "opacity-60")}
          >
            {isLaunched(b) ? "Brief drafted" : b.what.startsWith("NPI") ? "Draft the NPI brief" : "Draft the pricing brief"}
          </button>
        ))}
      </div>
    </div>
  )
}
