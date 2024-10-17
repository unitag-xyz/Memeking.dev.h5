import { animated, useSpring } from '@react-spring/web'
import { useCallback, useEffect, useState } from 'react'

import Music from '@/assets/images/music.svg'
import useBackendMusic from '@/hooks/use-backend-music'

export default function BackgroundMusic() {
  const { isPlaying, play, pause } = useBackendMusic()
  const [first, setFirst] = useState(true)

  const [springs, api] = useSpring(() => ({
    from: { rotateZ: 0 },
  }))

  useEffect(() => {
    if (isPlaying) {
      if (first) {
        setFirst(false)
        api.start({
          from: { rotateZ: 0 },
          to: { rotateZ: 360 },
          loop: true, // 无限循环
          config: { duration: 2000 }, // 控制动画速度（2秒完成一次旋转）
        })
      } else {
        api.resume()
      }
    } else {
      api.pause()
    }
  }, [api, first, isPlaying])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  return (
    <animated.div style={springs} onClick={toggle}>
      <Music className="cursor-pointer" />
    </animated.div>
  )
}
