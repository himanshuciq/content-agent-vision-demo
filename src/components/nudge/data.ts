import { MOCK_SKUS } from "@/components/home/data"
import { SKU_ROWS } from "./sku-rows-data"
import type { AgentId, Batch, ClosedGrain, ClosedPeriodData, InflightData, NudgeKey, Period, TierRow } from "./types"

/**
 * Real numbers from the Ally_Home reference artifact — keep exactly as given.
 * The four example SKUs are real Aurelle catalog rows (the repo's only real
 * catalog); the mock's candle/water-bottle/cutting-board placeholders are
 * replaced with these, one per batch, per the handoff's "defer to the repo's
 * real SKU records" instruction.
 */
export const DEADLINE = { days: 18, date: "Oct 8", expiring: "$500K" }

/** Open $6.8M split by agent (summed across the three tiers), sorted by value. */
export const OPEN_BY_AREA: { agent: "content" | "ops" | "media"; value: string }[] = [
  { agent: "ops", value: "$3.2M" },
  { agent: "media", value: "$2.1M" },
  { agent: "content", value: "$1.5M" },
]

export const BATCHES: Batch[] = [
  {
    id: "halloween",
    tier: "approval",
    name: "Halloween seasonal moments",
    chip: `Expires in ${DEADLINE.days} days`,
    nudgeSource: "Nudged by Claire, just now",
    skus: 384,
    reviewMinutes: 25,
    value: "$500K",
    approveSkus: 378,
    approveValue: 0.5,
    doneLabel: "378 published · $500K",
    rationale: "384 SKUs missing event titles, deal framing, and AEO specs. Publish by Oct 8.",
    exampleSkuId: "sku-1",
    before: "Aurelle Candles Noir Cherry Large Scented Jar, 22 oz",
    after:
      "Halloween Aurelle Candles Noir Cherry Large Scented Jar, 22 oz, Spooky Party Décor, 150-Hr Burn",
    changes: [
      { text: 'Added "Halloween" to the title', skus: 372 },
      { text: "Added trending keywords", detail: "spooky party décor, fall centerpiece, trick-or-treat", skus: 358 },
      { text: "Swapped to the customer-approved Halloween colors pack shot", skus: 341 },
      { text: "Created a deal bullet", detail: "Save 20% October 1–31 with the on-page coupon", skus: 384 },
    ],
    skuRows: SKU_ROWS.halloween,
  },
  {
    id: "baseline",
    tier: "approval",
    name: "Foundational content refresh",
    chip: "No deadline",
    nudgeSource: "Queued by Ally, 6 days ago",
    skus: 339,
    reviewMinutes: 20,
    value: "$240K",
    approveSkus: 331,
    approveValue: 0.24,
    doneLabel: "331 published · $240K",
    rationale: "339 SKUs with bullets that haven't been touched against current search terms.",
    exampleSkuId: "sku-2",
    before: "Bright Citrus Zest Hand-Poured Soy Jar Candle, 14 oz. Hand poured. Six scents.",
    after:
      "Bright Citrus Zest Hand-Poured Soy Jar Candle, 14 oz, grapefruit and lemon zest, 90-hour burn, hand poured in small batches.",
    changes: [
      { text: "Rewrote bullets against the last 90 days of search terms", skus: 331 },
      { text: "Added trending keywords", detail: "90 hour burn, hand poured, small batch", skus: 318 },
      { text: "Kept every existing product claim word for word", skus: 339 },
    ],
    skuRows: SKU_ROWS.baseline,
  },
  {
    id: "backend",
    tier: "input",
    decisions: 2,
    name: "Backend keyword and attribute gaps",
    chip: "No deadline",
    nudgeSource: "Queued by Ally, 6 days ago",
    skus: 273,
    reviewMinutes: 10,
    value: "$420K",
    approveSkus: 273,
    approveValue: 0.42,
    doneLabel: "273 published · $420K",
    rationale: "273 SKUs with empty backend search terms and structured attributes.",
    exampleSkuId: "sku-3",
    before: "Search terms: candle, jar candle, soy candle · Scent family: — · Burn time: —",
    after:
      "Search terms: amber floral candle, long burn soy candle, jar candle gift · Scent family: amber floral · Burn time: 110 hours",
    changes: [
      { text: "Replaced backend search terms with the current high-intent set", skus: 273 },
      { text: "Filled empty structured attributes from the spec sheet", skus: 240 },
      { text: "Nothing customer-facing changed", skus: 273 },
    ],
    skuRows: SKU_ROWS.backend,
  },
  {
    id: "readiness",
    tier: "input",
    decisions: 1,
    name: "Retail readiness",
    chip: "No deadline",
    nudgeSource: "Flagged by Vendor Central, 3 days ago",
    skus: 100,
    reviewMinutes: 5,
    value: "$180K",
    approveSkus: 94,
    approveValue: 0.18,
    doneLabel: "94 published · $180K",
    rationale: "100 SKUs missing the structured attributes Amazon requires for this category.",
    exampleSkuId: "sku-4",
    before: "Country of origin: — · Item form: — · Age range: —",
    after: "Country of origin: United States · Item form: solid · Age range: adult",
    changes: [
      { text: "Filled the attributes Amazon requires for this category", skus: 100 },
      { text: "Pulled values from the existing spec sheet, nothing invented", skus: 94 },
      { text: "Ended search suppression on these listings", skus: 88 },
    ],
    skuRows: SKU_ROWS.readiness,
  },
]

export function batchExampleSku(batch: Batch) {
  return MOCK_SKUS.find((sku) => sku.id === batch.exampleSkuId) ?? MOCK_SKUS[0]
}

export function skuById(id: string) {
  return MOCK_SKUS.find((sku) => sku.id === id) ?? MOCK_SKUS[0]
}

export function findBatch(id: string) {
  return BATCHES.find((b) => b.id === id) ?? BATCHES[0]
}

/** Claire's screen: three collapsible tiers, exactly as named in the handoff. */
export const APPROVAL_TIER = {
  value: "$3.7M",
  effort: "45 min",
  canNudgeTeam: true,
  rows: [
    {
      agent: "content",
      analystName: "Mike",
      description: "Halloween seasonal updates and a foundational refresh.",
      value: "$740K",
      nudgeKey: "approval-content",
      deadline: `Expires in ${DEADLINE.days} days`,
      weekly: { state: "not-started" },
    },
    {
      agent: "ops",
      analystName: "Michelle",
      description: "PO email for low-inventory SKUs.",
      value: "$2.4M",
      nudgeKey: "approval-ops",
      weekly: { state: "in-progress", progress: "12 of 30 POs sent" },
    },
    {
      agent: "media",
      analystName: "James",
      description: "5 new DSP campaigns for new-to-brand shoppers.",
      value: "$0.56M",
      nudgeKey: "approval-media",
      weekly: { state: "in-progress", progress: "2 of 5 campaigns live" },
    },
  ] satisfies TierRow[],
}

export const TEAM_TIER = {
  value: "$2.2M",
  effort: "~3 days",
  canNudgeTeam: true,
  rows: [
    {
      agent: "content",
      analystName: "Mike",
      description: "Backend attributes and creative for the unlocked media budget.",
      value: "$0.6M",
      nudgeKey: "team-content",
      weekly: { state: "not-started" },
    },
    {
      agent: "ops",
      analystName: "Michelle",
      description: "Chargebacks, fees, and shorted POs waiting on finance.",
      value: "$0.6M",
      nudgeKey: "team-ops",
      weekly: { state: "not-started" },
    },
    {
      agent: "media",
      analystName: "James",
      description: "Media plan for the $1M in newly unlocked budget.",
      value: "$1.0M",
      nudgeKey: "team-media",
      weekly: { state: "in-progress", progress: "Plan drafted" },
    },
  ] satisfies TierRow[],
}

export const AUTOPILOT_TIER = {
  value: "$0.9M",
  effort: "0 min",
  canNudgeTeam: false,
  rows: [
    { agent: "content", analystName: "", description: "Always-on PIM to PDP fixes.", value: "$0.2M" },
    { agent: "media", analystName: "", description: "Incremental bid adjustments and budget pacing.", value: "$0.5M" },
    { agent: "ops", analystName: "", description: "Promotions not live.", value: "$0.2M" },
  ] satisfies TierRow[],
}

/** Already realized and live this quarter. */
export const BANKED_VALUE = "$1.2M"
/** Banked + the three open buckets. */
export const TOTAL_VALUE = "$8.0M"

/** Media and ops banked so far this quarter; content's detail lives in CONTENT_BANKED_Q3. */
export const BANKED_OTHER: { agent: AgentId; promised: number; delivered: number; reason: string }[] = [
  { agent: "media", promised: 0.34, delivered: 0.37, reason: "IROAS $3.05 vs $2.80 plan" },
  { agent: "ops", promised: 0.36, delivered: 0.31, reason: "Buy-box fixes waiting on 2 restocks" },
]

/* ---------------------------------------------------------------------------
 * "How did I do": promise vs delivered per closed period. Content leads (it's
 * the demo); each period's delivered split sums to CLOSED[grain].total. The
 * fully layered content view lives in delivered-content-data.ts.
 * ------------------------------------------------------------------------- */
export interface DeliveredBucket {
  agent: AgentId
  /** $M */
  promised: number
  delivered: number
  /** A short phrase shown inline after the name: what we did or why the gap. */
  reason: string
}
export interface DeliveredPeriod {
  periodName: string
  /** Content first. Totals are computed from these so they always tie. */
  buckets: DeliveredBucket[]
}

export const DELIVERED: Record<ClosedGrain, DeliveredPeriod> = {
  month: {
    periodName: "August",
    buckets: [
      { agent: "content", promised: 0.26, delivered: 0.238, reason: "2 top sellers out of stock" },
      { agent: "media", promised: 0.15, delivered: 0.161, reason: "IROAS ahead of the $2.80 plan" },
      { agent: "ops", promised: 0.06, delivered: 0.031, reason: "Buy-box fixes blocked by stockouts" },
    ],
  },
  quarter: {
    periodName: "Q2 FY26",
    buckets: [
      { agent: "content", promised: 0.89, delivered: 0.7, reason: "280 SKUs improved" },
      { agent: "media", promised: 0.44, delivered: 0.476, reason: "IROAS $3.01 vs $2.80 plan" },
      { agent: "ops", promised: 0.24, delivered: 0.084, reason: "Buy-box fixes blocked by stockouts" },
    ],
  },
  year: {
    periodName: "FY25",
    buckets: [
      { agent: "content", promised: 2.0, delivered: 1.79, reason: "Stockouts on top SKUs during events" },
      { agent: "media", promised: 1.1, delivered: 1.18, reason: "IROAS above plan across 11 events" },
      { agent: "ops", promised: 0.5, delivered: 0.23, reason: "Buy-box fixes blocked by stockouts" },
    ],
  },
}

/* ---------------------------------------------------------------------------
 * Ops (Michelle) queue — real ops use cases lifted from ally_brain's Store Walk.
 * Powers /michelle, mirroring Mike's content queue but with ops detections/actions.
 * ------------------------------------------------------------------------- */
export interface OpsBatch {
  id: "buybox" | "promo-badge" | "deal-page" | "oos" | "shipping"
  name: string
  chip: string
  team: string
  skus: number
  value: string
  approveValue: number
  /** What the ops agent detected. */
  detected: string
  /** The recommended action Michelle signs off. */
  action: string
  doneLabel: string
  /** Lead example SKU. */
  exampleSku: string
  exampleName: string
  evidence: string[]
}

export const OPS_BATCHES: OpsBatch[] = [
  {
    id: "buybox",
    name: "Lost buy box",
    chip: "Losing the sale now",
    team: "Sales",
    skus: 6,
    value: "$720K",
    approveValue: 0.72,
    detected: "A lower-priced third-party seller is winning the buy box on 6 SKUs, below the MAP floor.",
    action: "Report MAP violation to Amazon",
    doneLabel: "MAP violation reported · 6 SKUs",
    exampleSku: "B08XYZ1234",
    exampleName: "CleanPro Robot Vac R900",
    evidence: [
      "VacuMart_US at $289 vs our $319 — below the $499 MAP floor",
      "Buy box win rate 2 of 6 crawls (NY, Chicago, Austin, Seattle, LA)",
      "$62K gap to plan on the lead SKU alone",
    ],
  },
  {
    id: "promo-badge",
    name: "Missing promo badge",
    chip: "Promo live, badge hidden",
    team: "Marketing",
    skus: 5,
    value: "$580K",
    approveValue: 0.58,
    detected: "Deal is live (Aug 9–Sep 5) but the Deal badge and strike-through price aren't rendering on 5 SKUs.",
    action: "Email Amazon to restore the Deal badge",
    doneLabel: "Badge fix requested · 5 SKUs",
    exampleSku: "B0PRM001",
    exampleName: "CleanPro Pro Cordless",
    evidence: [
      "Badge visible: no · Original price shown: no · Struck-through: yes",
      "Selling $174 against MRP $194 — discount not surfaced",
      "Promo window closes Sep 5",
    ],
  },
  {
    id: "deal-page",
    name: "Deal page visibility",
    chip: "Not on deals page",
    team: "Marketing",
    skus: 8,
    value: "$460K",
    approveValue: 0.46,
    detected: "Active deals aren't appearing on Amazon's deals page for 8 SKUs.",
    action: "Email Amazon to fix deal page visibility",
    doneLabel: "Visibility fix requested · 8 SKUs",
    exampleSku: "B0DPV001",
    exampleName: "CleanPro Pro Cordless",
    evidence: ["$42K gap to plan on the lead SKU", "Deal active but unlisted on the deals page"],
  },
  {
    id: "oos",
    name: "Out of stock (false)",
    chip: "Listing issue, not inventory",
    team: "Operations",
    skus: 5,
    value: "$340K",
    approveValue: 0.34,
    detected: "5 SKUs show unavailable on the page despite stock on hand — a suppressed-offer listing issue.",
    action: "Reinstate the suppressed offer",
    doneLabel: "Offer reinstated · 5 SKUs",
    exampleSku: "B0STK001",
    exampleName: "CleanPro AI Robot R2002",
    evidence: ["24 units on hand, 0% rep OOS", "76% page unavailability", "Listing suppression, not a stockout"],
  },
  {
    id: "shipping",
    name: "Shipping speed slipped",
    chip: "Below the Prime bar",
    team: "Operations",
    skus: 4,
    value: "$300K",
    approveValue: 0.3,
    detected: "4 SKUs are shipping 2.5 days slower than the Prime bar across 8 ZIPs.",
    action: "Flag to the 3PL for expedited handling",
    doneLabel: "Flagged to 3PL · 4 SKUs",
    exampleSku: "B0SHP001",
    exampleName: "PlayMax Fusion Pro Wired",
    evidence: ["Standard 4.5 days vs Prime 1.1 days", "Prime is 3.9 days faster across the 8 ZIPs sampled"],
  },
]

/** The five store-walk issues sum to Claire's "one approval away" ops line. */
export const OPS_TOTAL_VALUE = "$2.4M"

export interface NudgeTarget {
  recipient: "mike" | "michelle"
  queuePath: string
  batchName: string
  value: string
  skus?: number
  deadlineDays?: number
}

/** Which nudges fire a real Slack DM, to whom, and where "Open in Ally" lands. */
export const NUDGE_TARGETS: Partial<Record<NudgeKey, NudgeTarget>> = {
  "approval-content": { recipient: "mike", queuePath: "/mike", batchName: "Halloween and a foundational refresh", value: "$740K", skus: 709, deadlineDays: DEADLINE.days },
  "team-content": { recipient: "mike", queuePath: "/mike", batchName: "Backend attributes and retail readiness", value: "$600K", skus: 367 },
  "approval-ops": { recipient: "michelle", queuePath: "/michelle", batchName: "Ops store-walk fixes", value: "$2.4M", skus: 28 },
}

export const OPEN_TOTAL = "$6.8M"

/**
 * Claire's business for the in-flight period, $M: sold so far, where the current
 * run rate lands, and the plan she uploaded. Gap = plan − pace; the open
 * opportunity (OPEN_TOTAL) is what closes it.
 */
export const BUSINESS: Record<Period, { soFar: number; pace: number; plan: number }> = {
  week: { soFar: 3.4, pace: 3.6, plan: 3.8 },
  month: { soFar: 12.4, pace: 14.2, plan: 15.4 },
  quarter: { soFar: 37, pace: 40, plan: 45 },
  year: { soFar: 125, pace: 168, plan: 175 },
}
export const OPEN_TOTAL_M = 6.8

/** $M for business numbers: whole millions from $10M up, one decimal below. */
export function fmtBiz(v: number): string {
  return v >= 10 || Number.isInteger(v) ? `$${Math.round(v)}M` : `$${v.toFixed(1)}M`
}

/** In-flight business context shown in the status strip — how the current period is tracking. */
export const INFLIGHT: Record<Period, InflightData> = {
  week: { name: "This week", ptd: "$3.4M", ptdLabel: "week to date", plan: "96%", share: "market share flat at 18.6%" },
  month: { name: "September", ptd: "$12.4M", ptdLabel: "month to date", plan: "97%", share: "market share flat at 18.6%" },
  quarter: { name: "Q3 FY26", ptd: "$37M", ptdLabel: "quarter to date", plan: "95%", share: "market share flat at 18.6%" },
  year: { name: "FY26", ptd: "$125M", ptdLabel: "year to date", plan: "99%", share: "market share up 0.2 pts to 18.6%" },
}
/** Mike's "One approval away" total; ties to Claire's content row in that bucket ($740K). */
export const TOTAL_WAITING_APPROVAL = 0.74
export const TOTAL_SKUS_REMAINING = 1096

/** The "{priorName} · {priorValue} driven by Ally" toggle and its agent breakdown. */
export const CLOSED: Record<ClosedGrain, ClosedPeriodData> = {
  month: {
    name: "August",
    total: "$430K",
    media: "$161K",
    content: "$238K",
    ops: "$31K",
    mediaStory: "took 24,000 bid and budget actions across 1,400 keywords, at $2.94 incremental return on ad spend.",
    contentStory: "rewrote 61 product pages ahead of back to school.",
    opsStory: "caught 26 SKUs losing the buy box or missing a promo badge, and fixed them in 48 hours.",
  },
  quarter: {
    name: "Q2 FY26",
    total: "$1.26M",
    media: "$476K",
    content: "$700K",
    ops: "$84K",
    mediaStory: "took 78,000 bid and budget actions across 1,400 keywords, at $3.01 incremental return on ad spend.",
    contentStory: "updated 200 SKUs for Mother's Day, improved everyday content on 60, and unblocked 20 for syndication.",
    opsStory:
      "caught 78 SKUs losing the buy box, missing a promo badge, or dropping below the shipping speed bar, and fixed them in 48 hours instead of 2 weeks.",
  },
  year: {
    name: "FY25",
    total: "$3.2M",
    media: "$1.18M",
    content: "$1.79M",
    ops: "$230K",
    mediaStory: "took 291,000 bid and budget actions across 2,100 keywords, at $2.88 incremental return on ad spend.",
    contentStory: "rewrote 740 product pages across 11 shopping events.",
    opsStory: "caught 312 SKUs losing the buy box, missing a promo badge, or dropping below the shipping speed bar, and cut time to fix from 2 weeks to 48 hours.",
  },
}

export const DEFAULT_CLOSED_GRAIN: ClosedGrain = "quarter"

/** "How you compare" — autopilot share of value Ally ships alone. */
export const COMPARE = {
  youPct: 10,
  bestInClassPct: 25,
  expiredYtd: "$1.8M",
}

/* ---------------------------------------------------------------------------
 * Waterfall version (/claire-waterfall) — a SECOND view of the same buckets.
 * Reuses the exact tier rows; adds only stage framing + numeric values so the
 * chart can build up Banked → open buckets → Total. No new source of truth.
 * ------------------------------------------------------------------------- */
export interface WaterfallStage {
  id: "approval" | "team" | "autopilot"
  label: string
  effort: string
  /** Millions, for bar height + labels. */
  value: number
  /** The same line items as the tier list; empty for stages with no owners. */
  rows: TierRow[]
  canNudgeTeam: boolean
  /** Shown in the detail panel for stages that need no action. */
  note?: string
}

export const WATERFALL_STAGES: WaterfallStage[] = [
  { id: "approval", label: "One approval away", effort: APPROVAL_TIER.effort, value: 3.7, rows: APPROVAL_TIER.rows, canNudgeTeam: true },
  { id: "team", label: "Needs your team", effort: TEAM_TIER.effort, value: 2.2, rows: TEAM_TIER.rows, canNudgeTeam: true },
  { id: "autopilot", label: "On autopilot", effort: AUTOPILOT_TIER.effort, value: 0.9, rows: AUTOPILOT_TIER.rows, canNudgeTeam: false, note: "Runs on its own — no one has to open this screen." },
]

export const WATERFALL_TOTAL = WATERFALL_STAGES.reduce((s, x) => s + x.value, 0)

export function fmtM(v: number): string {
  return `$${v.toFixed(1)}M`
}

/** K under a million, two-decimal M above — e.g. 0.478 → "$478K", 1.26 → "$1.26M". */
export function fmtValue(v: number): string {
  return Math.abs(v) >= 1 ? `$${v.toFixed(2)}M` : `$${Math.round(v * 1000)}K`
}
