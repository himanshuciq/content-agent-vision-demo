/**
 * Gap to plan, by brand and category, as of Oct 8 (week of Oct 5–11). All $M.
 * Ties: SKUs → category → brand → overall, for last week, week to date and the
 * projected end of week. Overall's projection ties to Claire's week view
 * ($3.5M run rate vs $3.7M plan). Each node carries its drivers and the
 * recommendations Ally would act on, so the analysis is a read of this data.
 */

export type DriverTag = "Live" | "Resolved" | "Worth watching"

export interface Driver {
  title: string
  /** $M of last week's gap it explains (negative = cost). */
  value: number
  tag: DriverTag
  points: string[]
}

export type GapAction =
  | { kind: "inbox"; label: string; batchId: string }
  | { kind: "play"; label: string; playId: string }
  | { kind: "watch"; label: string }

export interface Recommendation {
  title: string
  points: string[]
  action: GapAction
}

export interface GapNode {
  id: string
  name: string
  /** "Brand", "Category", "SKU" (Overall has none). */
  level?: "Brand" | "Category" | "SKU"
  asin?: string
  lastWeek: { sales: number; plan: number }
  wtd: number
  eow: { projected: number; plan: number }
  /** Sales change vs the week before, and its three parts. */
  equation: { traffic: number; conversion: number; price: number; sales: number }
  drivers: Driver[]
  recommendations: Recommendation[]
  children?: GapNode[]
  /** SKUs not listed under a category ("and 38 more"). */
  more?: number
}

export const GAP_WEEK = { last: "Sep 28 – Oct 4", current: "Oct 5 – 11", elapsed: 4 / 7 }

/** The skills the analysis runs, in order ("Analyzed in 10 steps"). */
export const GAP_STEPS = [
  "Pulled sales and plan for the last 3 weeks",
  "Phased the monthly plan down to the week",
  "Split the change into traffic, conversion and price",
  "Checked availability on every crawl (Store Walk)",
  "Checked who held the buy box",
  "Checked deal and promo badges",
  "Compared against category demand",
  "Checked ad spend and sponsored slots",
  "Ranked the causes by dollars",
  "Matched each cause to a play and an owner",
]

const amber: GapNode = {
  id: "sku-amber",
  name: "Amber Floral Soy Jar, 16 oz",
  level: "SKU",
  asin: "B07GR5MSKD",
  lastWeek: { sales: 0.0583, plan: 0.0641 },
  wtd: 0.0362,
  eow: { projected: 0.052, plan: 0.066 },
  equation: { traffic: -18, conversion: -12, price: 0, sales: -28 },
  drivers: [
    { title: "Lost the buy box to CandleDepot from Oct 1", value: -0.0041, tag: "Live", points: ["CandleDepot at $27.50, below your $32 MAP floor", "You won 0 of the last 12 crawls"] },
    { title: "Offer suppressed Sep 30 – Oct 1", value: -0.0012, tag: "Resolved", points: ["Unavailable in every crawl both days", "Back in stock since Oct 2"] },
    { title: "Standard delivery 3 days slower than Prime", value: -0.0005, tag: "Worth watching", points: ["4.5 days vs 1.5 days in 8 of 12 ZIPs"] },
  ],
  recommendations: [
    { title: "Enforce MAP with your vendor manager", points: ["Drafted, with crawl evidence", "Recovers about $4K a week"], action: { kind: "inbox", label: "Open the escalation", batchId: "buybox-review" } },
    { title: "Keep the offer from being suppressed again", points: ["Watch availability on every crawl", "Tell Michelle the moment it drops"], action: { kind: "watch", label: "Watch availability" } },
  ],
}

const noir: GapNode = {
  id: "sku-noir",
  name: "Noir Cherry Large Jar, 22 oz",
  level: "SKU",
  asin: "B08NF9KBZ4",
  lastWeek: { sales: 0.052, plan: 0.055 },
  wtd: 0.029,
  eow: { projected: 0.051, plan: 0.056 },
  equation: { traffic: -6, conversion: -4, price: 0, sales: -10 },
  drivers: [
    { title: "Halloween deal badge not showing", value: -0.002, tag: "Live", points: ["20% off isn't shown on the page", "Deal runs to Oct 31"] },
    { title: "Lost the buy box on 3 of 12 crawls", value: -0.001, tag: "Live", points: ["WickWorks below MAP in Chicago and Miami"] },
  ],
  recommendations: [
    { title: "Restore the deal badge", points: ["Drafted to your vendor manager"], action: { kind: "inbox", label: "Open the badge fix", batchId: "promo-badge" } },
  ],
}

const jar: GapNode = {
  id: "cat-jar",
  name: "Jar candles",
  level: "Category",
  lastWeek: { sales: 1.32, plan: 1.46 },
  wtd: 0.71,
  eow: { projected: 1.33, plan: 1.47 },
  equation: { traffic: -7, conversion: -3, price: 0, sales: -10 },
  drivers: [
    { title: "Buy box lost on 4 hero SKUs to sellers below MAP", value: -0.082, tag: "Live", points: ["CandleDepot and WickWorks", "Since Oct 1"] },
    { title: "Halloween content not live on 214 core SKUs", value: -0.038, tag: "Live", points: ["One approval away in Mike's inbox", "Expires in 18 days"] },
    { title: "Offers suppressed on 5 SKUs", value: -0.02, tag: "Resolved", points: ["Reinstated Oct 2"] },
  ],
  recommendations: [
    { title: "Enforce MAP on the 4 hero SKUs", points: ["Drafted, with crawl evidence"], action: { kind: "inbox", label: "Open the escalation", batchId: "buybox-review" } },
    { title: "Get the Halloween content live", points: ["Nudge Mike: $660K one approval away"], action: { kind: "watch", label: "Tell me when it's live" } },
  ],
  children: [amber, noir],
  more: 38,
}

const gift: GapNode = {
  id: "cat-gift",
  name: "Gift sets",
  level: "Category",
  lastWeek: { sales: 0.46, plan: 0.49 },
  wtd: 0.25,
  eow: { projected: 0.47, plan: 0.5 },
  equation: { traffic: -5, conversion: -2, price: 0, sales: -7 },
  drivers: [{ title: "Brightwick cut gift-set prices 20%", value: -0.03, tag: "Live", points: ["Took 4 more sponsored slots", "Your share −0.6 pts"] }],
  recommendations: [{ title: "Win back sponsored slots on gift terms", points: ["Ally for Media", "+$60K this quarter"], action: { kind: "play", label: "Launch the media play", playId: "bw-media" } }],
}

const tins: GapNode = {
  id: "cat-tins",
  name: "Travel tins",
  level: "Category",
  lastWeek: { sales: 0.32, plan: 0.33 },
  wtd: 0.18,
  eow: { projected: 0.32, plan: 0.33 },
  equation: { traffic: -2, conversion: -1, price: 0, sales: -3 },
  drivers: [{ title: "Shipping slower than Prime on 4 SKUs", value: -0.01, tag: "Worth watching", points: ["2.5 days slower in 8 ZIPs"] }],
  recommendations: [{ title: "Flag to your 3PL", points: ["Drafted in your inbox"], action: { kind: "inbox", label: "Open the shipping fix", batchId: "shipping" } }],
}

const aurelle: GapNode = {
  id: "brand-aurelle",
  name: "Aurelle Candles",
  level: "Brand",
  lastWeek: { sales: 2.1, plan: 2.28 },
  wtd: 1.14,
  eow: { projected: 2.12, plan: 2.3 },
  equation: { traffic: -6, conversion: -2, price: 0, sales: -8 },
  drivers: [
    { title: "Jar candles: buy box and Halloween content", value: -0.14, tag: "Live", points: ["4 hero SKUs lost the buy box", "214 SKUs waiting on approval"] },
    { title: "Gift sets: Brightwick's price cut", value: -0.03, tag: "Live", points: ["Your share −0.6 pts"] },
    { title: "Travel tins: shipping speed", value: -0.01, tag: "Worth watching", points: ["Slower than Prime in 8 ZIPs"] },
  ],
  recommendations: [
    { title: "Enforce MAP on 4 hero jar candles", points: ["Biggest single cause"], action: { kind: "inbox", label: "Open the escalation", batchId: "buybox-review" } },
    { title: "Answer Brightwick in gift sets", points: ["Win back sponsored slots"], action: { kind: "play", label: "Launch the media play", playId: "bw-media" } },
  ],
  children: [jar, gift, tins],
}

const hearthwood: GapNode = {
  id: "brand-hearthwood",
  name: "Hearthwood",
  level: "Brand",
  lastWeek: { sales: 0.78, plan: 0.8 },
  wtd: 0.44,
  eow: { projected: 0.81, plan: 0.81 },
  equation: { traffic: -2, conversion: 0, price: 0, sales: -2 },
  drivers: [{ title: "Cedar & Smoke lost the buy box", value: -0.02, tag: "Live", points: ["Part of the MAP escalation"] }],
  recommendations: [{ title: "Included in the MAP escalation", points: ["Hero SKU, reviewed one by one"], action: { kind: "inbox", label: "Open the escalation", batchId: "buybox-review" } }],
}

const bright: GapNode = {
  id: "brand-bright",
  name: "Bright Citrus",
  level: "Brand",
  lastWeek: { sales: 0.54, plan: 0.58 },
  wtd: 0.32,
  eow: { projected: 0.57, plan: 0.59 },
  equation: { traffic: -4, conversion: -3, price: 0, sales: -7 },
  drivers: [{ title: "2 SKUs out of stock Oct 2–4", value: -0.04, tag: "Resolved", points: ["PO landed Oct 5", "Weeks of cover now 3.2"] }],
  recommendations: [{ title: "Keep cover above 3 weeks into Black Friday", points: ["Ally for Ops drafts the PO expedite"], action: { kind: "play", label: "Launch the stock play", playId: "bf-stock" } }],
}

export const GAP_TREE: GapNode = {
  id: "overall",
  name: "Overall",
  lastWeek: { sales: 3.42, plan: 3.66 },
  wtd: 1.9,
  eow: { projected: 3.5, plan: 3.7 },
  equation: { traffic: -5, conversion: -2, price: 0, sales: -7 },
  drivers: [
    { title: "Aurelle Candles", value: -0.18, tag: "Live", points: ["Buy box on 4 hero jar candles", "Halloween content waiting on approval"] },
    { title: "Bright Citrus", value: -0.04, tag: "Resolved", points: ["2 SKUs out of stock Oct 2–4"] },
    { title: "Hearthwood", value: -0.02, tag: "Live", points: ["Cedar & Smoke lost the buy box"] },
  ],
  recommendations: [
    { title: "Enforce MAP on 4 hero SKUs", points: ["Biggest cause: about $100K of last week's gap"], action: { kind: "inbox", label: "Open the escalation", batchId: "buybox-review" } },
    { title: "Answer Brightwick in gift sets", points: ["Ally for Media"], action: { kind: "play", label: "Launch the media play", playId: "bw-media" } },
  ],
  children: [aurelle, hearthwood, bright],
}

/** Every node by id, depth-first. */
export function flatten(n: GapNode = GAP_TREE, out: GapNode[] = []): GapNode[] {
  out.push(n)
  n.children?.forEach((c) => flatten(c, out))
  return out
}
export const gapNode = (id: string) => flatten().find((n) => n.id === id) ?? GAP_TREE
/** The path from Overall to a node: "Aurelle Candles · Jar candles". */
export function pathTo(id: string, n: GapNode = GAP_TREE, trail: string[] = []): string[] | undefined {
  if (n.id === id) return trail
  for (const c of n.children ?? []) {
    const p = pathTo(id, c, n.id === "overall" ? trail : [...trail, n.name])
    if (p) return p
  }
}
