import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Ask Ally chips and answers for Mike, Michelle and the results page. Every
 * number comes from what's on that page, so the answer never disagrees with it.
 */
const N = ({ children }: { children: React.ReactNode }) => <span className="font-mono font-semibold text-slate-950">{children}</span>

function Results({ href = "/content-results?period=qtd" }: { href?: string }) {
  return (
    <Link href={href} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
      See SKU-level results
      <ArrowRight className="size-3.5" />
    </Link>
  )
}

export const MIKE_QUESTIONS = ["What should I approve first?", "What does Ally need from me?", "How did my content do this quarter?", "What's running on autopilot?"] as const

export function mikeAnswer(q: string) {
  if (q === MIKE_QUESTIONS[0])
    return (
      <p>
        Halloween moments: <N>$500K</N> on <N>378</N> SKUs, and it expires in 18 days. Then Halloween gift sets, <N>$240K</N>. Each is one approval.
      </p>
    )
  if (q === MIKE_QUESTIONS[1])
    return (
      <p>
        Your Halloween concepts for <N>245</N> SKUs (<N>$420K</N>), and <N>58</N> attributes on <N>21</N> SKUs that are blocked from syndication (<N>$180K</N>).
      </p>
    )
  if (q === MIKE_QUESTIONS[2])
    return (
      <div>
        <p>
          <N>$520K</N> delivered of <N>$580K</N> projected. <N>205</N> of <N>236</N> SKUs went live, and sales rose <N>3.2%</N> against control.
        </p>
        <Results />
      </div>
    )
  return (
    <p>
      PIM → PDP fixes, <N>$200K</N> this quarter. When a listing has a blank image, description, bullet or attribute, Ally fills it from your PIM.
    </p>
  )
}

export const MICHELLE_QUESTIONS = ["What's losing sales right now?", "What does Ally need from me?", "How did ops do this quarter?", "What's running on autopilot?"] as const

export function michelleAnswer(q: string) {
  if (q === MICHELLE_QUESTIONS[0])
    return (
      <p>
        Lost buy box on <N>6</N> SKUs, <N>$720K</N>. A third-party seller is pricing below your MAP floor. One approval reports it to Amazon.
      </p>
    )
  if (q === MICHELLE_QUESTIONS[1])
    return (
      <p>
        Proof on <N>9</N> chargeback disputes (<N>$350K</N>) and shipped quantities on <N>6</N> shorted POs (<N>$250K</N>). Ally has drafted every claim.
      </p>
    )
  if (q === MICHELLE_QUESTIONS[2])
    return (
      <p>
        <N>$310K</N> of leakage prevented of <N>$360K</N> projected. <N>78</N> SKUs were fixed in 48 hours instead of 2 weeks.
      </p>
    )
  return (
    <p>
      Promotions that fail to go live, <N>$200K</N> this quarter. Ally fixes the setup and resubmits them: <N>51</N> so far.
    </p>
  )
}

export const RESULTS_QUESTIONS = ["How is incremental sales measured?", "Why did the travel tin trio lose?", "Which SKUs should get more ad spend?"] as const

export function resultsAnswer(q: string) {
  if (q === RESULTS_QUESTIONS[0])
    return (
      <p>
        Seasonal work is compared with category demand over the same weeks and with each SKU&apos;s usual lead, after adjusting for price, ad spend and
        stockouts. Foundational and retail readiness work is A/B tested against the old content on a 50/50 traffic split.
      </p>
    )
  if (q === RESULTS_QUESTIONS[1])
    return (
      <p>
        It ran out of stock for <N>11</N> days during back to school, so its sales fell <N>6%</N> while category demand grew <N>8%</N>. That cost{" "}
        <N>$15K</N>. Ally now flags SKUs likely to run out 3 weeks before an event.
      </p>
    )
  return (
    <p>
      The <N>3</N> back-to-school SKUs that outgrew the category by the most: the dorm-size mini jar (<N>+6.2</N> pts), the study focus eucalyptus jar (
      <N>+4.1</N>) and the teacher gift set (<N>+3.5</N>).
    </p>
  )
}
