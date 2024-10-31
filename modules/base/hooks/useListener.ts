'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Default listen interval
 */
const LISTENER_INTERVAL = 2000

export function useListener<T = boolean>() {
  const func = useRef<() => Promise<T | undefined>>(async () => undefined)
  const listenInterval = useRef(2000)
  const retryCount = useRef(-1)
  const callback = useRef<(result: T | undefined) => void>(() => {})

  const [result, setResult] = useState<T | undefined>(undefined)
  const [isListening, setIsListening] = useState(false)

  // Stop listen when result is valid
  useEffect(() => {
    if (result !== undefined) stopListen()
  }, [result])

  // Call func repeatedly when isListening is True
  useEffect(() => {
    const id = setInterval(async () => {
      if (isListening) {
        const result = await func.current()
        if (result !== undefined) setResult(result)
        if (retryCount.current > 0) retryCount.current--
        if (retryCount.current === 0) stopListen()
      }
    }, listenInterval.current)

    return () => {
      clearInterval(id)
    }
  }, [isListening])

  function startListen(
    intervalFunc: () => Promise<T | undefined>,
    {
      interval = LISTENER_INTERVAL,
      retry = -1,
      immediate = false,
      onListenFinished = () => {},
    }: {
      interval?: number
      retry?: number
      immediate?: boolean
      onListenFinished?: (result: T | undefined) => void
    } = {
      interval: LISTENER_INTERVAL,
      retry: -1,
      immediate: false,
      onListenFinished: () => {},
    },
  ) {
    if (isListening) {
      console.error('Already listening')
      return
    }

    // Clear old result
    setResult(undefined)
    // Set listen params
    func.current = intervalFunc
    listenInterval.current = interval
    retryCount.current = retry
    callback.current = onListenFinished

    if (immediate) {
      func.current().then((value: T | undefined) => {
        if (value) stopListen()
        else setIsListening(true)
      })
    } else {
      // Start listen
      setIsListening(true)
    }
  }

  function stopListen() {
    setIsListening(false)
    callback.current(result)
  }

  return {
    isListening,
    startListen,
    stopListen,
  }
}
