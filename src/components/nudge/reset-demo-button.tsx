"use client"

import { RotateCcw } from "lucide-react"
import { useNudge } from "./nudge-context"

/** Wipes all nudge/approve state and reloads, so the demo can be replayed from a clean slate. */
export function ResetDemoButton() {
  const { resetDemo } = useNudge()

  function handleReset() {
    resetDemo()
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      title="Reset"
      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700"
    >
      <RotateCcw className="size-3" />
      Reset
    </button>
  )
}
