# Decisions

Newest first. Each entry records the decision, why, and what was rejected.

**Sep 2026: projected values are signed, not green.** "+$500K" in black, labeled "projected incremental sales". It turns green only once approved. *Why:* a bare "$500K" read as the SKUs' revenue, and green means delivered. *Rejected:* green projected values.

**Sep 2026: the progress bar is labeled pieces plus a total.** Pieces are $520K banked, $X unlocked today and $1.5M open, with "$2.02M this quarter" at the end. *Why:* the user keeps the $1.5M they know, and the total is fine next to it. Content data was trimmed so the parts add up exactly.

**Sep 2026: every percentage carries its dollar total.** For example "Sales increased $520K (3.2%)". *Why:* a percentage alone doesn't say how much it's worth.

**Sep 2026: results tables follow the measurement method.**
- *Vs category (seasonal):* SKU growth vs category demand growth (category impressions as the demand signal), lead vs the SKU's usual lead (a difference-in-differences comparison), and adjustments for price, ad spend and stockouts.
- *A/B tested (foundational, retail readiness):* lift vs old content, confidence and test length.
- *Why:* the columns are the proof each method produces. *Rejected:* generic lifts (units, traffic, conversion) on every table.

**Sep 2026: ops value is revenue leakage prevented.** Each SKU's normal daily sales × the days sooner it was fixed.

**Sep 2026: doer pages share one layout and tie to the exec page.** Top line, two-line headline, progress bar, an inbox grouped by Claire's buckets (purple one approval away, amber needs your input, blue autopilot), a detail pane, and the delivered section.

**Sep 2026: "Needs your input" works like approval.** A "Review N SKUs" button opens per-SKU input fields and ends with "Send to Ally".

**Sep 2026: all $740K one approval away is seasonal.** The foundational refresh moved out of that bucket. *Why:* the "Expires in 18 days" tag sits on the whole row.

**Sep 2026: exec hero is fact → fear → comfort.** "You're tracking to $40M… That's $5M short of your $45M plan. We have $6.8M in the pipeline to close it." *Rejected:* dashboard shorthand ("$5M gap to plan").

**Sep 2026: bridge order goes from no effort to most effort.** Current run rate → autopilot → one approval → needs your team → total.

**Sep 2026: headlines over new charts.** The CEO dislikes new visualization types. Use a headline number, and add a chart only where it earns its place (the bridge, the content and ops waterfalls).

**Sep 2026: waterfall version is the active design.** `/claire` is frozen, and changes are logged for porting.
