'use client'

import { ReactNode, createContext, useCallback, useMemo, useState } from 'react'

import useBackendMusic from '@/hooks/use-backend-music'
import { musicStore } from '@/stores/music'
import { isClient } from '@/utils/detector'

type BackgroundMusicContextType = {
  music?: HTMLAudioElement
  isPlaying: boolean
  play: () => void
  pause: () => void
}

export const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(
  undefined,
)

export default function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const music = useMemo(() => {
    if (isClient()) {
      const audio = new Audio('/audios/background.mp3')
      audio.loop = true
      return audio
    }
    return undefined
  }, [])

  const [isPlaying, setIsPlaying] = useState(false)

  const [first, setFirst] = useState(true)

  const play = useCallback(() => {
    if (music) {
      music.play()
      setIsPlaying(true)
      musicStore.showPlay = true
    }
  }, [music])

  const firstClick = useCallback(() => {
    if (first && musicStore.showPlay) {
      play()
      setFirst(false)
    }
  }, [first, play])

  const pause = useCallback(() => {
    if (music) {
      music.pause()
      setIsPlaying(false)
      musicStore.showPlay = false
    }
  }, [music])

  return (
    <BackgroundMusicContext.Provider
      value={{
        music,
        isPlaying,
        play,
        pause,
      }}
    >
      <div className="h-full" onClick={firstClick}>
        {children}
      </div>
    </BackgroundMusicContext.Provider>
  )
}
