# Learnings: what 200 rounds of feedback taught us

A synthesis of every round of feedback on the Ally demo: Himanshu's reviews, and the exec reviews with Guru and Kal on Sep 21, 2026. Each theme gives the principle, then the moments that taught it. The rules are enforced by the `ciq-prototype` skill. Full systems-thinking notes are in `~/.claude/MY_LEARNINGS.md`.

---

## 1. Start from the business, then let people drill in

**Principle:** the exec's first screen answers "where am I against my number, and what closes the gap?" Detail is one click away, never in the way.

- **The exec review reset the page.** Start with plan, run rate and gap: "You're tracking to $40M… That's $5M short of your $45M plan. We have $6.8M in the pipeline to close it." Only then the split by lever, and how much unlocks in 45 minutes.
- **Say it like a person:** fact, then the fear (the gap), then the comfort (the pipeline). "$5M gap to plan" read as AI shorthand.
- **Summary up front, detail on demand.** Give one line for what Ally did, one for the value, and one for how it was measured. The method, SKUs and funnel sit behind a click. "You are going into too much detail too soon" is the first objection an exec raises.
- **Simplify the demo world.** One seasonal event per period (Q3 back to school, Q2 Mother's Day). Content first, because content is what gets demoed. No stacking of lever × type of work × three seasons.
- **Every doer page mirrors the exec page:** the same buckets, the same numbers, the same top-line shape. Mike needed grounding ("$1.5M of content opportunity is open this quarter") before his inbox, or the page felt abrupt.

## 2. Action first, not dashboard first

**Principle:** every block ends in something to do: nudge, approve, increase autopilot, review.

- **"The tenet is actionability first."** Nudge team stayed when it was nearly cut. Individual nudges show on hover and line up with the column.
- **Show who has acted and who hasn't:** "Michelle and James have started · Mike hasn't yet." Only the person who hasn't started gets a visible nudge.
- **The Monday email goes out automatically** (auto-send on by default). The exec shouldn't have to trigger routine work.
- **Put the fix next to the gap.** "28 waited on approval (−$35K)" gets an "Increase autopilot" action on hover. Autopilot share sits beside best in class, with "Increase autopilot" right there.
- **The doer is bulk-first.** "Approve 378 SKUs" is the primary action. "Preview a sample" opens inline, with no page change. "Review all" is a quiet link underneath. "Needs your input" works the same way: "Review N SKUs", then per-SKU inputs, then "Send to Ally".

## 3. Numbers must tie, everywhere, every time

**Principle:** one wrong sum and the exec stops trusting every other number.

- **"All the numbers should tie. The final bar should be the sum of all the preceding ones."**
- **Banked didn't tie, so it came off the top** and moved into "This quarter so far".
- **Remove duplicate hand-typed values.** $500K vs $490K left "$15K still one approval from live" after Approve all. $1.54M vs $1.5M made the bar total look wrong. Derive totals from their parts.
- **A tag on a total is a claim about every part of it.** "Expires in 18 days" on $740K meant all of it had to be seasonal.
- **Show one count.** "384 SKUs" next to "See all 378" invited the question "why the difference?"
- **Keep events and dates consistent** with the period and the demo's "today". No Mother's Day SKUs under back to school, and no promo that ended before the demo date.
- **Every percentage carries its dollar total:** "Sales increased $520K (3.2%)".
- **A new total is fine when the known number stays visible:** "$520K banked · $1.5M open · $2.02M this quarter".

## 4. Prove value like a skeptical CFO is in the room

**Principle:** every dollar shows projected vs delivered, how it was measured, and why any gap happened. The method has to survive the first objection.

- **Isolate each agent's value.** Content value is content alone; don't mix in ops.
- **Seasonal is measured vs category.** Nobody A/B tests during an event, because half the shoppers would miss the event content.
  - Compare SKU growth with category demand growth, event weeks vs the 4 weeks before. Category impressions or search-term traffic serve as the demand signal.
  - Judge each SKU's lead against its usual lead, so pre-existing outperformance gets no credit.
  - Show the adjustments for price, promotions, ad spend and stockouts, using your own changes, since the category's aren't known.
- **Everything else is A/B tested:** lift vs old content, confidence and test length. Both halves see the same price, ads and stock, so nothing needs adjusting.
- **Communicate the methods simply:** "Seasonal is measured this way. Everything else is A/B tested." One tag each, with the detail in a hover.
- **Expected lift comes from past tests,** and it resets after each change. The next change is measured against today's content, so gains stack. That's the answer to the renewal question, "if value reduces over time, it's not a product I can renew."
- **Own the gap, with reasons that add up.** $580K − $35K waiting − $10K team input − $15K stockout = $520K. A stockout isn't an excuse inside an A/B test, where both halves are affected.
- **Show the learning loop:** what didn't work, and what Ally changed as a result ("Ally tuned itself on what didn't work"). It gets a sparkle mark because it's the product's edge.
- **Results are outcomes.** "Outgrew the category" is a result; "New title live" is not.
- **Ops value is leakage prevented:** each SKU's normal daily sales × the days sooner it was fixed.
- **Projected is signed, not green:** "+$500K", labeled "projected incremental sales", so it isn't read as revenue. Green only once approved.

## 5. Every pixel is a decision

**Principle:** "The entire real estate is very precious. Pay close attention to every single pixel." Look at it as a designer before showing it.

- **A copy deck isn't a design.** Dumping strings onto the page ("Is this a product?") is where this started.
- **Kill empty space and misalignment.** Things that belong together sit together ("$740K expires" under Mike's row). Columns line up across tables.
- **Only claim what a user can see:**
  - Pages whose headers wrapped awkwardly or whose button ran into a value were caught by the user, not by me. Run the audit checklist.
  - When asked "why the 384 vs 378?", fix the data, not the label.
- **One style per element:**
  - buttons: same height, weight and border
  - column headers: one style, on every table
  - text grays: four shades
  - numbers: mono font, right-aligned
- **Color means one thing:**
  - purple is approval
  - amber is needs action soon
  - blue is autopilot
  - green is worked or delivered
  - red is lost
  - totals are gray

  Don't color something only because it was asked for. "Just don't do it because I said it. Take a look."
- **Hover-only for secondary things:** "Select" under a bar, individual nudges, "Increase autopilot" on a bullet. Keep the selected state visible with a soft tint and no focus rings.
- **Realistic detail.** Diffs strike what's removed, keep what stays black, and show what's added in green, side by side. Seasonal images must actually look seasonal.
- **Visualizations earn their place.** The CEO dislikes new chart types. Use a headline number first, a chart only when it carries the argument (the bridge to plan, the content and ops waterfalls). Prefer a clean panel under the chart to popovers.
- **Floating elements stay out of the way.** The banner overlays the page and hides after 5 seconds. Ask Ally floats on every page, its chips connect to the input, and it never says "Ask Ally" twice.

## 6. Words: tight, human, consistent

**Principle:** product copy only. Every line carries a number, label, status or action.

- **"A lot of AI fluff. Do not add this."** Subtitles that describe a section get cut.
- **Tighten.** "Halloween seasonal moments: event titles, deal framing, and AEO specs" becomes "Halloween seasonal updates". "Mike, content analyst" becomes "Mike Content". No em dashes.
- **Effort in minutes or hours** ("45 min"), not "about half a day". Don't count items nobody needs.
- **Say the same thing the same way:**
  - "Review N SKUs", "Approve N SKUs", "Send to Ally"
  - Seasonal · Foundational · Retail readiness
  - "projected", not "promised"
  - "current run rate", not "on pace"
  - "market share", not "share"
  - "Reset", not "Reset demo"
  - "PIM", not "BIM"
- **Tense matches time:** "3 needed your team's input" for the past, "3 SKUs need your team's input" for the open ask.
- **Losses carry a minus and are red;** gains in "worked" bullets are green.

## 7. How we work together

- **Brainstorm when asked, build when approved.** Some requests are "let's brainstorm first".
- **Don't just agree:** "Don't just suck up to me, build on it." Push back with a better option, as with "Total opportunity" at $46.8M vs a $6.8M pipeline.
- **Ask what the concern is before over-applying a rule.** The bar total was fine once $1.5M stayed visible.
- **Test small before fixing big,** and verify in the browser with the pane visible.
- **Protect the work:** commit each change, log shared-data changes, revert cleanly when asked ("we lost a lot of details, revert").
- **Founder-lens QA means recommend, not edit.** Rank the findings as must fix, consistency, and polish.
- **Capture rules once** (skill, memory, `design-specs.md`) so they don't need repeating: "Another time I need to tell you to be a designer."
