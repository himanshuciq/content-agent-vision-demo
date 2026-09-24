"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

/**
 * The one bridge back from the AI impact page to Claire's rollup — reached via
 * the "See the A/B test results" link in her Banked section. Returns to wherever
 * she came from (tier or waterfall view), falling back to /claire on a cold open.
 */
export function ExecBackBar() {
  const router = useRouter()

  function back() {
    if (typeof window !== "undefined" && window.history.length > 1) router.back()
    else router.push("/claire-waterfall")
  }

  return (
    <div className="border-b border-slate-200/70 bg-white/60 px-6 py-2.5 backdrop-blur-xl">
      <button
        type="button"
        onClick={back}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="size-4" />
        Back to Claire&apos;s overview
      </button>
    </div>
  )
}
