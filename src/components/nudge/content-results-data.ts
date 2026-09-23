/**
 * "See all SKUs": content results for last quarter, across every type of work.
 * Totals tie to the "How we did" rows ($340K + $270K + $90K = $700K). Lifts are
 * measured against each type's comparison: the category for seasonal, old
 * content in A/B tests for foundational and retail readiness.
 */

export type ResultType = "seasonal" | "foundational" | "retail-readiness"

export interface Lifts {
  /** $M */
  incremental: number
  /** Percent lifts. */
  sales: number
  units: number
  traffic: number
  conversion: number
}

export interface ResultTotals extends Lifts {
  promised: number
  live: number
  promisedSkus: number
}

export interface SkuLiftRow extends Partial<Lifts> {
  name: string
  asin: string
  happened: string
  tone: "won" | "lost" | "oos" | "not-live"
}

export interface ResultSection {
  type: ResultType
  name: string
  method: "vs category" | "A/B tested"
  totals: ResultTotals
  rows: SkuLiftRow[]
}


export const RESULTS_ALL: ResultTotals = {
  incremental: 0.7,
  promised: 0.89,
  sales: 3.5,
  units: 3.6,
  traffic: 2.4,
  conversion: 1.1,
  live: 280,
  promisedSkus: 346,
}

export const RESULT_SECTIONS: ResultSection[] = [
  {
    type: "seasonal",
    name: "Seasonal · Mother's Day",
    method: "vs category",
    totals: { incremental: 0.34, promised: 0.44, sales: 3.1, units: 3.3, traffic: 2.2, conversion: 0.9, live: 200, promisedSkus: 240 },
    rows: [
      { name: "Rose and peony gift set", asin: "B0CT4R9X1K", happened: "New title live", tone: "won", incremental: 0.027, sales: 6.5, units: 6.9, traffic: 4.1, conversion: 2.3 },
      { name: "Vanilla bean soy jar", asin: "B0BN7Q2M8D", happened: "New title live", tone: "won", incremental: 0.015, sales: 4.0, units: 4.3, traffic: 2.6, conversion: 1.3 },
      { name: "Lavender pillar candle", asin: "B0C1KJ5P3W", happened: "New title live", tone: "won", incremental: 0.018, sales: 1.4, units: 1.6, traffic: 1.0, conversion: 0.4 },
      { name: "Multipack votive set", asin: "B0D2XH8T6R", happened: "Grew slower than the category", tone: "lost", incremental: -0.002, sales: -0.8, units: -0.6, traffic: 0.3, conversion: -1.1 },
      { name: "Pillar candle, 4-pack", asin: "B0BZ3L7V9C", happened: "Out of stock 9 days", tone: "oos", incremental: -0.006, sales: -14.0, units: -14.2, traffic: 1.8, conversion: -15.6 },
      { name: "Mini candle sampler", asin: "B0C9WF4N2E", happened: "Not approved in time", tone: "not-live" },
    ],
  },
  {
    type: "foundational",
    name: "Foundational",
    method: "A/B tested",
    totals: { incremental: 0.27, promised: 0.32, sales: 4.2, units: 4.3, traffic: 2.6, conversion: 1.6, live: 60, promisedSkus: 78 },
    rows: [
      { name: "Bright citrus zest soy jar", asin: "B0AK2P8R5T", happened: "Won A/B test", tone: "won", incremental: 0.014, sales: 6.1, units: 6.4, traffic: 3.9, conversion: 2.1 },
      { name: "Amber floral jar candle", asin: "B0B6M3D9QX", happened: "Won A/B test", tone: "won", incremental: 0.011, sales: 5.2, units: 5.5, traffic: 3.2, conversion: 1.9 },
      { name: "Cedar and sage 3-wick", asin: "B0C8T1V4LN", happened: "Won A/B test", tone: "won", incremental: 0.009, sales: 4.8, units: 5.0, traffic: 2.7, conversion: 2.0 },
      { name: "Noir cherry jar, 3 sizes", asin: "B0BQ5H2W7J", happened: "Lost, back to old content", tone: "lost", incremental: -0.001, sales: -1.2, units: -1.0, traffic: -1.6, conversion: 0.4 },
      { name: "Gift set trio", asin: "B0D4R6K1ZP", happened: "Lost, back to old content", tone: "lost", incremental: -0.001, sales: -0.9, units: -0.9, traffic: 0.2, conversion: -1.1 },
      { name: "Sea salt travel tin", asin: "B0C3N9X5FA", happened: "Waiting for approval", tone: "not-live" },
    ],
  },
  {
    type: "retail-readiness",
    name: "Retail readiness",
    method: "A/B tested",
    totals: { incremental: 0.09, promised: 0.13, sales: 3.7, units: 3.8, traffic: 2.9, conversion: 0.8, live: 20, promisedSkus: 28 },
    rows: [
      { name: "Hand-poured amber, 14 oz", asin: "B0B2F7L4VQ", happened: "Unblocked, won A/B test", tone: "won", incremental: 0.006, sales: 5.0, units: 5.2, traffic: 3.8, conversion: 1.2 },
      { name: "Wood-wick pillar", asin: "B0C5J8R3MT", happened: "Unblocked, won A/B test", tone: "won", incremental: 0.005, sales: 4.4, units: 4.5, traffic: 3.3, conversion: 1.1 },
      { name: "Linen mist diffuser", asin: "B0D1Q6W2HK", happened: "Unblocked, lost A/B test", tone: "lost", incremental: -0.001, sales: -0.7, units: -0.5, traffic: 0.1, conversion: -0.8 },
      { name: "Ceramic travel candle", asin: "B0BX4T9N6D", happened: "Still blocked from syndication", tone: "not-live" },
    ],
  },
]

/* ---------------------------------------------------------------------------
 * Period filter: last closed month, quarter or year, matching "How we did".
 * Month and year reuse the quarter's SKU rows, re-scaled so every total ties
 * to that period's content row (August $238K, FY25 $1.79M).
 * ------------------------------------------------------------------------- */
export type ResultPeriod = "qtd" | "month" | "quarter" | "year"

export interface PeriodResults {
  name: string
  all: ResultTotals
  sections: ResultSection[]
}

type Scale = { name: string; incremental: number; promised: number; live: number; promisedSkus: number }

function rescale(base: ResultSection, t: Scale): ResultSection {
  const k = t.incremental / base.totals.incremental
  return {
    ...base,
    name: t.name,
    totals: { ...base.totals, incremental: t.incremental, promised: t.promised, live: t.live, promisedSkus: t.promisedSkus },
    rows: base.rows.map((r) => (r.incremental === undefined ? r : { ...r, incremental: r.incremental * k })),
  }
}

const [SEASONAL_Q, FOUNDATIONAL_Q, READINESS_Q] = RESULT_SECTIONS

export const RESULTS_BY_PERIOD: Record<ResultPeriod, PeriodResults> = {
  /** This quarter so far (Q3 FY26): ties to CONTENT_BANKED_Q3, $520K of $580K projected. */
  qtd: {
    name: "Q3 FY26 so far",
    all: { incremental: 0.52, promised: 0.58, sales: 3.4, units: 3.5, traffic: 2.3, conversion: 1.1, live: 207, promisedSkus: 237 },
    sections: [
      rescale(SEASONAL_Q, { name: "Seasonal · Back to school", incremental: 0.26, promised: 0.3, live: 150, promisedSkus: 168 }),
      rescale(FOUNDATIONAL_Q, { name: "Foundational", incremental: 0.18, promised: 0.19, live: 45, promisedSkus: 55 }),
      rescale(READINESS_Q, { name: "Retail readiness", incremental: 0.08, promised: 0.09, live: 12, promisedSkus: 14 }),
    ],
  },
  month: {
    name: "August",
    all: { incremental: 0.238, promised: 0.26, sales: 3.3, units: 3.4, traffic: 2.3, conversion: 1.0, live: 100, promisedSkus: 120 },
    sections: [
      rescale(SEASONAL_Q, { name: "Seasonal · Back to school", incremental: 0.12, promised: 0.13, live: 70, promisedSkus: 82 }),
      rescale(FOUNDATIONAL_Q, { name: "Foundational", incremental: 0.09, promised: 0.1, live: 22, promisedSkus: 28 }),
      rescale(READINESS_Q, { name: "Retail readiness", incremental: 0.028, promised: 0.03, live: 8, promisedSkus: 10 }),
    ],
  },
  quarter: { name: "Q2 FY26", all: RESULTS_ALL, sections: RESULT_SECTIONS },
  year: {
    name: "FY25",
    all: { incremental: 1.79, promised: 2.0, sales: 3.4, units: 3.5, traffic: 2.3, conversion: 1.1, live: 1060, promisedSkus: 1260 },
    sections: [
      rescale(SEASONAL_Q, { name: "Seasonal · 11 events", incremental: 0.87, promised: 0.98, live: 740, promisedSkus: 860 }),
      rescale(FOUNDATIONAL_Q, { name: "Foundational", incremental: 0.69, promised: 0.77, live: 240, promisedSkus: 300 }),
      rescale(READINESS_Q, { name: "Retail readiness", incremental: 0.23, promised: 0.25, live: 80, promisedSkus: 100 }),
    ],
  },
}
