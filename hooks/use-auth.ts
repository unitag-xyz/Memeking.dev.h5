import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSnapshot } from 'valtio'

import { authStore, clearAuth, startLogin } from '@/stores/auth'

export default function useAuth() {
  const auth = useSnapshot(authStore)

  const { setVisible: setModalVisible } = useWalletModal()

  const {
    buttonState,
    onConnect,
    onDisconnect,
    onSelectWallet,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true)
    },
  })

  const { connected } = useWallet()

  const isLogin = useMemo(() => {
    return Boolean(connected && auth.token && publicKey?.toString() === authStore.publicKey)
  }, [auth.token, connected, publicKey])

  const login = useCallback(
    async ({ isDisconnect = true }: { isDisconnect?: boolean } = {}) => {
      startLogin()

      if (isDisconnect) onDisconnect?.()

      onSelectWallet?.()
    },
    [onDisconnect, onSelectWallet],
  )

  const logout = useCallback(() => {
    clearAuth()
    onDisconnect?.()
  }, [onDisconnect])

  return {
    login,
    logout,
    publicKey,
    isLogin,
    connected,
  }
}
