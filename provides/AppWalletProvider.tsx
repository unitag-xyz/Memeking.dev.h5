'use client'

import { Adapter, WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'
// import { type SolanaSignInInput } from '@solana/wallet-standard-features'
import { clusterApiUrl } from '@solana/web3.js'
import React, { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

import { getSIWXMsg, postSIWXLogin } from '@/apis/auth'
import useError from '@/hooks/use-error'
import { finishLogin } from '@/stores/auth'
import { shareStore } from '@/stores/share'
import { statusStore } from '@/stores/status'
import { uint8ArrayToHexString } from '@/utils/converts'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

export default function AppWalletProvider({ children }: { children: React.ReactNode }) {
  const { handleError } = useError({
    mode: 'toast',
  })

  const network = process.env.NEXT_PUBLIC_CHAIN_ID as ChainID

  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const endpoint = process.env.NEXT_PUBLIC_RPC as string

  const wallets = useMemo(
    () => [
      // manually add any legacy wallet adapters here
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({
        network: process.env.NEXT_PUBLIC_CHAIN_ID as WalletAdapterNetwork,
      }),
    ],
    [network],
  )

  const autoSignIn = useCallback(
    async (adapter: Adapter) => {
      try {
        if (!statusStore.isLogining) return true

        await adapter.connect()

        const msg = await getSIWXMsg()

        const domain = window.location.host

        const chainId =
          (process.env.NEXT_PUBLIC_CHAIN_ID as ChainID) === 'mainnet-beta'
            ? 'mainnet'
            : process.env.NEXT_PUBLIC_CHAIN_ID!

        const resources = [process.env.NEXT_PUBLIC_SITE_URL as string]

        const address = adapter.publicKey?.toString()

        if (!address) throw new Error('No public key')

        let signature

        // If the signIn feature is not available, return true
        if ('signIn' in adapter) {
          const input: SolanaSignInInput = {
            domain,
            statement: msg.statement,
            nonce: msg.nonce,
            chainId,
            issuedAt: msg.issuedAt,
            resources,
          }

          // Send the signInInput to the wallet and trigger a sign-in request
          const output = await adapter.signIn(input)

          signature = output.signature
        } else if ('signMessage' in adapter) {
          const message = `${domain} wants you to sign in with your Solana account:
${address}

${msg.statement}

Chain ID: ${chainId}
Nonce: ${msg.nonce}
Issued At: ${msg.issuedAt}
Resources:
${resources.map((resource) => `- ${resource}`).join('\n')}`

          const encoded = new TextEncoder().encode(message)

          signature = await adapter.signMessage(encoded)
        } else {
          throw new Error()
        }
        // localhost:3000 wants you to sign in with your Solana account:
        // EUtua76ndyCLjhBQivbEdK4a1tFgg9T49vhjUn5J2qpN

        // Welcome to Fressia

        // Chain ID: devnet
        // Nonce: 638645049516469426
        // Issued At: 2024-10-14T12:15:51Z
        // Resources:
        // - http://localhost:3000

        const response = await postSIWXLogin({
          domain: domain,
          nonce: msg.nonce,
          issuedAt: msg.issuedAt,
          chainId,
          address,
          signature: uint8ArrayToHexString(signature),
          resources,
          parent: shareStore.code,
        })

        finishLogin(response.token, address)

        // If verification fails, throw an error
        if (!response) throw new Error('Sign In verification failed!')

        if (adapter.name === 'Backpack') {
          window.location.reload()
        }
      } catch (error) {
        // if (error instanceof WalletError) {
        //   if (error.error.code === 4001) {
        //     toast.error('Connection was canceled.')

        //     return false
        //   }
        // }

        try {
          handleError(error)
        } catch {
          // toast.error(
          //   'Network error: failed to connect to the network & wallet cannot connect to the RPC',
          // )

          console.dir(error)
          console.error(error)
        }
      } finally {
        statusStore.isLogining = false
      }

      // adapter.signIn 已经包含 connect 了，这里无需再 auto connect 了
      return false
    },
    [handleError],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoSignIn}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
