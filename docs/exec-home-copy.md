# Exec home: copy deck

Source of truth for every string on the exec home screen. Layout follows from this, not the
other way round. If a string is not in this file, it does not go on the screen.

- Mock today: **Monday, October 5, 2026**. Q3 has closed. Q4 has 87 days left.
- All dates and countdowns derive from `TODAY` in `src/components/exec/data.ts`. Never hardcode a date in a component.
- Persona: **Claire Bennett**, VP Ecommerce. Queue owners: **Megan Cole** (content), **Ryan Mitchell** (ops), **Tom Baker** (media).

---

## Voice rules

1. **Sentences, not tables.** A table says "here is data, work it out." A sentence says "here is what happened." Exec home is entirely claims, so it is entirely sentences. Dollar figures are pulled right so the screen is scannable without being read.
2. **"Your Ally team" once**, in the header. After that, "we" for collective work and lowercase agent names (`content agent`, `ops agent`, `media agent`) for individual lines. Never "Ally" four times on one screen.
3. **No personification.** No invented agent humans. Agents are roles.
4. **Two autonomy buckets only**: ran on self-drive, needed a human. The third analytical bucket (agent found it, human fixed it) is expressed as detection speed inside the ops line, not as a share of value.
5. **One word for autonomy: "self-drive."** Identical in product, settings, and deck. Never autopilot, never one-click.
6. **Rounding:** K below one million, M above. $478K, $1.26M. Never $0.48M.
7. **Share moves in points**, not percent. "Up 0.3 points."
8. **No shaming.** Put the number next to the benchmark and let Claire draw the conclusion.
9. Sort agent lines by dollars descending. The order changes as the data changes.

---

## Block 1: What we did

Header carries the period switcher. The underlined word is the control. Options: week, month, quarter, year. Default quarter.

> ### Here's what your Ally team did for you last <u>quarter</u>.

**Business read.** Plan attainment and share combined into one judgment, because the relationship between them is the insight.

Good quarter (default mock state):

> **You closed at 112% of plan.** $46.2M, up 14.6% year over year. And you grew faster than the category: share up 0.3 points to 18.6%.
>
> You're also getting recommended more: 34% AI share of voice, up 1.4 points.

Variant, plan beaten but share lost:

> **You beat plan at 112%, but share slipped 0.3 points to 18.6%.** The category grew faster than you did.

Variant, plan missed (write this one, a screen that only performs on good news is a demo):

> **You closed at 94% of plan.** $38.7M, down 2.1% year over year, and share slipped 0.4 points to 17.9%.

**Attribution line.** This is the load-bearing sentence. It attaches our number to their number.

> **We delivered $1.26M of it.**

Bad quarter variant:

> **We delivered $1.26M against a $2.4M shortfall.**

**Agent lines.** Verb first, dollars pulled right. Sorted by value.

> `media agent` took 78,000 bid and budget actions across 1,400 keywords. **$694K** at $3.01 IROAS
>
> `content agent` rewrote 200 product pages across 3 shopping events. **$478K**
>
> `ops agent` caught 78 SKUs losing the buy box, missing a promo badge, or dropping below the shipping speed bar, and fixed them in 48 hours instead of the 2 weeks it used to take. **$84K**

The "48 hours instead of 2 weeks" clause is not optional. Without it the ops line is maintenance work someone would have done anyway. The comparison is the entire claim.

**Self-drive line.**

> $20K of that ran on self-drive. Everything else waited for someone on your team.

**Benchmark line.** The persuasion, stated without judgment.

> Brands at benchmark run 25% of this on self-drive. At your volume that's about $314K a quarter that ships without anyone opening this screen.

**Secondary action, small, right side:**

> Email this to my team

Sends block 1 and block 3 as an image plus two sentences. Execs forward things. They do not ask people to log in.

---

## Block 2: What's open

Fixed to the quarter. The period switcher governs block 1 only. Label the break so the two clocks never blur.

> ### There's $9.4M open this quarter.
>
> `content agent` has 1,240 product pages that could earn more. **$4.6M**
>
> `ops agent` is watching 612 issues costing you sales right now. **$3.1M**
>
> `media agent` has 96 bid and budget changes queued. **$1.7M**

Each line says what the agent is doing. "Operations: $3.1M" is a SaaS row. "Is watching 612 issues costing you sales right now" is an agent sentence.

**Deadline line, in warning color:**

> $4.14M of this is tied to dates. The Halloween work has to publish by **Thursday, October 8**, three days from now, or $740K goes away.

**Horizon line, subordinate, one line only:**

> Beyond this quarter there's about $34M in the next twelve months.

---

## Block 3: How fast it can move

No approve button. Claire does not approve anything. This block exists to make the nudge obvious.

> ### $1.9M of it needs nobody.
>
> Self-drive is on for a narrow slice, so **$1.9M will ship this quarter whether or not anyone opens this screen.**
>
> **$5.8M is drafted and waiting for approval.** About a day of review, spread across your team.
>
> **$1.7M needs real work**, a decision or data your agents don't have. About three days.

The gradient is the argument. Zero hours, then one day, then three days. A single blended estimate would say nothing.

**Actions:**

> [ Nudge the team ]   [ Widen self-drive ]

**Closing line. The most valuable sentence on the screen:**

> Last quarter $1.8M expired. All of it was waiting on a human.

It turns the expired number from an embarrassment into the reason both buttons exist.

---

## Block 4: Ask

Single input, three chips.

- Why did we beat plan?
- What did the agents ship last week?
- What happens if nobody approves anything?

Do not include "How is this calculated?" as a chip. Put it as an inline link on any number that needs it.

Footer link, one line, no section:

> How we measure this

Behind it: matched control for content, pre and post with seasonality correction for media, detection to resolution time for ops.

---

## The nudge

In-product notification plus email, one action. The analyst may not open the product for days and the deadline is in three.

**What Claire taps:** `Nudge the team`. No compose step. A modal that asks her what to write kills it.

**What Megan receives:**

> **Claire nudged you.**
> $740K of Halloween content is drafted and needs approval by Wednesday.
> 312 SKUs. About 15 minutes.
> [ Open the queue ]

Recipients come from the agent's queue owner, so Claire never picks a person.

**Receipt, immediately, in place of the button:**

> Nudged Megan and 2 others. 312 SKUs, $740K.

**Follow-up state, next visit:**

> You nudged on Oct 5. 284 of 312 approved, $673K unlocked.

That loop is the reason to come back.

---

## Self-drive

Two dials per agent. Never one master switch.

**Which actions.** Ops: buy box lost, promo badge missing, coupon not live, shipping speed slipped, out of stock. Content: backend keywords, bullet refresh, image order, title.

**Which SKUs.** Top 20% by revenue (default proposal), a brand, a category, or everything.

**Every toggle carries retroactive evidence.** This is what makes the page persuasive instead of a permissions matrix.

> **Coupon not live** · off
> Would have caught 41 SKUs last quarter. **$96K.**

**Posture.** From exec home, `Widen self-drive` does not flip switches. It opens the agent's self-drive page with a recommendation staged and a send-to-team action. Claire proposes, the owner decides. Same posture as the nudge, and the honest read of who gets blamed if an agent publishes something wrong.

---

## Cut list

Delete from the exec home screen:

- Top module nav: Home / Content / Ops / Insights / Media
- Sub-tabs: Overview / AI Tracking / Review SKUs / AI Impact
- "Total opportunity identified" and the $13.23M hero
- "View Agent Breakdown" accordion
- The Insights row as a peer agent. Insights is context the three agents read, not a fourth team.
- "3 streams / 6 findings" chips
- "OPEN IN CONTENT / OPS / INSIGHTS" labels
- Optimization Score, Compliance %
- Separate "Today's tasks" and "Things to do" sections. They are the same list.

---

## Copy replacements

| Now | Change to |
|---|---|
| Total opportunity identified | Open this quarter |
| Captured | Delivered |
| Lost | Expired |
| Opportunity streams | (delete, use agent names) |
| Operations | Buy box, stock, coupons, promos |
| Insights (as a destination) | (delete) |
| Tasks / Today's tasks / Things to do | Waiting on you |
| Review SKUs | Approve |
| AI Impact | What we did |
| AI Tracking | (delete) |
| Optimization Score, Compliance % | (hide) |
| Continue, 383 left | Approve next, $1.18M left |
| 20 days to act | Publish by Thursday |
| Autopilot / agent-assisted / human-assisted | Self-drive / needed a human |
