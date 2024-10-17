'use client'

import { ReactNode } from 'react'

import useShare from '@/hooks/use-share'

export default function ShareProvider({
  code,
  children,
}: {
  code?: string[]
  children: ReactNode
}) {
  useShare(code)
  return <>{children}</>
}
