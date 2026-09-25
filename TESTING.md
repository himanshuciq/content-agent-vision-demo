# Testing

Prototype only: there are no automated tests. Check changes by hand in the browser.

## Before reporting any change
1. Run `npx tsc --noEmit`. It must print nothing.
2. Open the page in the browser pane with the pane visible (a hidden pane pauses hydration). Wait about 2.5s after load, or 6.5s on Claire's page because of the banner.
3. Check every state you touched: default, hover, selected, done, empty, and after **Reset** (the faint button at the bottom of each page).
4. Check at about 1300px wide and in a narrow pane of about 760px.
5. Read the numbers: do they tie to the other pages?

## The story flow to click through
1. `/claire-waterfall`: the hero, then each bridge bar (autopilot, approval, team). Open the Content and Ops rows under "This quarter so far". Try Ask Ally.
2. Click **Nudge again** on Mike's row. A Slack DM is sent if the env vars are set.
3. `/mike`: Approve 378 SKUs. Check that the value turns green, the bar grows and the headline updates. Then Approve all. Open "Add Halloween concepts", Review 245 SKUs, and Send to Ally. Click Reset.
4. `/michelle`: Approve all. Open chargeback disputes, Review 9 claims, and Send to Ally. Click Reset.
5. `/content-results`: switch periods (Q3 so far, August, Q2, FY25) and tabs (All, Seasonal, Foundational, Retail readiness).

## Numbers that must tie
- Claire content $1.5M = Mike $740K + $560K + $200K.
- Claire ops $3.2M = Michelle $2.4M + $600K + $200K.
- Q3 content delivered $520K of $580K = $580K − $35K − $10K − $15K. Seasonal $260K + foundational $180K + retail readiness $80K.
- Q2 = $700K of $890K, Mother's Day. Q3 = back to school.

## Known quirks
- Stale hot-reload errors can be phantom. Reload before debugging.
- Scrolled screenshots sometimes come back blank. Scroll 1px and retake, or read the DOM text.
- If JSX drops a space after `}` or `</span>`, add an explicit `{" "}`.
