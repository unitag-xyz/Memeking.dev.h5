'use client'

import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isImmdiate = useRef(true)
  useEffect(() => {
    if (isImmdiate.current) isImmdiate.current = false
    else effect()
  }, deps)
}
