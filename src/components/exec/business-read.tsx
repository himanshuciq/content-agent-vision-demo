import { BUSINESS_READ, DELIVERED_TOTAL, SHORTFALL, type BusinessRead as BusinessReadData } from "./data"
import { formatCompactUsd, formatPoints } from "./format"
import { AttributionStat } from "./attribution-stat"

interface Segment {
  text: string
  strong?: boolean
}

/**
 * Plan attainment and share combined into one judgment — the relationship
 * between them is the insight, per the copy deck. Three shapes: beat plan
 * and outgrew the category, beat plan but lost share, or missed plan.
 */
function businessReadSegments(data: BusinessReadData): Segment[] {
  const beatPlan = data.planAttainmentPct >= 100
  const revenue = formatCompactUsd(data.revenue)
  const yoyDirection = data.revenueYoyPct >= 0 ? "up" : "down"
  const yoyAbs = formatPoints(data.revenueYoyPct)
  const sharePoints = formatPoints(data.sharePointsChange)

  if (!beatPlan) {
    return [
      { text: `You closed at ${data.planAttainmentPct}% of plan.`, strong: true },
      {
        text: ` ${revenue}, ${yoyDirection} ${yoyAbs}% year over year, and share slipped ${sharePoints} points to ${data.sharePct}%.`,
      },
    ]
  }
  if (data.outgrewCategory) {
    return [
      { text: `You closed at ${data.planAttainmentPct}% of plan.`, strong: true },
      {
        text: ` ${revenue}, up ${yoyAbs}% year over year. And you grew faster than the category: share up ${sharePoints} points to ${data.sharePct}%.`,
      },
    ]
  }
  return [
    {
      text: `You beat plan at ${data.planAttainmentPct}%, but share slipped ${sharePoints} points to ${data.sharePct}%.`,
      strong: true,
    },
    { text: " The category grew faster than you did." },
  ]
}

export function BusinessRead() {
  const data = BUSINESS_READ
  const beatPlan = data.planAttainmentPct >= 100
  const showShareOfVoice = beatPlan && data.outgrewCategory

  return (
    <div className="space-y-5">
      <div className="space-y-3 text-lg leading-relaxed text-slate-700">
        <p>
          {businessReadSegments(data).map((segment, i) => (
            <span key={i} className={segment.strong ? "font-semibold text-slate-900" : undefined}>
              {segment.text}
            </span>
          ))}
        </p>
        {showShareOfVoice && (
          <p className="text-slate-500">
            {`You're also getting recommended more: ${data.aiShareOfVoicePct}% AI share of voice, up ${formatPoints(
              data.aiShareOfVoicePointsChange,
            )} points.`}
          </p>
        )}
      </div>
      <AttributionStat value={DELIVERED_TOTAL} shortfall={beatPlan ? undefined : SHORTFALL} />
    </div>
  )
}
