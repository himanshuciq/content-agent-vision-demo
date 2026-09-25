# Plan

Ordered by impact on the demo story. Items come from the founder-lens QA on Sep 24, 2026.

## Now: the demo breaks without these
1. **Close the loop.** When Mike approves or Michelle sends a fix, Claire's page shows it: the row turns "Approved · $740K live" and the money moves from open to delivered.
2. **Hero colors.** Color only the numbers, by what they mean in the chart. Use the regular font with even-width digits for headline numbers, since mono at 44px spaces "$6 . 8M" out.
3. **Q3 vs Q4.** Halloween counts as Q3 open money. Reword it as "open now" or move it.
4. **Stale answer.** Claire's "invest $1M" Ask Ally answer says 384 SKUs; it should be 378.

## Next: consistency
5. **One color per meaning.** Amber means both "needs your team" and "expiring". Blue means both autopilot and the ops agent. Green means both the media agent and success. Keep color for state, and use a label or icon for the agent.
6. **One money format** everywhere: K below $1M, M with one decimal (no "$0.56M", no "$0.9M").
7. **Sentence-case section labels** instead of all-caps mono.
8. **Media drill-down.** Content and Ops open; Media doesn't. Add IROAS by campaign, or make the difference deliberate.
9. **Nudge label.** Say "Nudge" until someone has actually nudged, not "Nudge again".

## Later: polish and scope
10. Hide Ask Ally while scrolling down, or give the bottom of each page room so it doesn't cover content.
11. Push the weekly banner into the page instead of floating it over the header.
12. Make "See all N SKUs" and "Showing 6 of 168" either page for real or say "See examples".
13. Top lines wrap on a 13" laptop; trim them to two metrics.
14. Give James (media) a page, or make his nudge visibly lighter.
15. Retire `/claire`, or port the waterfall changes to it (`docs/waterfall-changelog.md`).
16. Replace mock benchmarks with real sources, or label them illustrative.
17. Connect Vercel to GitHub so a push deploys by itself: link the himanshuciq account to the Vercel login, or move the repo under himanshuj18.

## Parked for the real product: the clock-driven demo
Agreed Sep 25, 2026 to keep the demo on a fixed date (Oct 8, Q4 FY26) for now. When this becomes the product:
- **Event calendar.** Each event has an event day, recommendations appearing 5 weeks before, a live-by date 3 weeks before (full value), and an optional lead-out. Through year end: Halloween (Oct 31, live by Oct 10), Thanksgiving / Black Friday / Cyber Monday (Nov 27, Cyber Monday Nov 30; next event takes over), Holiday gifting (Dec 25). Per-event dates are data, not code.
- **Value scales, doesn't expire.** Live after the live-by date = value × days left in the window; $0 once the window closes. Copy: "Full value if live by Oct 10" → "Worth $240K now · drops about $24K a day".
- **Always-on value.** Starts at go-live and persists until the next change on that SKU (accretive). The A/B result confirms it 4–6 weeks later: "Measuring" → "Confirmed", delivered back-filled from launch.
- **Delivered as dated records** (by lever, type of work, week), so any period is a sum; the date moving is the weekly refresh (on Oct 1 everything becomes Q4).
- **Demo date control** next to Reset to rehearse any day.
- Left out even then: traffic curves inside an event window; per-event content swap rules.
