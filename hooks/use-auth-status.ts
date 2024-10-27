import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useMemo } from 'react'
import { useSnapshot } from 'valtio'

import { authStore } from '@/stores/auth'

export default function useAuthStatus() {
  const auth = useSnapshot(authStore)

  const { setVisible: setModalVisible } = useWalletModal()

  const { publicKey } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true)
    },
  })

  const { connected } = useWallet()

  const isLogin = useMemo(() => {
    return Boolean(connected && auth.token && publicKey?.toString() === authStore.publicKey)
  }, [auth.token, connected, publicKey])

  return {
    publicKey,
    isLogin,
  }
}
