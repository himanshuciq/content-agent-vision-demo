# Waterfall-only change log

From Sep 2026, design changes land in `/claire-waterfall` only. `/claire` (tier version) is frozen at its pre-"business-first" state: status strip + "driven by Ally" pill, hero, tiers with Already banked, How we did (Q2) with the Mother's Day / Foundational / Retail readiness cards, How you compare, inline Ask Ally.

Each row is a waterfall change to port to `/claire` if we keep it.

| Date | Change (waterfall) | Files | Port to /claire? |
|---|---|---|---|
| Sep 23 2026 | Business-first hero: "$37M so far · on pace for $40M against a $45M plan" + "$5M short of plan. $6.8M open to close it." Replaces status strip, "driven by Ally" pill and "Hi Claire" | `claire/business-hero.tsx`, `data.ts` (BUSINESS, fmtBiz) | Open |
| Sep 23 2026 | Bridge to plan chart: on pace $40M → +3.7 / +2.2 / +0.9 → with Ally $46.8M, dashed plan line; banked stage removed; "With Ally" opens open-by-area | `waterfall/waterfall-chart.tsx`, `waterfall/stage-detail.tsx`, `data.ts` (WATERFALL_STAGES) | n/a (waterfall-only chart) |
| Sep 23 2026 | "This quarter so far": Projected $1.28M · Delivered $1.20M, paired bars by area, content opens bars by type + dot bullets + link to results (period=qtd). Replaces How we did (Q2) and Already banked | `claire/this-quarter-section.tsx`, `delivered-content-data.ts` (bullets) | Open |
| Sep 23 2026 | Removed How you compare (autopilot) | page only | Open |
| Sep 23 2026 | Floating translucent Ask Ally bar; chip "Why is content $60K behind projection?" (Q3) | `claire/ask-ally.tsx`, `ask-ally-answers.tsx` | Open (/claire uses `ask-ally-inline.tsx`) |
| Sep 23 2026 | Results page: "This quarter" period (default), "projected" wording | `results/*`, `content-results-data.ts` | Shared (Q2 cards link with period=quarter) |
| Sep 23 2026 | "This quarter so far": paired bars replaced by the table; columns Projected · Delivered · vs projected (Delivered stays bold); Content opens to dot bullets, type rows, then "See SKU-level results and method" | `claire/this-quarter-section.tsx`, `delivered/columns.tsx` (projectedFirst), `delivered/content-delivered-row.tsx` (bullets, resultsHref), `delivered/delivered-summary-row.tsx` | Open: /claire still uses Delivered · Promised · vs promise |
| Sep 23 2026 | Headline: "$5M gap to plan. $6.8M of opportunity can close it." (was "$5M short of plan. $6.8M open to close it.") | `claire/business-hero.tsx` | Only if /claire adopts the business-first hero |
| Sep 23 2026 | Content opens to a waterfall by type (Foundational → Seasonal → Retail readiness → Content) against a dashed "Projected" line; each bar shows 2–3 dot bullets, total shows content bullets; results link below | `claire/content-waterfall.tsx` (new), `claire/this-quarter-section.tsx`, `delivered-content-data.ts` (bullets per type, Q3) | Open |
| Sep 23 2026 | Content waterfall bullets: TEMPORARY "Try: Hover · Click · Panel" switch. Hover = card beside the bar; Click = popover under the bar, closes on outside click; Panel = card below the chart. Pick one, then remove the switch | `claire/content-waterfall.tsx` | Decide first |
| Sep 23 2026 | Content waterfall: Panel chosen (below the chart, opens on the Content total). Hover/Click and the Try switch removed | `claire/content-waterfall.tsx` | Open (with the content waterfall) |
