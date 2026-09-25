---
name: ciq-prototype
description: Build and iterate CommerceIQ product prototypes (exec pages, analyst queues, results pages) in a Next.js + Tailwind demo app, to the design, copy, number and workflow standards set on the Ally exec demo. Use whenever Himanshu asks to prototype, mock up in code, redesign, restyle or QA a screen, add a persona page, or change copy or numbers in a demo. Also use when he asks "how would you design this", for a design or copy review, or to make pages consistent.
---

# CommerceIQ prototyping

Standards learned building the Ally agentic-commerce demo (`content-agent-vision-demo`: Claire the VP exec, Mike the content analyst, Michelle the ops analyst, plus a results page). Apply them to any new prototype.

Himanshu is Head of Product and not a coder. Explain decisions in plain language, and act as a world-class UI and UX designer: catch the small things before he does.

Page and component patterns: `references/patterns.md`. How value is measured and shown: `references/measurement.md`.

---

## Product tenets (judge every screen against these)

1. **Action first, not dashboard first.** Lead with what to do and what it's worth.
2. **Simple.** One primary action per area.
3. **Apple, not Android.** Opinionated defaults, few choices, polish in every state.
4. **Configuration lives in the background.** No settings on the main path.
5. **Crisp, clear information.** Plain sentences, numbers that tie, one meaning per color.
6. **Prove value.** Projected vs delivered, the method, and the reason for any gap.
7. **Audit trail where it's needed.** Doers see what changed, when and why. Execs get the summary.

**Personas:** the **exec** owns the sales number, sees business, risks, opportunities and strategy, and never goes to SKU level. The **doer or analyst** executes, reviews detail, gives input and needs the audit trail. Both work on one platform across content, media and operations.

## 1. Working loop (every change)

1. **Understand, then act.** If a request is ambiguous and the answer changes what you build, ask one question. Otherwise build the obvious reading and say what you assumed.
2. **Build the smallest change that does it.** Match the surrounding code. Extend shared components with an optional prop rather than forking them.
3. **Verify in the browser.** Take a screenshot and read the text with JS. Check every state you touched: default, hover, selected, done, empty, and after the demo reset.
   - Wait ~2.5s after load before clicking (6.5s if a banner overlays the page).
   - Stale hot-reload errors can be phantom: reload before debugging them.
   - Scrolled screenshots sometimes come back blank. Scroll 1px and retake, or read the DOM.
   - If JSX drops a space after `}` or `</span>`, add an explicit `{" "}`.
4. **Audit as a designer before reporting** (checklist in §6). Fix what you find.
5. **Commit each change** on the working branch with a clear message. Never push unless asked.
6. **Log shared-data changes** when one version of a page is frozen, for example in `docs/waterfall-changelog.md`. Say which other pages a change reaches.
7. **Report in plain language:** what changed, what you caught and fixed, and anything that still needs his call. Give a recommendation, not a menu.

Don't just agree with him. If a request would contradict numbers elsewhere or hurt the design, say so and propose the fix. Example: calling a $46.8M bar "Total opportunity" when the headline says $6.8M.

---

## 1b. Story and disclosure

- **Start from the business:** plan, run rate, gap, then what closes it. Then the split by lever, then what unlocks fastest.
- **Summary up front, detail on demand:** one line for what Ally did, one for the value, one for the method. Everything else sits behind a click. Going too deep too soon is the first exec objection.
- **Simplify the demo world:** one seasonal event per period, and lead with the lever being demoed.
- **Prove value like a CFO is watching:**
  - isolate each agent's value
  - name the method
  - own the gap with reasons that add up
  - show the learning loop (what didn't work, what Ally changed)
  - explain why value stacks over time (each change is tested against today's content), which answers the renewal question
- **Secondary actions appear on hover** and line up with their column. The primary action is always visible. Nothing gets colored or added just because it was asked for if it looks wrong: say so and propose a better option.

## 2. Numbers must tie everywhere

- One number, one source. Derive totals from their parts. Never hand-type the same figure in two places, because they drift (we once had $490K vs $500K).
- Every persona page ties to the exec page. Mike's buckets ($740K + $600K + $200K) = Claire's content row ($1.5M). Michelle's ($2.4M + $600K + $200K) = Claire's ops row ($3.2M).
- A tag on a total makes a claim about every part of it. "Expires in 18 days" on a $740K row means all $740K expires, so the parts have to agree.
- Counts shown to the user must match. Don't show "384 SKUs" next to "See all 378 SKUs"; show one number.
- Check that dates are consistent with the demo's "today". A promo that ended before the demo date can't be "urgent", and an event in Q4 isn't "this quarter".
- Keep one event per period and use it everywhere. In the Ally demo: Q3 = back to school, Q2 = Mother's Day, upcoming = Halloween.
- After a data change, click through the flow (approve all, send, reset) and confirm the remaining total equals the sum of what's left.

## 3. Number and color rules

Full table in the project's `design-specs.md` under "Number and Color Rules".

- **Losses** carry a real minus (`−`, not `-`) and are red (`text-error-600`): "(−$35K)", "−$60K vs projected".
- **Gains** in a bullet about what worked are green (`text-success-700`). Verdict columns (lead, lift, vs projected) are green or red. Dollar gains in tables stay neutral (`text-slate-950`).
- **Amber** (`warning`) is only for things that need action soon: deadlines, "losing the sale now", waiting items.
- **Figures never wrap** (`whitespace-nowrap`).
- **Projected value is signed, not green.** Show it as "+$500K" in black, labeled "projected incremental sales" so nobody reads it as revenue. It turns green only once it's approved or delivered.
- **Never make the user add up a new total.** A bar made of banked plus open shows labeled pieces (a legend with matching dots, gaps between the pieces), never an implied whole. Keep the number the user already knows ("$1.5M open") as its own piece.
- **A percentage always comes with its total.** Write "Sales increased $520K (3.2%)", never "3.2%" on its own. The dollar figure leads and the percentage follows in parentheses. This applies to bullets, Ask Ally answers and summaries.
- **Money:** K below $1M, M above, with one consistent decimal rule. Numbers use JetBrains Mono, right-aligned, `tabular-nums`.
- Color follows meaning, and the same meaning gets the same color on every page. The Ally bucket colors are purple = one approval away, amber = needs your team, blue = autopilot. Don't reuse a state color for something else, such as an agent identity.

## 4. Visual system

- **Tokens:** brand purple `#875BF7` (`brand-500`, used sparingly for primary actions and the one number that matters), `slate` neutrals, Inter for text and JetBrains Mono for numbers. Headings are sentence case.
- **Four text shades only:** `slate-950` headings and numbers, `slate-700` body, `slate-500` secondary, `slate-400` hints. Not 900, 800 or 600.
- **Hierarchy comes from type size and weight**, not boxes: a 24px fact line, a 40–44px bold headline, a 16px supporting line.
- **Buttons share one box:** 44px high, 15px semibold, same border and radius. Only the fill differs between primary (filled purple) and secondary (outlined). Rarer paths become a quiet text link underneath ("Or review all 378 SKUs one by one →"). Keep one primary per area.
- **Tables:**
  - a header row under the title bar: 12px, medium weight, `slate-500`, sentence case
  - numbers right-aligned
  - no vertical rules or zebra striping; hairline dividers between rows
  - status shown as a small dot plus text, not a pill
  - values line up at the same x across sibling tables
- **Selection:** a soft neutral card (`bg-slate-100` with a hairline ring). No focus outline after a mouse click (`focus-visible` only), and no double borders.
- **Charts:**
  - earn their place; execs dislike new visualization types, so prefer a headline number
  - a bridge or waterfall has a plan line and gray totals
  - comparisons use a filled track with a benchmark tick, so the gap reads without math
- **Buckets read as clear sections:** a tinted header band plus a colored edge in the bucket's color, and a line saying what the bucket means. Items sit on white with a neutral selection, so bucket color never clashes with a selected item or an amber deadline. No chips on tinted backgrounds.
- **Deadlines belong to each item.** Show "Expires in 18 days" on every item that expires, as amber text (not a filled chip). Never lift it to the group, because in real data one item may expire and the next may not.
- **Disclosure arrows at the leading edge** (a chevron before the name that rotates when open), so the right edge holds only values and actions. Rows without one are indented to line up.
- **Labels don't repeat the row.** Write "Nudge", not "Nudge Mike", when the row already names Mike.
- **Floating Ask Ally bar** on every page, with page-specific questions answered from that page's numbers. It collapses on outside click. Leave bottom padding so it doesn't cover content.
- **Responsive:** check at ~1300px and at a narrow ~760px pane. On narrow widths, descriptions stack under names instead of squeezing columns.

## 5. Copy voice

- **Product copy only.** Every line carries a number, a label, a status or an action. No subtitles that describe what a section does ("Where we beat the plan and where we missed…" was rejected as AI fluff).
- **Bullets, not sentences, on cards and panels.** Card and widget copy is a short list of fragments: a label, a number, a few words ("Last year −$420K", "No deal on 6 strong SKUs"). No full sentences, no "That cost…", no run-ons joined by commas. If a line needs a verb and a clause, it belongs in chat or a detail view, not on a card. The exec hero is the one place full sentences are used, because it's spoken.
- **A person speaking, not a dashboard.** Exec hero order: fact, then the gap (the fear), then the reassurance.
  - "You're tracking to $40M in sales this quarter."
  - "That's $5M short of your $45M plan."
  - "We have $6.8M in the pipeline to close it."
- **Words:**
  - "projected", not "promised"
  - "delivered", not "captured"
  - "current run rate", not "on pace"
  - "Ally", not "the agent"
  - "customers", not "clients"
  - never "opportunity identified"
- **Results are outcomes,** not actions. "Outgrew the category" is a result; "New title live" is not.
- **Tense matches the time.** Past events are past tense ("3 needed your team's input"). Open asks are present tense ("3 SKUs need your team's input").
- Active voice, contractions welcome, no em dashes, and never disparage competitors.
- **Tight labels:** "Halloween seasonal updates", not a list of what's in them. Write "Mike Content", not "Mike, content analyst". Effort goes in minutes or hours ("45 min"), not "about half a day". Don't count items nobody needs.
- **Consistent words:** "market share", not "share". "Reset", not "Reset demo". "PIM", not "BIM". Keep the type-of-work names fixed: Seasonal, Foundational, Retail readiness.
- Say the same thing the same way everywhere, for example "Review N SKUs", "Approve N SKUs" and "Send to Ally".

## 6. Design audit checklist (run before every report)

- [ ] Does any number disagree with another page or with the sum of its parts?
- [ ] Is any label repeated right next to itself (type = name, count chip + "See all N")?
- [ ] Do buttons in one row share height, weight and style? Is there one primary?
- [ ] Do selected, hover, done and empty states all look right? Any stray focus ring, double line or missing highlight?
- [ ] Is there any text shade or color outside the rules? Does any color mean two things?
- [ ] Do headers exist for every table, in the same style?
- [ ] Is anything wrapping badly (headline mid-thought, figure split, top line on a 13" laptop)?
- [ ] Is there filler copy, AI-sounding phrasing, or the wrong tense?
- [ ] Is there a dead end? A count or link that promises more than it shows, or a button that does nothing?
- [ ] Does the story loop close? When an analyst acts, can the exec see it?

## 7. When asked for a QA or review only

Don't change anything. Report findings ranked as must fix, consistency, and polish. Each finding names the problem, where it is, and the recommended change, then give a suggested order. Write from a founder's point of view: would this survive a sharp exec in the room?

## 8. System Thinking callouts

At real checkpoints (a platform choice, integration pattern, data model decision, explicit trade-off or finished phase), add a short 🧠 System Thinking callout in chat, and append the full entry to `~/.claude/MY_LEARNINGS.md`. Routine fixes and styling don't count.
