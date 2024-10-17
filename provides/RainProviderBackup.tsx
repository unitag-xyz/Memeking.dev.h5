'use client'

import { animated, easings, useSpring } from '@react-spring/web'
import * as _ from 'lodash'
import Image from 'next/image'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

import { getLogos } from '@/apis/part'

function Logo({ logo, onOver, round }: { round: number; logo: string; onOver: () => void }) {
  const size = useMemo(() => _.random(50, 80), [round])
  // const speed = useMemo(() => _.random(1, 3, true), [round])
  const duration = useMemo(() => _.random(2000, 5000), [round])
  const delay = useMemo(() => _.random(0, 8000), [round])

  const left = useMemo(
    () => Math.min(window.innerWidth * Math.random(), window.innerWidth - 80),
    [round],
  )

  const [springs, api] = useSpring(() => ({
    from: { top: '100px' },
  }))

  useEffect(() => {
    api.start({
      from: { top: '100px' },
      to: { top: `${window.innerHeight}px` },
      delay,
      config: { duration, easing: easings.linear },
      onRest() {
        api.start({
          to: {
            top: '100px',
          },
          immediate: true,
        })
      },
    })
  }, [api, delay, duration])

  useEffect(() => {
    const timer = setTimeout(() => {
      onOver()
    }, duration + delay)

    return () => {
      clearTimeout(timer)
    }
  }, [delay, duration, onOver])

  return (
    <animated.div
      className="z-[1000]select-none pointer-events-none fixed rounded-full border-[4px] border-[#f4b750]"
      style={{
        left,
        width: `${size}px`,
        height: `${size}px`,
        ...springs,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        style={
          {
            // animationName: 'rain',
            // animationDuration: `${duration}ms`,
            // animationDelay: `${delay}ms`,
            // animationTimingFunction: 'linear',
          }
        }
        alt="logo"
        src={logo}
      />
    </animated.div>
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
  const [round, setRound] = useState(1)

  const increaseCount = useCallback(() => setCount((count) => count + 1), [])

  useEffect(() => {
    if (count === logos?.length) {
      setCount(0)
      setTimeout(() => {
        setRound((round) => round + 1)
      }, interval)
    }
  }, [count, interval, logos])

  return (
    <>
      {children}
      <div>
        {logos &&
          logos.map((logo, index) => (
            <Logo round={round} key={index} logo={logo} onOver={increaseCount} />
          ))}
      </div>
    </>
  )
}
