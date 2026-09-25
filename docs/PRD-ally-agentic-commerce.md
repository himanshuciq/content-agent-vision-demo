# PRD: Ally, agentic commerce for ecommerce leaders and their teams

**Owner:** Himanshu Jain, Head of Product · **Status:** Prototype built, in customer and exec review · **Last updated:** Oct 2026
**Prototype:** https://content-agent-demo-dusky.vercel.app/claire-waterfall (all numbers are demo data)

---

## 1. Summary

Ally is a CommerceIQ platform that grows a brand's sales on retail marketplaces (Amazon first) through three levers: **content, operations and media**. Each lever has an AI agent that finds the opportunity, does the work, and proves what it delivered.

The same platform serves two altitudes. **Execs** see the business: where sales will land against plan, what closes the gap, and the one or two moves that need them. **Analysts** see the work: batches Ally has drafted, grouped by how much of their time each needs, with the evidence to approve with confidence.

The product replaces dashboards with a briefing and an inbox. Every screen leads with what to do and what it's worth.

## 2. Problem

- **Retail analytics tools lead with metrics, not decisions.** Customers told us the current experience "looks like every other SaaS dashboard": top nav, sub-tabs, KPI tiles, scores, and a hero number ("opportunity identified") nobody asked for.
- **Execs can't see what their team's time is worth.** Value sits in queues nobody has opened, and seasonal value expires while it waits for approval. Last quarter, value expired while waiting on a human.
- **Analysts approve SKU by SKU**, whether it's a top seller or a long-tail item. Review effort doesn't match what's at stake, so high-volume work stalls.
- **Trust is the bottleneck to autonomy.** Teams won't let an agent ship on its own until they can see what it changed, that it worked, and how to undo it.

## 3. Goals and non-goals

**Goals**
1. An exec understands where the quarter lands, the gap to plan, and what closes it, in under a minute.
2. An analyst clears the week's highest-value work in minutes, with review effort proportional to how much a SKU matters.
3. Every dollar shows projected vs delivered, how it was measured, and why any gap happened.
4. Customers move more work onto autopilot over time, because the product earns it.

**Non-goals (for this release)**
- Execs approving or editing work. Execs decide and nudge; analysts act.
- A general BI or reporting tool. No custom dashboards, filters or date pickers beyond one period switch.
- A media analyst page (James). Media work feeds the exec view; the page comes later.

**Success metrics**
| Metric | Why it matters |
|---|---|
| Share of open value on autopilot, per lever | The core behavior we want to grow |
| Median time from "Ally drafted" to "live" | Speed is value, especially for seasonal work |
| Value expired while waiting on a person | The cost of the status quo |
| Weekly exec visits and nudges sent | The exec loop is working |
| Delivered vs projected, by method | Keeps the projections honest |

## 4. Personas

**Claire, VP ecommerce (exec).** Owns the sales number and reports to the CEO. Wants to know what's happening, where the risks and opportunities are, and what she needs to do. Never goes to SKU level. Decides, nudges her team, and widens autopilot.

**Mike (content analyst) and Michelle (ops analyst).** Execute. Approve batches, give Ally the inputs it can't infer, review SKUs, check the evidence. Need the audit trail: what changed, why, and what it delivered.

**The engine room (results).** SKU-level proof of value by measurement method, for analysts and anyone who asks "how do you know?".

## 5. Product tenets

1. **Action first, not dashboard first.** Lead with what to do and what it's worth.
2. **Simple.** One primary action per area. If a screen needs explaining, it's wrong.
3. **Opinionated defaults.** Few choices, polish in every state. Remove before you add.
4. **Configuration lives in the background.** Settings sit behind a gear, never on the main path.
5. **Crisp information.** Plain sentences a person would say. Numbers that tie. One meaning per color.
6. **Prove value.** Projected vs delivered, the method, and the reason for any gap.
7. **Audit trail where it's needed.** Analysts see the before and after; execs get the summary.

## 6. Core concepts

### 6.1 Three buckets of open value, ordered by effort
Every open dollar sits in exactly one bucket, per lever:
| Bucket | Meaning | Effort |
|---|---|---|
| **On autopilot** | Ally is authorized; ships whether or not anyone opens the app | None |
| **One approval away** | Ally has drafted the work; a person approves it | Minutes |
| **Needs your team** | Ally is blocked on a decision or data it doesn't have | Days |

"Needs your input" is a state of the work (Ally is blocked), not a review mode.

### 6.2 Types of work
- **Seasonal:** tied to an event (Halloween, Black Friday, holiday). Value lands in the event window and is lost if the content isn't live in time.
- **Foundational (always-on):** keywords, titles, images, PIM-to-page fixes. Value starts at go-live and continues until the next change.
- **Retail readiness:** backend attributes and syndication blocks. Blocks everything else.
- Ops: **buy box, promo badge, shipping speed.** Media: **bids, budget pacing, allocation.**

### 6.3 SKU tiers and the review policy
SKUs are tiered by revenue:
| Tier | Definition | Default |
|---|---|---|
| **Hero** | SKUs making the top 50% of sales | Review each |
| **Core** | The next 40% of sales | Approve in bulk |
| **Tail** | The last 10% of sales | Autopilot |

- **Review rules** override the tier for a scope: retailer, brands, SKU groups, tier, and optionally a field (title changes, main image changes). The most specific rule wins. A field rule only adds review; it never loosens it.
- Both execs and analysts can change the policy. Every rule shows who set it and when.
- Autopilot work is **scheduled with a go-live date** and can be viewed, sampled, and held back for review before it ships.
- A batch's value follows share of sales, not SKU count, so hero SKUs carry the most value.

### 6.4 How value is measured
| Method | Used for | How |
|---|---|---|
| **vs category** | Seasonal | SKU growth against category demand (category impressions), adjusted for price, ad spend and stockouts, against the SKU's usual lead |
| **A/B tested** | Foundational, retail readiness | 50/50 traffic split where possible; result is significant in 4–6 weeks; value counts from launch and stacks with later changes |
| **Leakage prevented** | Ops | The SKU's normal daily sales × the days sooner it was fixed (48 hours vs about 2 weeks) |

Every result shows projected, delivered, the difference, and where the gap came from (not approved in time, stockout, lost the A/B test, needed input). What didn't work feeds back into the agent's context.

## 7. Experience by surface

### 7.1 Exec home (Claire)
**Top line.** "Hi Claire · Q4 FY26 ▾" with three icons: **Email**, **Notifications**, **Settings**.

**Hero, in her business terms.** State the fact, then the gap, then what closes it:
> You're tracking to $48M in sales this quarter.
> **That's $4M short of your $52M plan. We have $6.8M in the pipeline to close it.**
> $3.2M in ops · $2.1M in media · $1.5M in content
> 45 min of your team's time unlocks $3.6M · $660K expires in 18 days

**Where it sits today: the bridge to plan.** A waterfall from the current run rate, through On autopilot, One approval away and Needs your team, to Total opportunity, against the plan line. Each stage opens its line items below:
- **Owner · What's waiting · This week · Value.** "This week" shows status from the Monday email: not started, in progress ("2 of 5 campaigns live"), or done.
- **Nudge** appears only for owners who haven't started. On autopilot rows have **Increase autopilot**.
- **Total opportunity** opens the split by area, each area opening to its buckets.

**This quarter so far.** Projected vs delivered per lever, each opening to its types of work with 2–3 plain bullets (what worked, what's waiting, what Ally learned) and a link to SKU-level results.

**Notifications (bell).** Starts closed, with a count of owners who haven't started and haven't been nudged. The panel shows this week's email ("Emailed your team Monday, 8:00 AM"), who started, and who hasn't, with **Nudge** inline. Auto-send is a setting in the panel.

**Email.** Downloads the whole page as a PDF with every section expanded, from the live state, ready to attach.

**Period switch.** Week, month, quarter, year. It drives the hero, the bridge, the buckets and the delivered section, and it's shared with every page.

### 7.2 Content analyst (Mike)
**Hero.** "$1.5M of content opportunity is open this quarter. **$660K is one approval from live. All of it expires in 18 days.**" A progress bar shows banked, approved today, and open.

**Inbox (left rail), grouped like Claire's buckets.** Each group is a tinted band with its value and effort ("65 min to review", "~3 days of your team's time", "Already scheduled"). Items are **cut by the review policy, so each has one action**:
- *Seasonal · Core · Halloween jar candles · 214 SKUs · +$205K · Expires in 18 days*
- *Seasonal · Hero · Halloween jar candles · 12 SKUs · +$240K*
- *Seasonal · Tail · 152 SKUs · +$55K · Goes live Oct 15* (under On autopilot)

**Approve all** approves bulk items only; hero items stay for their one-by-one review.

**Detail pane: build trust, then act.**
1. **What Ally changed**, at a high level, with SKU counts ("Added 'Halloween' to the title, 211 of 214 SKUs").
2. **Review sample SKU**: one real SKU, live vs Ally's draft, side by side (removed struck, added green).
3. **The reassurance line** on core items: "None of these are hero SKUs. Your 12 hero SKUs get reviewed one by one."
4. **The action.** Core: *Approve 214 SKUs*, or *review all one by one*. Hero: *Review 12 SKUs* (opens the first SKU, list open on the left), or *approve all 12*. Tail: *Review sample SKU*, *See all 152 SKUs*, or *Hold these 152 SKUs for your review*, which moves them to One approval away just this once.

**Needs your input: Halloween concepts.** Ally needs creative it can't invent. Mike picks a Halloween background (or uploads one), applies it to a SKU and sees the product on it next to the live image, then goes **one SKU at a time** or **applies to all 245**. Each SKU keeps its own background; the list shows a check on each one done.

**The nudge loop.** Before Claire nudges, items read "Emailed Monday 8:00 AM". After, "Nudged by Claire, just now", Mike's bell lights up, and a real Slack DM links straight to his queue.

### 7.3 Ops analyst (Michelle)
The same pattern for ops: buy box, promo badge, listing and shipping fixes. The urgent line is derived ("Losing sales right now"). Her buckets add up to Claire's ops row.

### 7.4 Settings (gear on every page)
Two tabs:
- **Review policy.** Tier defaults (Review each / Approve in bulk / Autopilot) and review rules with scope pickers. A save bar previews the effect before saving: "Saving puts 394 more SKUs (+$305K) on autopilot."
- **Knowledge.** Guidance Ally follows when it writes, per scope ("Do not use 'Made in USA'; 'Originates in USA' can be used").

### 7.5 Results (engine room)
SKU-level proof, by method: vs category (category demand, SKU growth, lead over the category, before and after, adjusted for price, ads and stock), A/B tested (lift, confidence, days), and leakage prevented.

### 7.6 Ask Ally (every page)
A floating bar with suggested questions per persona ("What should I approve first?", "Email this summary to my team"). Every number in an answer comes from what's on that page.

## 8. Key flows

**Exec to analyst.** Claire opens the bell → Mike hasn't started, $660K → **Nudge** → Mike gets a Slack DM → opens his queue → approves core in bulk, reviews hero one by one → Claire's page moves: Mike's row reads "All approved", the value moves from One approval away into the run rate.

**Earn autopilot (next).** After Mike approves several core batches without edits, Ally suggests once: "You approved 3 core seasonal batches with no edits. Put core seasonal on autopilot?" One click changes the policy. Claire's **Increase autopilot** opens the same change, and her bridge moves money from One approval away to On autopilot.

**Hold back.** Mike opens a scheduled tail item, samples a SKU, and holds it for review. It moves to One approval away on his page and Claire's.

## 9. Data and business rules

- **Numbers tie everywhere.** Totals are derived from their parts. Mike's buckets add up to Claire's content row; Michelle's to her ops row. Changing the policy, approving or holding moves the same dollars on every page.
- **No hard-coding.** Logic reads fields (bucket, tier, mode, status, deadline, urgent), never names a person or batch. Adding work means adding a work item, not a special case.
- **One source of truth.** A single snapshot of work items, people and activity feeds every page (the one place a database plugs in).
- **Periods are filters.** An item counts only the value that lands in the period: seasonal value spreads to the event's last day, always-on value to the end of the quarter.
- **Number and color rules.** K below $1M. Every percentage carries its dollar total ("$520K (3.2%)"). Losses carry a minus and are red. Projected gains carry a plus and are black until approved, then green. Amber only for deadlines.

## 10. Out of scope, parked for the product

- **Event calendar.** Recommendations appear 5 weeks before an event; content should be live 3 weeks before for full value; per-event lead-out.
- **Value that shrinks instead of expiring.** Live after the live-by date earns the share of the window left ("Worth $240K now, drops about $24K a day").
- **A/B lifecycle states.** "Measuring" for the first 4–6 weeks, then "Confirmed", with delivered back-filled from launch.
- **Dated delivered records** so any period is a sum, and a date that moves on its own (on Oct 1 everything becomes Q4).
- **Audit trail on results.** Each SKU row shows what changed, who or what shipped it (analyst or autopilot, and which rule), whether it worked, and undo.
- **Media analyst page.** Traffic curves inside an event window.

## 11. Open questions

1. What counts as "started" for the weekly status: the first approval, or opening the queue?
2. How should review effort be derived (minutes per SKU by type of work, or measured from usage)?
3. Ask Ally answers and bullets: templates, or generated per customer?
4. Sources for KPIs and category benchmarks (share of voice, category impressions).
5. Naming: "Total opportunity" vs "Potential total".
6. Should a SKU already live on autopilot be pullable back into review after it ships (beyond holding before go-live)?
7. MAP floor data: make sure the example ties (the demo shows a seller below a $499 floor at $319).

## Appendix: demo state (Oct 8, Q4 FY26)

| | Value |
|---|---|
| Run rate vs plan (quarter) | $48M vs $52M, $4M short |
| Pipeline | $6.8M: ops $3.2M, media $2.1M, content $1.5M |
| Bridge | On autopilot +$1.0M · One approval away +$3.6M · Needs your team +$2.2M · Total $54.8M |
| Content, one approval away | $660K: core $205K + $100K, hero $240K + $115K |
| Content, needs input | $560K: Halloween concepts $420K, retail readiness $140K |
| Content, autopilot | $280K: PIM to PDP $200K, tails $55K + $25K |
| Q4 so far, delivered | $280K of $300K projected (content $100K, media $100K, ops $80K) |
