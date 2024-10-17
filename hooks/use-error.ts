import { WalletError } from '@solana/wallet-adapter-base'
import { useCallback } from 'react'

import { useModal } from './use-modal'

export default function useError() {
  const { showError } = useModal()

  const handleError = useCallback(
    (error: any) => {
      if (error instanceof WalletError) {
        // https://docs.phantom.app/solana/errors
        if (error.error.code === 4001) {
          showError({
            msg: 'Transaction rejected',
          })
          return
        }
      }
      throw error
    },
    [showError],
  )

  return {
    handleError,
  }
}
