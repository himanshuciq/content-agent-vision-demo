"use client"

import { useState } from "react"
import { Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { downloadExecSummary } from "../exec-pdf"
import { useNudge } from "../nudge-context"
import type { Period } from "../types"
import { ICON_BTN } from "./team-bell"

/** The mail icon in Claire's top line: downloads the page as a PDF, fully expanded, ready to attach. */
export function EmailPdfButton({ period }: { period: Period }) {
  const { approved, nudged, policy } = useNudge()
  const [busy, setBusy] = useState(false)

  async function handleDownload() {
    setBusy(true)
    try {
      await downloadExecSummary(period, { approved, nudged, policy })
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" onClick={handleDownload} disabled={busy} aria-label="Email to my team" title="Email to my team" className={cn(ICON_BTN, "disabled:opacity-60")}>
      {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
    </button>
  )
}
