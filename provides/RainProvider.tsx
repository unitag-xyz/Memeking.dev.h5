'use client'

import * as _ from 'lodash'
import Image from 'next/image'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import useSWRImmutable from 'swr/immutable'

import { getLogos } from '@/apis/part'

function Logo({ logo, onOver }: { logo: string; onOver: () => void }) {
  const size = useMemo(() => _.random(50, 80), [])
  // const speed = useMemo(() => _.random(1, 3, true), [])
  const duration = useMemo(() => _.random(2000, 5000), [])
  const delay = useMemo(() => _.random(0, 8000), [])

  const left = useMemo(
    () => Math.min(window.innerWidth * Math.random(), window.innerWidth - 80),
    [],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      onOver()
    }, duration + delay)

    return () => {
      clearTimeout(timer)
    }
  }, [delay, duration, onOver])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      width={size}
      height={size}
      style={{
        left,
        width: `${size}px`,
        height: `${size}px`,
        animationName: 'rain',
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationTimingFunction: 'linear',
      }}
      className="pointer-events-none fixed z-[1000] h-10 w-10 select-none rounded-full border-[4px] border-[#f4b750]"
      alt="logo"
      src={logo}
    />
  )
}

export default function RainProvider({
  children,
  interval = 5000,
}: {
  children: ReactNode
  interval?: number
}) {
  const { data: logos } = useSWRImmutable('logos', () => getLogos())

  const [count, setCount] = useState(0)

  const increaseCount = useCallback(() => setCount((count) => count + 1), [])

  useEffect(() => {
    if (count === logos?.length) {
      setTimeout(() => {
        setCount(0)
      }, interval)
    }
  }, [count, interval, logos])

  return (
    <>
      {children}
      <div>
        {logos &&
          count < logos.length &&
          logos.map((logo, index) => <Logo key={index} logo={logo} onOver={increaseCount} />)}
      </div>
    </>
  )
}
