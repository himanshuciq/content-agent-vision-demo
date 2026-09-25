"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { NudgeKey, Period } from "./types"
import { DEFAULT_KNOWLEDGE, DEFAULT_POLICY } from "./policy"
import type { KnowledgeEntry, Policy } from "./policy"

const STORAGE_KEY = "ally-nudge-demo-state"

/** The two nudges that page Mike for real — the rest just flip local UI state. */
const MIKE_NUDGE_KEYS: NudgeKey[] = ["approval-content", "team-content"]

interface StoredState {
  nudged: Partial<Record<NudgeKey, boolean>>
  approved: Record<string, boolean>
  /** Review policy and knowledge from the settings page; absent = defaults. */
  policy?: Policy
  knowledge?: KnowledgeEntry[]
  /** How the Business view ranks top SKUs; set per customer in Settings. */
  businessSort?: BusinessSort
  /** Which scope the Business view's chips offer first: categories or brands. */
  businessGroup?: BusinessGroup
}

export type BusinessSort = "gap" | "sales"
export type BusinessGroup = "Category" | "Brand"

interface NudgeContextValue extends StoredState {
  nudge: (key: NudgeKey) => void
  /** Marks several keys nudged in one state update (so a "Nudge team" click doesn't clobber). */
  nudgeMany: (keys: NudgeKey[]) => void
  approve: (batchId: string) => void
  policy: Policy
  savePolicy: (p: Policy) => void
  knowledge: KnowledgeEntry[]
  saveKnowledge: (k: KnowledgeEntry[]) => void
  mikeNotified: boolean
  clearNotification: () => void
  /** Wipes all nudge/approve state so the demo can be replayed from scratch. */
  resetDemo: () => void
  /** The period every page shows (Claire's, Mike's and Michelle's switches share it). Not stored: a reload starts on the quarter. */
  period: Period
  setPeriod: (p: Period) => void
  businessSort: BusinessSort
  setBusinessSort: (s: BusinessSort) => void
  businessGroup: BusinessGroup
  setBusinessGroup: (g: BusinessGroup) => void
}

const EMPTY_STATE: StoredState = { nudged: {}, approved: {} }

const NudgeContext = createContext<NudgeContextValue | null>(null)

function readStoredState(): StoredState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : EMPTY_STATE
  } catch {
    // Private window or blocked storage — demo just starts fresh.
    return EMPTY_STATE
  }
}

export function NudgeProvider({ children }: { children: React.ReactNode }) {
  // Always starts at EMPTY_STATE so the first client render matches the
  // server-rendered HTML; the real (possibly localStorage-backed) state is
  // synced in right after mount, once — an external-system read, not a
  // response to a state change, so it belongs in an effect.
  const [state, setState] = useState<StoredState>(EMPTY_STATE)
  const [notifCleared, setNotifCleared] = useState(false)
  const [period, setPeriod] = useState<Period>("quarter")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage (an external system) right after mount, not a response to a state change.
    setState(readStoredState())
  }, [])

  // Functional updates so several nudges fired in one tick accumulate instead
  // of clobbering each other; localStorage is written from the same next state.
  const update = useCallback((updater: (prev: StoredState) => StoredState) => {
    setState((prev) => {
      const next = updater(prev)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Best effort only.
      }
      return next
    })
  }, [])

  const nudge = useCallback(
    (key: NudgeKey) => {
      update((prev) => ({ ...prev, nudged: { ...prev.nudged, [key]: true } }))
      if (MIKE_NUDGE_KEYS.includes(key)) setNotifCleared(false)
    },
    [update],
  )

  const nudgeMany = useCallback(
    (keys: NudgeKey[]) => {
      update((prev) => ({
        ...prev,
        nudged: { ...prev.nudged, ...Object.fromEntries(keys.map((k) => [k, true])) },
      }))
      if (keys.some((k) => MIKE_NUDGE_KEYS.includes(k))) setNotifCleared(false)
    },
    [update],
  )

  const approve = useCallback(
    (batchId: string) => {
      update((prev) => ({ ...prev, approved: { ...prev.approved, [batchId]: true } }))
    },
    [update],
  )

  const savePolicy = useCallback((policy: Policy) => update((prev) => ({ ...prev, policy })), [update])
  const saveKnowledge = useCallback((knowledge: KnowledgeEntry[]) => update((prev) => ({ ...prev, knowledge })), [update])

  const mikeNotified =
    !notifCleared && MIKE_NUDGE_KEYS.some((key) => state.nudged[key])

  const resetDemo = useCallback(() => {
    // Cleared right away, not inside the state update, so a read of storage in the same tick sees the reset.
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Best effort only.
    }
    update(() => EMPTY_STATE)
    setNotifCleared(false)
  }, [update])

  return (
    <NudgeContext.Provider
      value={{
        ...state,
        nudge,
        nudgeMany,
        approve,
        policy: state.policy ?? DEFAULT_POLICY,
        savePolicy,
        knowledge: state.knowledge ?? DEFAULT_KNOWLEDGE,
        saveKnowledge,
        mikeNotified,
        clearNotification: () => setNotifCleared(true),
        resetDemo,
        period,
        setPeriod,
        businessSort: state.businessSort ?? "gap",
        setBusinessSort: (businessSort) => update((prev) => ({ ...prev, businessSort })),
        businessGroup: state.businessGroup ?? "Category",
        setBusinessGroup: (businessGroup) => update((prev) => ({ ...prev, businessGroup })),
      }}
    >
      {children}
    </NudgeContext.Provider>
  )
}

export function useNudge() {
  const ctx = useContext(NudgeContext)
  if (!ctx) throw new Error("useNudge must be used inside NudgeProvider")
  return ctx
}
