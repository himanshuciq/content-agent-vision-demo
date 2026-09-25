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
