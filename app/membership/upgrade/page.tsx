import { Suspense } from "react"
import UpgradeContent from "./upgrade-content"

export default function MembershipUpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">加载中...</div>}>
      <UpgradeContent />
    </Suspense>
  )
}
