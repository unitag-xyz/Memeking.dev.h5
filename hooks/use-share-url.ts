import { useCallback } from 'react'
import useSWR from 'swr'

import { getWindow } from '@/utils/window'

import useAccount from './use-account'

export function useShareUrl() {
  const { account } = useAccount()

  const shareUrl = useCallback(
    (url: string) => {
      if (account) {
        return `${url === '/' ? '' : url}/${account.shareCode}`
      }

      return url
    },
    [account],
  )

  const { data: currentUrl } = useSWR('current-url', () => {
    return new Promise<string | undefined>((resolve) => {
      setTimeout(() => {
        resolve(getWindow()?.location.href)
      }, 100)
    })
  })

  return { shareUrl, currentUrl }
}
