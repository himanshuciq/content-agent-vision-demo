"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ResetDemoButton } from "../reset-demo-button"

const TODAY_LABEL = "Saturday, September 20"

/** Michelle's header — mirrors Mike's, minus the content bell. The real ping is the Slack DM. */
export function MichelleHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-8">
      <div className="flex items-center gap-2.5">
        <div className="flex size-5.5 items-center justify-center rounded-md bg-brand-500">
          <div className="size-1.5 rounded-full bg-brand-200" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-slate-950">Ally</span>
        <span className="text-sm text-slate-500">Hi Michelle</span>
        <span className="text-sm text-slate-300">·</span>
        <span className="text-sm text-slate-500">Ops · {TODAY_LABEL}</span>
      </div>
      <div className="flex items-center gap-3">
        <ResetDemoButton />
        <Link href="/claire-waterfall" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700">
          <ArrowLeft className="size-3" />
          Claire&apos;s view
        </Link>
      </div>
    </header>
  )
}
