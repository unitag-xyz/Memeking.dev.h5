'use client'

import { useRef, useState } from 'react'

import { formatErrorMessage } from '../formatter/error'

type LoadOptions<T> = {
  action: () => Promise<T>
  onLoaded?: (result: T) => void
  onError?: (message: string) => void
  manual?: boolean
}

export function useLoading(loading: boolean = false) {
  const [isLoading, setLoading] = useState(loading)
  const counter = useRef(0)

  async function runLoadAsync<T = any>({
    action,
    onLoaded = () => {},
    onError = () => {},
    manual = false,
  }: LoadOptions<T>) {
    // cache loading index
    const index = counter.current
    counter.current++

    setLoading(true)
    try {
      const result = await action()
      // onLoaded will only be executed if the count indexes are equal.
      if (index === counter.current) onLoaded(result)
    } catch (error) {
      const message = formatErrorMessage(error)
      console.error('loading error', message)
      onError(message)
    } finally {
      //  If manual is True, the status will not change after completed.
      if (!manual) {
        // The status only changes when the count indexes are equal
        if (index === counter.current) setLoading(false)
      }
    }
  }

  return {
    isLoading,
    setLoading,
    runLoadAsync,
  }
}
