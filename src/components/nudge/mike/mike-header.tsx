"use client"

import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNudge } from "../nudge-context"
import { findBatch } from "../data"
import { ResetDemoButton } from "../reset-demo-button"

const TODAY_LABEL = "Saturday, September 20"

/** Mike's header: no exec chrome here either, just the bell that ties back to Claire's nudge. */
export function MikeHeader() {
  const { mikeNotified, clearNotification } = useNudge()
  const nudgedBatch = findBatch("halloween")

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-8">
      <div className="flex items-center gap-2.5">
        <div className="flex size-5.5 items-center justify-center rounded-md bg-brand-500">
          <div className="size-1.5 rounded-full bg-brand-200" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-slate-950">Ally</span>
        <span className="text-sm text-slate-500">Hi Mike</span>
        <span className="text-sm text-slate-300">·</span>
        <span className="text-sm text-slate-500">{TODAY_LABEL}</span>
      </div>
      <div className="flex items-center gap-3">
        <ResetDemoButton />
        <Link href="/claire" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700">
          <ArrowLeft className="size-3" />
          Claire&apos;s view
        </Link>
        <DropdownMenu onOpenChange={(open) => { if (!open) clearNotification() }}>
          <DropdownMenuTrigger className="relative flex size-9 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50">
            <Bell className="size-4 text-slate-600" />
            {mikeNotified && (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-error-600" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-80 rounded-xl p-1.5 shadow-md ring-1 ring-slate-200/80">
            {mikeNotified ? (
              <DropdownMenuItem className="flex items-start gap-3 p-2.5">
                <span className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  C
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">Claire nudged you</span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    {nudgedBatch.name} · {nudgedBatch.value}, {nudgedBatch.skus} SKUs
                  </span>
                </span>
              </DropdownMenuItem>
            ) : (
              <div className="p-3 text-sm text-slate-500">No new notifications.</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
