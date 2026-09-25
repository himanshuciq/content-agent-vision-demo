/**
 * Review policy: how much a person reviews depends on how much a SKU matters.
 * SKU tiers come from revenue; each tier has a default mode; two optional
 * switches send every title or main-image change to review; review rules
 * override for a scope (retailer, brands, SKU groups, tier). The most specific
 * rule wins. "Needs your input" is not a mode: it's a state of the work.
 */

export type SkuTier = "hero" | "core" | "tail"
export type ReviewMode = "each" | "bulk" | "autopilot"

export const MODE_LABEL: Record<ReviewMode, string> = { each: "Review each", bulk: "Approve in bulk", autopilot: "Autopilot" }
export const MODES: ReviewMode[] = ["each", "bulk", "autopilot"]
export const TIERS: SkuTier[] = ["hero", "core", "tail"]

/** Tier definitions by share of sales, and the catalog's current size in each (mock). */
export const TIER_INFO: Record<SkuTier, { label: string; band: string; skus: number; share: number }> = {
  hero: { label: "Hero", band: "SKUs making your top 50% of sales", skus: 42, share: 48 },
  core: { label: "Core", band: "The next 40% of sales", skus: 610, share: 41 },
  tail: { label: "Tail", band: "The last 10% of sales", skus: 2300, share: 11 },
}

export interface Scope {
  retailer: string
  brands: string[]
  skuGroups: string[]
}

export interface ReviewRule extends Scope {
  id: string
  /** Undefined = every tier. */
  tier?: SkuTier
  mode: ReviewMode
  author: string
  date: string
}

export interface KnowledgeEntry extends Scope {
  id: string
  text: string
  author: string
  date: string
}

export interface Policy {
  tiers: Record<SkuTier, ReviewMode>
  reviewTitles: boolean
  reviewImages: boolean
  rules: ReviewRule[]
}

export const RETAILERS = ["Amazon", "Walmart", "Target"]
export const BRANDS = ["Aurelle Candles", "Hearthwood", "Bright Citrus", "Rasa"]
export const SKU_GROUPS = ["Jar candles", "Gift sets", "Pillar candles", "Travel tins"]

export const DEFAULT_POLICY: Policy = {
  tiers: { hero: "each", core: "bulk", tail: "autopilot" },
  reviewTitles: false,
  reviewImages: false,
  rules: [
    { id: "r1", retailer: "Amazon", brands: ["Hearthwood"], skuGroups: [], tier: "core", mode: "each", author: "Claire Bennett", date: "Sep 22, 2026" },
  ],
}

export const DEFAULT_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "k1",
    text: 'Do not use language such as "Made in USA". We\'re not legally allowed to make that claim; where relevant, "Originates in USA" can be used.',
    retailer: "Amazon",
    brands: ["Aurelle Candles"],
    skuGroups: [],
    author: "Mike Chen",
    date: "May 13, 2026",
  },
  {
    id: "k2",
    text: "Titles must not contain trademark symbols and must not exceed 150 characters.",
    retailer: "Amazon",
    brands: ["Aurelle Candles", "Hearthwood"],
    skuGroups: ["Jar candles"],
    author: "Mike Chen",
    date: "Jun 2, 2026",
  },
]

/** How specific a rule is: SKU groups beat brands, brands beat retailer-only. */
const specificity = (r: ReviewRule) => (r.skuGroups.length ? 4 : 0) + (r.brands.length ? 2 : 0) + (r.tier ? 1 : 0)

/** The rule that governs a SKU, if any: matching scope, most specific first, newest on a tie. */
export function ruleFor(policy: Policy, sku: { retailer: string; brand: string; skuGroup: string; tier: SkuTier }) {
  return policy.rules
    .filter(
      (r) =>
        r.retailer === sku.retailer &&
        (r.brands.length === 0 || r.brands.includes(sku.brand)) &&
        (r.skuGroups.length === 0 || r.skuGroups.includes(sku.skuGroup)) &&
        (!r.tier || r.tier === sku.tier),
    )
    .sort((a, b) => specificity(b) - specificity(a) || b.id.localeCompare(a.id))[0]
}

/** The mode for a SKU: its rule if one matches, else its tier's default. */
export function modeFor(policy: Policy, sku: { retailer: string; brand: string; skuGroup: string; tier: SkuTier }): ReviewMode {
  return ruleFor(policy, sku)?.mode ?? policy.tiers[sku.tier]
}

/** A batch's SKUs by tier ($M), and which fields its changes touch. */
export interface TierSplit {
  retailer: string
  brand: string
  skuGroup: string
  tiers: Record<SkuTier, { skus: number; value: number }>
  /** SKUs whose change touches the title / the main image. */
  titleSkus: number
  imageSkus: number
}

/**
 * How a batch ships under a policy: SKUs and value per mode. The title and image
 * switches pull the SKUs whose change touches that field into "Review each",
 * in proportion within each tier.
 */
export function shipPlan(policy: Policy, split: TierSplit) {
  const out: Record<ReviewMode, { skus: number; value: number; byTier: Partial<Record<SkuTier, number>> }> = {
    each: { skus: 0, value: 0, byTier: {} },
    bulk: { skus: 0, value: 0, byTier: {} },
    autopilot: { skus: 0, value: 0, byTier: {} },
  }
  const total = TIERS.reduce((n, t) => n + split.tiers[t].skus, 0)
  const fieldShare = Math.min(
    1,
    Math.max(policy.reviewTitles ? split.titleSkus : 0, policy.reviewImages ? split.imageSkus : 0) / Math.max(total, 1),
  )
  for (const tier of TIERS) {
    const { skus, value } = split.tiers[tier]
    const mode = modeFor(policy, { ...split, tier })
    const pulled = mode === "each" ? 0 : Math.round(skus * fieldShare)
    const add = (m: ReviewMode, n: number, v: number) => {
      out[m].skus += n
      out[m].value += v
      out[m].byTier[tier] = (out[m].byTier[tier] ?? 0) + n
    }
    if (pulled) add("each", pulled, (value * pulled) / skus)
    if (skus - pulled) add(mode, skus - pulled, (value * (skus - pulled)) / skus)
  }
  return out
}
