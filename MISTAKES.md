# Mistakes and the rules they taught

| What went wrong | Rule now |
| --- | --- |
| The same batch value was typed twice ($500K and $490K), so "Approve all" left "$15K still one approval from live". | One number, one source. Derive totals from their parts. |
| Mike's batches summed to $1.54M while Claire said $1.5M, so the bar total looked wrong. | Check that parts add up to the displayed total, not just that they round to it. |
| "384 SKUs" sat next to "See all 378 SKUs". | Show one count. Never make the user reconcile two. |
| "Expires in 18 days" on a $740K row that was only $500K seasonal. | A tag on a total is a claim about every part of it. |
| A Mother's Day SKU showed up under back to school; a promo had ended before the demo date. | Check events and dates against the period and the demo's "today". |
| AI filler subtitles ("Where we beat the plan and where we missed…"). | Product copy only: a number, label, status or action. |
| Buttons in one row had different heights and weights; focus rings and double borders on selection. | Run the design audit checklist on every state before reporting. |
| The autopilot table put numbers above their labels, and its button ran into the value. | One column-header style. Size columns to their content. Look at it before calling it done. |
| Assumed the bar could never show a total. | Ask what the concern is before over-applying a rule. |
| Tested clicks while the browser pane was hidden, so the page never became interactive. | Test with the pane visible, or in a fresh tab. |
| Nothing was committed for weeks, and a revert took manual work. | Commit each change. |


## Fixed lever order instead of ranking (Sep 25, 2026)
Claire's owner rows were listed content, ops, media, so Media ($560K) sat below Ops ($312K). Rule: rank urgency first (soonest deadline), then dollars, in every list, derived from the data. Now in the skill's number rules and audit checklist.

## Chat answers never appeared (Sep 25, 2026)
After adding anchored answers, `ChatThread` filtered turns into a new array every render and keyed its "working" timer on it, so the timer restarted forever and answers stayed on the dots. Rule: key effects on stable values (the newest turn's id), not on derived arrays. Also: scroll with a jump fallback (some browsers ignore smooth scroll), put page-level answers last, and clear the conversation when the view changes. Test chips on every page (TESTING.md).
