/**
 * Exec home mock data.
 *
 * Every date on the screen derives from TODAY. Never hardcode a date in a component.
 * Copy strings live in docs/exec-home-copy.md. This file holds numbers only.
 */

export const TODAY = new Date("2026-10-05T09:00:00-07:00")

export const PEOPLE = {
  exec: { name: "Claire Bennett", firstName: "Claire", title: "VP Ecommerce" },
  owners: {
    content: { name: "Megan Cole", firstName: "Megan" },
    ops: { name: "Ryan Mitchell", firstName: "Ryan" },
    media: { name: "Tom Baker", firstName: "Tom" },
  },
} as const

export type AgentId = "content" | "ops" | "media"
export type PeriodId = "week" | "month" | "quarter" | "year"

export const PERIODS: { id: PeriodId; label: string; pastLabel: string }[] = [
  { id: "week", label: "week", pastLabel: "last week" },
  { id: "month", label: "month", pastLabel: "last month" },
  { id: "quarter", label: "quarter", pastLabel: "last quarter" },
  { id: "year", label: "year", pastLabel: "this year" },
]

export const DEFAULT_PERIOD: PeriodId = "quarter"

/* ----------------------------------------------------------------------------
 * Block 1: what we did (Q3 2026, closed Sep 30)
 * -------------------------------------------------------------------------- */

export interface BusinessRead {
  planAttainmentPct: number
  revenue: number
  revenueYoyPct: number
  sharePct: number
  sharePointsChange: number
  aiShareOfVoicePct: number
  aiShareOfVoicePointsChange: number
  /** Positive means we grew faster than the category. Drives which sentence renders. */
  outgrewCategory: boolean
}

export const BUSINESS_READ: BusinessRead = {
  planAttainmentPct: 112,
  revenue: 46_200_000,
  revenueYoyPct: 14.6,
  sharePct: 18.6,
  sharePointsChange: 0.3,
  aiShareOfVoicePct: 34,
  aiShareOfVoicePointsChange: 1.4,
  outgrewCategory: true,
}

/** Bad quarter variant. Keep in sync with the copy deck. Used by the /exec?state=miss demo toggle. */
export const BUSINESS_READ_MISS: BusinessRead = {
  planAttainmentPct: 94,
  revenue: 38_700_000,
  revenueYoyPct: -2.1,
  sharePct: 17.9,
  sharePointsChange: -0.4,
  aiShareOfVoicePct: 32,
  aiShareOfVoicePointsChange: 0.2,
  outgrewCategory: false,
}

export const SHORTFALL = 2_400_000

export interface DeliveredLine {
  agent: AgentId
  /** Sentence body. Agent name is rendered separately so it can be styled. */
  sentence: string
  value: number
  /** Optional trailing qualifier, e.g. the IROAS on media. */
  qualifier?: string
}

/** Sorted by value descending at render time, not here. */
export const DELIVERED: DeliveredLine[] = [
  {
    agent: "media",
    sentence: "took 78,000 bid and budget actions across 1,400 keywords.",
    value: 694_000,
    qualifier: "at $3.01 IROAS",
  },
  {
    agent: "content",
    sentence: "rewrote 200 product pages across 3 shopping events.",
    value: 478_000,
  },
  {
    agent: "ops",
    sentence:
      "caught 78 SKUs losing the buy box, missing a promo badge, or dropping below the shipping speed bar, and fixed them in 48 hours instead of the 2 weeks it used to take.",
    value: 84_000,
  },
]

export const DELIVERED_TOTAL = 1_256_000
export const DELIVERED_SELF_DRIVE = 20_000
export const EXPIRED_LAST_PERIOD = 1_800_000
/** True in the mock, and the reason the closing line in block 3 works. */
export const ALL_EXPIRED_AWAITED_A_HUMAN = true

export const BENCHMARK_SELF_DRIVE_PCT = 25
/** 25% of delivered value, what benchmark would have shipped untouched. */
export const BENCHMARK_SELF_DRIVE_VALUE = 314_000

/* ----------------------------------------------------------------------------
 * Block 2: what's open (Q4 2026)
 * -------------------------------------------------------------------------- */

export interface OpenLine {
  agent: AgentId
  /** Sentence body, present tense. */
  sentence: string
  open: number
  selfDrive: number
  oneApproval: number
  needsTeam: number
  itemCount: number
  itemNoun: string
}

export const OPEN: OpenLine[] = [
  {
    agent: "content",
    sentence: "has 1,240 product pages that could earn more.",
    open: 4_600_000,
    selfDrive: 900_000,
    oneApproval: 3_100_000,
    needsTeam: 600_000,
    itemCount: 1_240,
    itemNoun: "product pages",
  },
  {
    agent: "ops",
    sentence: "is watching 612 issues costing you sales right now.",
    open: 3_100_000,
    selfDrive: 800_000,
    oneApproval: 1_700_000,
    needsTeam: 600_000,
    itemCount: 612,
    itemNoun: "issues",
  },
  {
    agent: "media",
    sentence: "has 96 bid and budget changes queued.",
    open: 1_700_000,
    selfDrive: 200_000,
    oneApproval: 1_000_000,
    needsTeam: 500_000,
    itemCount: 96,
    itemNoun: "changes",
  },
]

export const OPEN_TOTAL = 9_400_000
export const OPEN_SELF_DRIVE = 1_900_000
export const OPEN_ONE_APPROVAL = 5_800_000
export const OPEN_NEEDS_TEAM = 1_700_000

/** Item counts behind the approval and input buckets. Drives the time estimates. */
export const APPROVAL_ITEMS = 1_224
export const NEEDS_TEAM_ITEMS = 256

/** Rendered as prose, not as raw numbers. "About a day", "about three days". */
export const EFFORT = {
  selfDrive: { hours: 0, label: "nobody" },
  oneApproval: { hours: 7, label: "about a day of review, spread across your team" },
  needsTeam: { hours: 24, label: "about three days" },
} as const

export const HORIZON_12_MONTHS = 34_000_000

/* ----------------------------------------------------------------------------
 * Deadlines
 * -------------------------------------------------------------------------- */

export interface Deadline {
  id: string
  event: string
  agent: AgentId
  publishBy: Date
  atRisk: number
  itemCount: number
}

export const DEADLINES: Deadline[] = [
  {
    id: "halloween",
    event: "Halloween",
    agent: "content",
    publishBy: new Date("2026-10-08T23:59:00-07:00"),
    atRisk: 740_000,
    itemCount: 312,
  },
  {
    id: "black-friday",
    event: "Black Friday and Cyber Monday",
    agent: "content",
    publishBy: new Date("2026-11-02T23:59:00-08:00"),
    atRisk: 2_100_000,
    itemCount: 806,
  },
  {
    id: "holiday-gifting",
    event: "holiday gifting",
    agent: "content",
    publishBy: new Date("2026-11-20T23:59:00-08:00"),
    atRisk: 1_300_000,
    itemCount: 494,
  },
]

export const DEADLINE_TOTAL_AT_RISK = 4_140_000

/* ----------------------------------------------------------------------------
 * Nudge
 * -------------------------------------------------------------------------- */

export interface NudgeState {
  sentAt: Date | null
  primaryRecipient: string
  additionalRecipients: number
  itemCount: number
  value: number
  /** Populated only on a return visit, drives the follow-up line. */
  approvedSinceNudge: number | null
  unlockedSinceNudge: number | null
}

export const NUDGE: NudgeState = {
  sentAt: null,
  primaryRecipient: PEOPLE.owners.content.firstName,
  additionalRecipients: 2,
  itemCount: 312,
  value: 740_000,
  approvedSinceNudge: null,
  unlockedSinceNudge: null,
}

/** What the screen shows on a later visit. Used by the /exec?state=nudged demo toggle. */
export const NUDGE_FOLLOW_UP: NudgeState = {
  ...NUDGE,
  sentAt: TODAY,
  approvedSinceNudge: 284,
  unlockedSinceNudge: 673_000,
}

/* ----------------------------------------------------------------------------
 * Self-drive settings
 * -------------------------------------------------------------------------- */

export type SkuScope = "top-20" | "brand" | "category" | "all"

export interface SelfDriveAction {
  id: string
  agent: AgentId
  label: string
  enabled: boolean
  /** Retroactive evidence. The reason anyone reads this page. */
  wouldHaveCaughtItems: number
  wouldHaveCaughtValue: number
}

export const SELF_DRIVE_ACTIONS: SelfDriveAction[] = [
  { id: "ops-buy-box", agent: "ops", label: "Buy box lost", enabled: false, wouldHaveCaughtItems: 34, wouldHaveCaughtValue: 214_000 },
  { id: "ops-promo-badge", agent: "ops", label: "Promo badge missing", enabled: true, wouldHaveCaughtItems: 22, wouldHaveCaughtValue: 61_000 },
  { id: "ops-coupon", agent: "ops", label: "Coupon not live", enabled: false, wouldHaveCaughtItems: 41, wouldHaveCaughtValue: 96_000 },
  { id: "ops-shipping", agent: "ops", label: "Shipping speed slipped", enabled: false, wouldHaveCaughtItems: 18, wouldHaveCaughtValue: 47_000 },
  { id: "ops-oos", agent: "ops", label: "Out of stock", enabled: false, wouldHaveCaughtItems: 12, wouldHaveCaughtValue: 138_000 },
  { id: "content-keywords", agent: "content", label: "Backend keywords", enabled: true, wouldHaveCaughtItems: 180, wouldHaveCaughtValue: 84_000 },
  { id: "content-bullets", agent: "content", label: "Bullet refresh", enabled: false, wouldHaveCaughtItems: 246, wouldHaveCaughtValue: 172_000 },
  { id: "content-images", agent: "content", label: "Image order", enabled: false, wouldHaveCaughtItems: 91, wouldHaveCaughtValue: 63_000 },
  { id: "content-title", agent: "content", label: "Title", enabled: false, wouldHaveCaughtItems: 134, wouldHaveCaughtValue: 221_000 },
]

export const SELF_DRIVE_SCOPE: { id: SkuScope; label: string; recommended: boolean }[] = [
  { id: "top-20", label: "Top 20% by revenue", recommended: true },
  { id: "brand", label: "A single brand", recommended: false },
  { id: "category", label: "A single category", recommended: false },
  { id: "all", label: "Everything", recommended: false },
]

/* ----------------------------------------------------------------------------
 * Chat suggestions
 * -------------------------------------------------------------------------- */

export const ASK_SUGGESTIONS = [
  "Why did we beat plan?",
  "What did the agents ship last week?",
  "What happens if nobody approves anything?",
]
