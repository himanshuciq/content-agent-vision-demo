# Page and component patterns

Reusable shapes from the Ally demo. The code lives in `content-agent-vision-demo/src/components/nudge/`.

## Exec page (Claire, `/claire-waterfall`)

Order is business first, then action, then proof.

1. **Top line:** Ally mark · "Hi Claire" · period dropdown ("Q3 FY26 ▾"). The period name is the control. Small text.
2. **Fact line (24px):** "You're tracking to $40M in sales this quarter."
3. **Headline (44px bold), one sentence per line:** the gap ("That's $5M short of your $45M plan."), then the reassurance with the only purple number ("We have $6.8M in the pipeline to close it.").
4. **Supporting lines:** the split by area, and the action with the effort ("45 min of your team's time unlocks $3.7M") plus the urgency in amber ("$740K expires in 18 days").
5. **Bridge-to-plan waterfall:** Current run rate → On autopilot → One approval away → Needs your team → Total. It has a dashed plan line and gray end totals, and each step shows its effort. A selected bar opens its table below.
6. **Stage tables:** title bar with the total and "Nudge team", column headers (Owner · What's waiting · This week · Value), and rows. Only the owner who hasn't started gets a visible "Nudge again".
7. **Autopilot table:** share on autopilot shown as a track with a best-in-class tick, plus "Increase autopilot" (all in the header, per row on hover).
8. **"This quarter so far":** Projected · Delivered · vs projected. Agent rows open to a small waterfall by type of work, with 2–3 bullets under the selected bar and a method tag.
9. **Weekly banner:** overlays the top and hides after 5s unless hovered. There's a faint demo Reset at the bottom and the floating Ask Ally bar.

## Analyst queue (Mike `/mike`, Michelle `/michelle`)

The same skeleton for every persona, so each page reads as the same product.

1. **Top line:** Ally mark · "Hi Mike" · "Q3 FY26" · 2–3 metrics with deltas (for example "SEO share of voice 42% ↑0.8 pts"). "Claire's view" and the bell sit on the right.
2. **Two-line headline:** a 24px grounding line ("$1.5M of content opportunity is open this quarter."), then a 40px action line ("$740K is one approval from live. All of it expires in 18 days."). The action line updates as he acts ("still…", then "Everything one approval away is live.").
3. **Progress bar:** dark = banked this quarter, lighter = what he has unlocked in this session, and the track is what's still open. It moves on every action, including input actions, not only approvals.
4. **Left rail inbox:** grouped by the exec's buckets.
   - Each group gets a tinted header in its color with a colored edge. "Approve all" sits on the approval group.
   - Each item shows the type in bold, a specific subscript (never the type repeated), the value, and one tag: the deadline or the state.
5. **Detail pane:** type eyebrow, name, value.
   - A "What Ally changed / caught / fixes" card with counts.
   - **Approval:** Approve N (primary), Preview a sample (secondary), and a quiet "Or review all N one by one →".
   - **Input:** an amber callout explaining what Ally did and what's left, then "Review N SKUs". Each field only the team can fill gets a full-width "Your input" box with the live value above it, then "Send to Ally".
   - **Autopilot:** a blue note saying it's running and there's nothing to do.
6. **Sample SKU:** side by side, Live on retailer | Ally wrote. Word-level diff (removed struck on the live side, kept black, added green on Ally's side). Seasonal images must look seasonal, not just grayscale vs color.
7. **Delivered section:** the exec's waterfall for this agent only. Hide "Nudge team" here, because the team is the viewer.
8. Reset at the bottom, and Ask Ally with persona questions.

## Results page (`/content-results`)

- **Top line:** "Content results · Q3 FY26 so far ▾" (period dropdown). Type tabs sit beside it: All · Seasonal · Foundational · Retail readiness.
- **Headline:** "$520K delivered of $580K projected", with the delivered figure in purple, and SKUs live underneath.
- **Summary strip:** four cells that depend on the method. The first cell is tinted and has a progress bar.
- **One card per type of work:** a title bar with a type mark, a method tag with a hover explanation, a two-line method note, and delivered vs projected with a progress bar. Then column headers, then rows. Columns follow the method (see `measurement.md`).

## Shared building blocks

- **Buttons:** `mike/buttons.ts` (PRIMARY / SECONDARY).
- **Group colors and selection tint:** `GROUPS` in `mike/batch-list.tsx` and `ACTIVE` in `mike/batch-list-item.tsx`.
- **Waterfall with bullets:** `claire/content-waterfall.tsx`. It's configurable: order, total label, bar color, owner row, `canNudge`. Figures in bullets are auto-colored by `Figures`.
- **Ask Ally:** `claire/ask-ally.tsx` takes `questions`, `renderAnswer` and `placeholder`. Persona answers are in `ask-ally-personas.tsx`.
- **Demo state:** shared context in localStorage (approved and nudged), with `resetDemo`. Real Slack DMs go out through `/api/nudge`. Tokens live in `.env` and are never pasted in chat.
