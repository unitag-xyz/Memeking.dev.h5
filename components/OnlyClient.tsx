'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'

export default function OnlyClient({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  if (isClient) {
    return <>{children}</>
  }

  return <></>
}
