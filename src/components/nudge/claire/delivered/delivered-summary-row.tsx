import { AGENT_LABEL } from "../../types"
import { DELIVERED_GRID, RowLabel, ValueCells } from "./columns"
import type { DeliveredBucket } from "../../data"

/** A bucket not yet designed in depth: one line, no drill-down. */
/** indent: lines the name up with rows that have a leading disclosure chevron. */
export function DeliveredSummaryRow({ bucket, projectedFirst, indent }: { bucket: DeliveredBucket; projectedFirst?: boolean; indent?: boolean }) {
  return (
    <div className={`${DELIVERED_GRID} border-t border-slate-200 px-6 py-3.5`}>
      <RowLabel name={AGENT_LABEL[bucket.agent]} note={bucket.reason} top indent={indent} />
      <ValueCells delivered={bucket.delivered} promised={bucket.promised} strong projectedFirst={projectedFirst} />
      <span />
    </div>
  )
}
