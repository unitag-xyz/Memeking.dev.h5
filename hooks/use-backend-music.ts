import { useCallback, useContext, useMemo, useState } from 'react'

import { BackgroundMusicContext } from '@/provides/BackgroundMusicProvider'

export default function useBackendMusic() {
  const context = useContext(BackgroundMusicContext)

  if (!context) throw new Error()

  return {
    isPlaying: context.isPlaying,
    play: context.play,
    pause: context.pause,
  }
}
