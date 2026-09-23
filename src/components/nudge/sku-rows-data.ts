import type { SkuRow, SkuSection } from "./types"

const NEW = { changed: true }

function text(label: string, live: string[], draft: { text: string; changed?: boolean }[]): SkuSection {
  return { kind: "text", label, live, draft }
}

function image(label: string, liveLabel: string, draftLabel: string): SkuSection {
  return { kind: "image", label, liveLabel, draftLabel }
}

/**
 * Per-SKU multi-section Live vs. Ally-draft content for the "See all N SKUs"
 * expand list — real Aurelle catalog rows (sku-1..sku-10), matching the
 * mock's SKUSETS structure (title/bullets/image, or search-terms/attributes).
 */
export const SKU_ROWS: Record<string, SkuRow[]> = {
  halloween: [
    {
      skuId: "sku-1",
      sections: [
        text(
          "Title",
          ["Aurelle Candles Noir Cherry Large Scented Jar, 22 oz"],
          [{ text: "Halloween Aurelle Candles Noir Cherry Large Scented Jar, 22 oz, Spooky Party Décor, 150-Hr Burn", ...NEW }],
        ),
        text(
          "Bullet points",
          ["Rich black cherry with warm spice undertones.", "Up to 150 hours from a single 22 oz jar."],
          [
            { text: "Rich black cherry with warm spice undertones." },
            { text: "Up to 150 hours from a single 22 oz jar." },
            { text: "Save 20% October 1–31 with the on-page coupon.", ...NEW },
          ],
        ),
        image("Primary image", "Standard pack shot", "Halloween pack shot"),
      ],
    },
    {
      skuId: "sku-2",
      sections: [
        text(
          "Title",
          ["Bright Citrus Zest Hand-Poured Soy Jar Candle, 14 oz"],
          [{ text: "Halloween Bright Citrus Zest Hand-Poured Soy Jar Candle, 14 oz, Fall Hosting Décor, 90-Hr Burn", ...NEW }],
        ),
        text(
          "Bullet points",
          ["Grapefruit and lemon zest over clean soy.", "Small-batch soy wax with a lead-free cotton wick."],
          [
            { text: "Grapefruit and lemon zest over clean soy." },
            { text: "Small-batch soy wax with a lead-free cotton wick." },
            { text: "Save 20% October 1–31 with the on-page coupon.", ...NEW },
          ],
        ),
        image("Primary image", "Standard pack shot", "Halloween pack shot"),
      ],
    },
    {
      skuId: "sku-3",
      sections: [
        text(
          "Title",
          ["Warm Amber Floral Soy Jar Candle, 16 oz"],
          [{ text: "Halloween Warm Amber Floral Soy Jar Candle, 16 oz, Autumn Mantel Décor, 110-Hr Burn", ...NEW }],
        ),
        text(
          "Bullet points",
          ["Amber resin layered with soft florals.", "Wide 16 oz vessel for a consistent melt pool."],
          [
            { text: "Amber resin layered with soft florals." },
            { text: "Wide 16 oz vessel for a consistent melt pool." },
            { text: "Save 20% October 1–31 with the on-page coupon.", ...NEW },
          ],
        ),
        image("Primary image", "Standard pack shot", "Halloween pack shot"),
      ],
    },
    {
      skuId: "sku-5",
      sections: [
        text(
          "Title",
          ["Room-Filling Spiced Cedar Three-Wick Soy Candle, 21 oz"],
          [{ text: "Halloween Room-Filling Spiced Cedar Three-Wick Soy Candle, 21 oz, Fall Centerpiece Décor, 120-Hr Burn", ...NEW }],
        ),
        text(
          "Bullet points",
          ["Cracked pepper over dry cedar blend.", "Three wicks for even throw across medium and large rooms."],
          [
            { text: "Cracked pepper over dry cedar blend." },
            { text: "Three wicks for even throw across medium and large rooms." },
            { text: "Save 20% October 1–31 with the on-page coupon.", ...NEW },
          ],
        ),
        image("Primary image", "Standard pack shot", "Halloween pack shot"),
      ],
    },
  ],

  baseline: [
    {
      skuId: "sku-2",
      sections: [
        text(
          "Bullet points",
          ["Hand poured. Six scents.", "Standard soy jar candle."],
          [
            { text: "Hand poured in small batches, six colors of wax dye.", ...NEW },
            { text: "Grapefruit and lemon zest over clean soy, 90-hour burn.", ...NEW },
          ],
        ),
      ],
    },
    {
      skuId: "sku-7",
      sections: [
        text(
          "Bullet points",
          ["Decorative pillar candle set.", "Great for gifting."],
          [
            { text: "Bergamot and grove florals in a two-piece pillar set.", ...NEW },
            { text: "Gift-ready packaging, unscented base for an even burn.", ...NEW },
          ],
        ),
      ],
    },
  ],

  backend: [
    {
      skuId: "sku-3",
      sections: [
        text("Backend search terms", ["candle, jar candle, soy candle"], [{ text: "amber floral candle, long burn soy candle, jar candle gift", ...NEW }]),
        text("Structured attributes", ["Scent family: — · Burn time: —"], [{ text: "Scent family: amber floral · Burn time: 110 hours", ...NEW }]),
      ],
    },
    {
      skuId: "sku-8",
      sections: [
        text("Backend search terms", ["candle, jar candle, linen candle"], [{ text: "coastal linen candle, fresh linen jar candle, gift candle", ...NEW }]),
        text("Structured attributes", ["Scent family: — · Burn time: —"], [{ text: "Scent family: fresh linen · Burn time: 130 hours", ...NEW }]),
      ],
    },
  ],

  readiness: [
    {
      skuId: "sku-4",
      sections: [
        text("Required attributes", ["Country of origin: —"], [{ text: "Country of origin: United States", ...NEW }]),
        text("Required attributes", ["Item form: — · Age range: —"], [{ text: "Item form: solid · Age range: adult", ...NEW }]),
      ],
    },
    {
      skuId: "sku-9",
      sections: [
        text("Required attributes", ["Country of origin: —"], [{ text: "Country of origin: United States", ...NEW }]),
        text("Required attributes", ["Item form: — · Age range: —"], [{ text: "Item form: solid · Age range: adult", ...NEW }]),
      ],
    },
    {
      skuId: "sku-10",
      sections: [
        text("Required attributes", ["Country of origin: —"], [{ text: "Country of origin: Vietnam", ...NEW }]),
        text("Required attributes", ["Item form: — · Age range: —"], [{ text: "Item form: solid · Age range: adult", ...NEW }]),
      ],
    },
  ],
}
