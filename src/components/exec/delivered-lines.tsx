import { DELIVERED } from "./data"
import { AGENT_LABEL, formatCompactUsd } from "./format"
import { AgentIcon } from "./agent-icon"

/**
 * Verb first, dollars pulled right. Sorted by value descending — the order
 * changes as the data changes, it is never fixed to media/content/ops.
 */
export function DeliveredLines() {
  const sorted = [...DELIVERED].sort((a, b) => b.value - a.value)

  return (
    <ul className="divide-y divide-slate-100">
      {sorted.map((line) => (
        <li key={line.agent} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
          <AgentIcon agent={line.agent} />
          <p className="min-w-0 flex-1 text-base text-slate-700">
            <span className="font-semibold text-slate-900">{AGENT_LABEL[line.agent]}</span>
            {` ${line.sentence}`}
          </p>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
              {formatCompactUsd(line.value)}
            </p>
            {line.qualifier && (
              <p className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {line.qualifier}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
