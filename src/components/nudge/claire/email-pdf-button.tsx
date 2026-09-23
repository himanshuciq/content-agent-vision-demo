"use client"

import { useState } from "react"
import { Mail, Loader2 } from "lucide-react"
import { downloadExecSummary } from "../exec-pdf"
import type { Period } from "../types"

/** "Email to my team" → generates and downloads a one-page exec summary PDF. */
export function EmailPdfButton({ period }: { period: Period }) {
  const [busy, setBusy] = useState(false)

  async function handleDownload() {
    setBusy(true)
    try {
      await downloadExecSummary(period)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="flex items-center gap-2 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-3.5 animate-spin text-slate-500" /> : <Mail className="size-3.5 text-slate-500" />}
      Email to my team
    </button>
  )
}
