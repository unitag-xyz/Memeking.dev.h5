import { useCallback } from 'react'

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

  return { shareUrl }
}
