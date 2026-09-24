import { ResetDemoButton } from "../reset-demo-button"
import { EmailPdfButton } from "./email-pdf-button"
import type { Period } from "../types"

/** No LaunchpadTabs, no AppModuleTabs — Claire's rollup is a destination, not a hub. */
export function ClaireHeader({ period }: { period: Period }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-12">
      <div className="flex items-center gap-2.5">
        <div className="flex size-6 items-center justify-center rounded-md bg-brand-500">
          <div className="size-2 rounded-full bg-brand-200" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-slate-950">Ally</span>
      </div>
      <div className="flex items-center gap-4">
        <ResetDemoButton />
        <EmailPdfButton period={period} />
        <div className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white" title="Claire Bennett">
          C
        </div>
      </div>
    </header>
  )
}
