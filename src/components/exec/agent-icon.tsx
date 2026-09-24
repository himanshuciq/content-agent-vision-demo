import { FileText, Megaphone, Wrench, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AgentId } from "./data"

const AGENT_ICON: Record<AgentId, LucideIcon> = {
  media: Megaphone,
  content: FileText,
  ops: Wrench,
}

/** Status-adjacent tints, not decoration — same palette PROJECT_CONTEXT.md maps to info/brand/success. */
const AGENT_TINT: Record<AgentId, string> = {
  media: "bg-info-100 text-info-700",
  content: "bg-brand-100 text-brand-700",
  ops: "bg-success-100 text-success-700",
}

export function AgentIcon({ agent, className }: { agent: AgentId; className?: string }) {
  const Icon = AGENT_ICON[agent]
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
        AGENT_TINT[agent],
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </span>
  )
}
