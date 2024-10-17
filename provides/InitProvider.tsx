'use client'

import { ReactNode, useEffect } from 'react'

import useAccount from '@/hooks/use-account'

export default function InitProvider({ children }: { children: ReactNode }) {
  const { checkAndSetLevel } = useAccount()

  useEffect(() => {
    checkAndSetLevel()
  }, [checkAndSetLevel])

  return <>{children}</>
}
