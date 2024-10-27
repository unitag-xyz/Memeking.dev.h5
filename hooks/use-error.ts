import { WalletError, WalletSignTransactionError } from '@solana/wallet-adapter-base'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

import { useModal } from './use-modal'

export default function useError({ mode = 'modal' }: { mode?: 'modal' | 'toast' } = {}) {
  const { showError: showModalError } = useModal()

  const showError = useCallback(
    (msg: string) => {
      if (mode === 'modal') {
        showModalError({
          msg,
        })
      } else if (mode === 'toast') {
        toast.error(msg)
      }
    },
    [mode, showModalError],
  )

  const handleError = useCallback(
    (error: any) => {
      if (error instanceof WalletError) {
        // https://docs.phantom.app/solana/errors
        if (error.error.code === 4001 || error.error.code === -32000) {
          showError('Transaction rejected')
          return
        }

        if (error.error === 'Transaction cancelled') {
          showError('Transaction rejected')
          return
        }

        if (error.message === 'Approval Denied') {
          showError('Transaction rejected')
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
