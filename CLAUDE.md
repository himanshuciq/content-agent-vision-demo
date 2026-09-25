@AGENTS.md

# Ally: agentic commerce demo

Read this first, then `SESSION.md` (where we left off) and `PLAN.md` (what's next).

## What we're building

Ally is a CommerceIQ platform that grows a brand's sales on retail marketplaces (Amazon first) through three levers: **content, media and operations**. Each lever has an AI agent that finds the opportunity, does the work, and proves what it delivered. Different personas use the same platform at different altitudes: execs see the business, doers act on the detail.

This repo is the clickable prototype used to sell the vision to execs and customers. It is not production code: numbers are mock, but they must tie everywhere.

## Personas

**Exec (Claire, VP ecommerce).** Owns the sales number and reports to the CEO. She wants to know:
- what's happening in the business
- where the risks and opportunities are
- what she needs to do
- the few strategic moves that matter

She never goes to SKU level. She decides, nudges her team, and widens autopilot. Page: `/claire-waterfall`.

**Doer, or analyst (Mike content, Michelle ops, James media).** Executes. Goes into the detail: approves batches, gives the inputs Ally can't infer, reviews SKUs, checks the evidence. Needs the audit trail: what Ally changed, why, and what it delivered. Pages: `/mike`, `/michelle`. James has no page yet.

**Results (the engine room).** SKU-level proof of value, by measurement method. Page: `/content-results`.

Every doer page ties to the exec page: the doer's buckets add up to the exec's row for that lever.

## Product tenets

1. **Action first, not dashboard first.** Every screen leads with what to do and what it's worth. Metrics exist to support a decision.
2. **Simple.** One primary action per area. If a screen needs explaining, it's wrong.
3. **Apple, not Android.** Opinionated defaults, few choices, polish in every state. Remove before you add.
4. **Configuration lives in the background.** No settings on the main path. Autopilot and thresholds are set once and changed rarely.
5. **Crisp, clear information.** Plain sentences a person would say. Numbers that tie, with one meaning per color. No filler.
6. **Prove value.** Every dollar shows projected vs delivered, how it was measured (vs category, A/B tested, leakage prevented), and why any gap happened.
7. **Audit trail where it's needed.** Doers and the engine room can see what changed, when, by whom, with the before and after. Execs get the summary, not the log.

## How to work here

- **Standards:** use the `ciq-prototype` skill (`.claude/skills/ciq-prototype/`). It covers the working loop, number and color rules, visual system, copy voice and the design audit checklist. Number rules also live in `design-specs.md`.
- **Voice:** "Ally", not "the agent". Say "projected", "delivered" and "current run rate". Use K below $1M. A percentage always comes with its dollar total. Losses get a minus sign and red.
- **No hard-coding:** logic never names a person, batch or lever. It reads fields (bucket, status, deadline, urgent). Add a work item, not a special case.
- **Numbers tie:** derive totals from their parts. Mike's buckets ($740K + $560K + $200K) = Claire's content row ($1.5M). Michelle's ($2.4M + $600K + $200K) = Claire's ops row ($3.2M).
- **Two Claire pages:** `/claire-waterfall` is the active design. `/claire` is frozen. Log every change that reaches shared data in `docs/waterfall-changelog.md`.
- **Verify in the browser** before reporting (see `TESTING.md`). **Commit each change** on `claire-exec-demo`. Push when asked.
- **Deploy:** the Vercel project `content-agent-demo` isn't linked to Git. Run `npx vercel --prod --yes` from the repo root. Live: https://content-agent-demo-dusky.vercel.app/claire-waterfall
- **Himanshu** is Head of Product and not a coder. Explain in plain language, recommend rather than list options, and add a 🧠 System Thinking callout at real checkpoints.

## Where things live

| What | Where |
| --- | --- |
| **Data model:** work items, people, activity → every total, row, status and nudge | `src/components/nudge/model.ts` (logic) and `data.ts` → `getSnapshot()` (the one place a database plugs in) |
| Live view for the session (Claire's page reacts to Mike's and Michelle's actions) | `src/components/nudge/live-model.ts` (`useLive()`) |
| Batches, delivered data, copy | `src/components/nudge/data.ts` |
| Delivered and projected data by type of work | `src/components/nudge/delivered-content-data.ts` |
| Results page data | `src/components/nudge/content-results-data.ts` |
| Exec page | `src/app/claire-waterfall/page.tsx`, `src/components/nudge/{claire,waterfall}/` |
| Doer pages | `src/app/{mike,michelle}/page.tsx`, `src/components/nudge/{mike,ops}/` |
| Ask Ally answers | `claire/ask-ally-answers.tsx`, `ask-ally-personas.tsx` |
| Measurement method | `docs/content-value-measurement.md` |
| Design tokens and number rules | `design-specs.md` |
| Earlier Content Agent review flow (still used by `/bulk-review` and others) | `PROJECT_CONTEXT.md`, `product-context.md`, `instructions.md` |

## Project files

- `SESSION.md`: the latest session. Read first, update when wrapping up.
- `PLAN.md`: what's next, ordered.
- `DECISIONS.md`: decisions and why.
- `MISTAKES.md`: what went wrong and the rule that prevents it.
- `TESTING.md`: how to check a change.
- `LEARNINGS.md`: lessons, written for Himanshu.
