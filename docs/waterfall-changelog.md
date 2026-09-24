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
| Sep 24 2026 | Header bar removed (logo, Reset, Email to my team, avatar). Small Ally mark moves onto the hero's first line; Reset becomes a faint link at the page bottom; email moves to an Ask Ally chip ("Email this summary to my team" downloads the PDF) | `app/claire-waterfall/page.tsx`, `claire/business-hero.tsx`, `claire/ask-ally-answers.tsx` | Open |
| Sep 24 2026 | Weekly banner is an overlay card at the top, auto-hides after 5s, stays while hovered | `claire/weekly-banner.tsx` (overlay prop) | Open |
| Sep 24 2026 | Ask Ally drawer collapses on click outside; clicking the pill reopens it with the last answer | `claire/ask-ally.tsx` | Open |
| Sep 24 2026 | Stage rows: weekly status gets its own column (lg and up), with the "Expires in N days" chip under it; owner column is just the name. Below lg both stack under the owner | `claire/nudge-row.tsx` (statusColumn prop), `waterfall/stage-detail.tsx` | Open (By area rows in area-view still stack) |
| Sep 24 2026 | Stage panel header uses the row grid: total aligns over row values, Nudge team over the Nudge again buttons | `waterfall/stage-detail.tsx` | n/a (waterfall panel) |
| Sep 24 2026 | Content waterfall total bar gray (slate-400), matching the bridge chart: steps colored, totals neutral; type bars stay one content purple | `claire/content-waterfall.tsx` | Open (with the content waterfall) |
| Sep 24 2026 | Content waterfall colors (checked in browser): types one purple (brand-400, no dimming), total slate-500, neutral selection box. Rejected: gray total on lavender box (muddy); hue per type (too loud, teal read as success green) | `claire/content-waterfall.tsx` | Open (with the content waterfall) |
| Sep 24 2026 | Content bullets rewritten (Q3, ties to $60K gap): went live + approval ($45K) + stockout ($15K) with hover "Increase autopilot" (toast); lift 3.4% vs control (A/B split, or category for seasonal) adjusted for ad spend, price, availability; 25 of 207 underperformed, Ally tuned itself (sparkle bullet) | `delivered-content-data.ts` (Bullet type, learn tone, action), `claire/content-waterfall.tsx` | Open |
| Sep 24 2026 | Content bullets 2–3 in Himanshu's wording (3.2% vs control; "Ally tuned itself … to make the next run better"); results page Q3 lifts aligned to 3.2% | `delivered-content-data.ts`, `content-results-data.ts` | Open |
| Sep 24 2026 | Type bullets refined: Foundational (38 of 45 won, 4.0%; 7 lost → agent context); Seasonal back to school (150 of 168, 2.9% over category adjusted; $40K = 18 unapproved $25K + stockout $15K, hover Increase autopilot); Retail readiness (10 unblocked via 28 backend attributes; 3 need team input $10K, hover Nudge team → real Slack DM to Mike). Content totals re-tied: 205 of 236 live, $35K approval + $10K team + $15K stockout = $60K | `delivered-content-data.ts`, `content-results-data.ts`, `claire/content-waterfall.tsx` | Open |

## Mike's home: inbox grouped like Claire's page (shared data change)
- **Shared data (affects /claire and /claire-waterfall):** `DEADLINE.expiring` is now $500K (was $740K), the Halloween batch alone. The content approval row reads "Halloween seasonal updates and a foundational refresh." ($740K = Halloween $500K + Foundational refresh $240K). Mike's nudge target now names both batches.
- Batch approve values now equal their listed values (Halloween $500K, Foundational $240K, Retail readiness $180K) so Mike's totals tie to Claire's.
- /mike: headline only ("$740K is one approval from live. $500K of it expires in 18 days."), inbox grouped One approval away / Needs your input / On autopilot, Approve all on the first group.
- Sample SKU: side by side, live on Amazon beside Ally's version, with word-level marks (removed struck on the live side, added green on Ally's side). The Halloween pack shot is now styled for Halloween (dusk grade, pumpkins, bats) instead of a grayscale copy.

## All $740K one approval away is seasonal (shared data change)
- **Shared data (affects /claire and /claire-waterfall):** `DEADLINE.expiring` back to $740K. The second approval batch is now "Halloween gift sets" ($240K, 339 SKUs, expires Oct 8) in place of the Foundational refresh. Claire's content row reads "Halloween seasonal updates and gift sets."
- /claire-waterfall: "Hi Claire" restored in the top line, before the period switcher (same spot as "Hi Mike").
- /mike: grounding above the action: "$1.5M of content opportunity is open this quarter." plus Value delivered ($520K of $580K projected), SEO share of voice (42%, up 0.8 pts), AI share of voice (34%, up 1.4 pts), Days saved (7.7). Headline now "$740K is one approval from live. All of it expires in 18 days."

## Links and Mike's top shaped like Claire's
- Every "back to Claire" link and redirect (Mike, Michelle, content results, impact back bar) now goes to /claire-waterfall.
- /mike top: one line like Claire's ("Hi Mike · Q3 FY26 · $520K of $580K delivered · SEO share of voice 42% ↑0.8 pts · AI share of voice 34% ↑1.4 pts · 7.7 days saved"), then the 40px headline, then "$1.5M open in content · $740K one approval away · $600K needs your input · $200K on autopilot". Metric tiles removed; Reset moved to a faint control below the page.

## Mike: two-line headline, banked bar, work types, delivered section
- /mike headline: "$1.5M of content opportunity is open this quarter." (24px) over "$740K is one approval from live. All of it expires in 18 days." (40px). Breakdown line removed.
- Progress bar is the quarter's content: $520K banked (dark), what Mike approves (lighter), $1.5M open.
- Left rail names each batch by work type with a subscript: Seasonal (Halloween moments / Halloween gift sets), Foundational (Backend keywords and attributes), Retail readiness (Attributes Amazon requires; PIM → PDP fixes on autopilot). SKU counts now equal what gets approved (378, 331, 273, 94); the separate "N SKUs" line is gone, only "See all N SKUs".
- New "This quarter so far" section on /mike, content only: Claire's content waterfall, without the Nudge team button (on Mike's page the team is Mike).
- **Shared data:** the approval batch counts changed (Halloween 384→378, gift sets 339→331, readiness 100→94); the team-content nudge now reads "Foundational and retail readiness".

## Mike: colored buckets, input and autopilot batches, bar moves on every action
- Left rail groups use Claire's waterfall colors: purple One approval away, amber Needs your input, blue On autopilot (tinted header + colored edge).
- Needs your input: "Add Halloween concepts" (Seasonal, $420K, 245 SKUs; Ally localizes concepts per retailer and customizes per SKU) replaces Backend keywords and attributes. Retail readiness renamed "Listings blocked from syndication" with the callout "We added 412 of 470 attributes on 94 SKUs automatically. The other 58, on 21 SKUs, need your team's input…" and a Fill 58 attributes button.
- On autopilot: PIM → PDP fixes is Foundational and clickable (fills blank images, descriptions, bullets, attributes from PIM).
- Progress bar moves on every action (approve, add concepts, fill attributes); open = sum of batches not yet acted on.
- Top line no longer shows delivered (it's in the section below). Reset moved inside the page bottom, like Claire's.
- **Shared data:** Claire's team-tier content row now reads "Halloween concepts and attributes blocking syndication."

## Needs-your-input flow, buttons, text colors
- /mike input batches: button "Review N SKUs" (245 concepts, 21 retail readiness) opens the first SKU; each field Ally can't fill is a full-width "Your input" box with the live value above it; footer "Send to Ally". List tags show only the deadline or state (no repeated counts).
- /mike buttons: one shared style (44px, 15px semibold, same border and radius); primary filled, secondary outlined. "Or review all N SKUs one by one" moved under the buttons.
- Text colors standardized to four shades: slate-950 headings and numbers, slate-700 body, slate-500 secondary, slate-400 hints (900→950, 800→700, 600→500). Applied to Mike and waterfall-only Claire components. **Shared:** ask-ally-answers.tsx is also used by /claire's inline Ask Ally, so its text shades changed there too. Not yet applied: nudge-row, delivered/columns, weekly-banner (shared with /claire).

## Autopilot drill-down: share on autopilot vs best in class
- /claire-waterfall, On autopilot stage: new table (waterfall/autopilot-detail.tsx). Per workstream: what runs itself, value, % of its open opportunity on autopilot (content 13%, media 24%, ops 6%), best in class (35%, 60%, 30%), and Increase autopilot on hover. Header shows the totals (13% vs 40% weighted) and Increase autopilot for all.
- New data constant AUTOPILOT_BEST_IN_CLASS in data.ts (benchmarks are mock).

## Autopilot table redo + one column-header standard
- Autopilot drill-down redesigned: header states the claim ("13% of your open opportunity runs itself. Best-in-class brands run 40%.") with value and Increase autopilot; each row shows share on autopilot as a filled track with a best-in-class tick on the same track (the gap reads without math). Action column sized so the button never touches the value; descriptions stack under the workstream below lg.
- Column-header standard for every table: one row under the table's title bar, 12px medium slate-500, sentence case, number columns right-aligned (same as "This quarter so far"). Added to the One approval away / Needs your team stage tables (Owner · What's waiting · This week · Value) and autopilot (Workstream · What runs itself · On autopilot vs best in class · Value).
- Value columns line up at the same x across all three stage tables.

## Seasonal events by period (shared data)
- Rule: Q3 FY26 (Jul–Sep, current) = back to school; August = back to school; Q2 FY26 (Apr–Jun) = Mother's Day; FY25 = 11 shopping events. Halloween is the upcoming event (open work, publish by Oct 8).
- **Shared data:** August's content story changed from "rewrote 61 product pages ahead of back to school" to "updated 70 SKUs for back to school, improved everyday content on 22, and unblocked 8 for syndication" to match August's results (100 SKUs live).
- Not changed: the old launchpad home (/, components/landing) still says Prime Day for Q3; it isn't part of the Claire/Mike demo.

## Results page: tables by measurement method (shared page)
- vs category (seasonal): SKU · Result · SKU impressions · Category impressions (the demand benchmark, event weeks vs the 4 weeks before) · Lead (pts, the only colored column) · Adjusted for (price, ad spend, days out of stock; material ones in amber) · Incremental sales (after normalizing). Caption states the method.
- A/B tested (foundational, retail readiness): SKU · Result · Lift vs old content (colored) · Confidence · Test length · Incremental sales. Caption: both halves see the same price, ads and stock, so nothing needs adjusting.
- Units, traffic and conversion lifts removed from the tables and the summary strip. Strip is method-aware: seasonal = your impressions, category impressions, lead; A/B = lift, tests won, average confidence; all = sales lift, seasonal lead, A/B tests won.
- Back to school (Q3, August) has its own SKUs (dorm jar, teacher gift set…); the $15K stockout row ties to Claire's Q3 story. Q2 keeps Mother's Day SKUs. Foundational Q3 ties to Claire's "38 of 45 won, 4.0%".
- Result shown as a small status dot plus text, not a pill.
