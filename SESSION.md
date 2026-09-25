# Session log

## Latest: Sep 24–25, 2026

**Where things stand:** the demo tells one story end to end.
1. **Claire** sees the gap to plan and what closes it, and nudges her team.
2. **Mike and Michelle** act in their queues.
3. **The results page** proves what content delivered.

Everything is live on Vercel, pushed to GitHub (`claire-exec-demo` on `himanshuciq/content-agent-vision-demo`), and mirrored on a Claude Design canvas for the CEO.

### Done this session
- **Claire:**
  - The hero reads fact, then gap, then pipeline.
  - The bridge chart runs Current run rate → On autopilot → One approval away → Needs your team → Total opportunity.
  - The autopilot table compares share on autopilot with best in class.
  - The Ops row opens a leakage-prevented waterfall.
  - Only Mike's nudge stays visible.
  - Losses are red with a minus sign.
- **Mike:**
  - The top line, two-line headline and progress bar are split into banked, unlocked today and open, with the quarter total.
  - The inbox is grouped by Claire's buckets with a color per group.
  - "Needs your input" items go through "Review N SKUs", with per-SKU input fields.
  - Projected values are signed (+$500K) and turn green once approved.
- **Michelle:** rebuilt on Mike's layout and tied to Claire's ops numbers ($2.4M / $600K / $200K).
- **Results:**
  - Tables follow the measurement method. Vs category: SKU growth vs category demand growth, lead vs usual, adjusted for price, ads and stock. A/B: lift, confidence, test length.
  - Every percentage carries its dollar total.
- **Everywhere:**
  - Ask Ally is on every page, with page-specific questions.
  - Four text shades.
  - One button style.
  - One column-header style.
- **Data:**
  - Content totals exactly $1.5M (the syndication batch is now $140K).
  - Seasonal events are fixed per period: back to school for Q3, Mother's Day for Q2.
- **Tooling:**
  - The `ciq-prototype` skill.
  - `design-specs.md` number rules.
  - The Vercel CLI deploy.
  - The Claude Design canvas: https://claude.ai/artifact/G4XhPgbKTBCvL1dgXp3VKp

### Open questions
- Should the last chart bar be "Total opportunity" ($46.8M) when the headline says $6.8M in the pipeline? My recommendation is "Potential total".
- Halloween (Oct 31, deadline Oct 8) is counted as Q3 money. Say "open now", or move it to Q4?
- Best-in-class autopilot percentages, "usually +X pts" leads and the category demand figures are mock. Do we have real sources?
- Michelle's buy box example has our price ($319) below the $499 MAP floor. Change the floor to $299?
- Should `/` redirect to `/claire-waterfall`?

### Next steps
See `PLAN.md`. The top item is closing the loop: when Mike or Michelle acts, Claire's page should show it.
