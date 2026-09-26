"use client"

import { TopStrip, useViewer } from "../top-strip"

const Dot = () => <span className="text-slate-300">·</span>
const Num = ({ children }: { children: React.ReactNode }) => <span className="font-mono font-semibold text-slate-950">{children}</span>
const Up = ({ children }: { children: React.ReactNode }) => <span className="font-medium text-success-700">↑{children}</span>

/** Michelle's top line, shaped like Mike's and Claire's: greeting, quarter, how her ops work is doing; the view switch sits by the gear. */
export function MichelleHeader({ viewSwitch }: { viewSwitch?: React.ReactNode }) {
  const { viewer, visiting, home } = useViewer("michelle")
  return (
    <TopStrip
      person={viewer}
      home={home}
      greeting={visiting ? undefined : "Hi Michelle"}
      crumbs={visiting ? [{ label: "Home", href: home }, { label: "Michelle's queue" }] : undefined}
      period
      facts={
        <>
          <span>
            Buy box win rate <Num>94%</Num> <Up>2 pts</Up>
          </span>
          <Dot />
          <span>
            Promo badges live <Num>97%</Num> <Up>3 pts</Up>
          </span>
          <Dot />
          <span>
            <Num>2</Num> days to fix, down from 14
          </span>
        </>
      }
      controls={viewSwitch}
    />
  )
}
