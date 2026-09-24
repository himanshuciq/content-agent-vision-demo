"use client"

import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Secondary action, non-functional for now. Once wired up it sends block 1
 * and block 3 as an image plus two sentences — execs forward things, they
 * do not ask people to log in.
 */
export function EmailTeamAction() {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => {}}>
      <Mail className="size-3.5" />
      Email this to my team
    </Button>
  )
}
