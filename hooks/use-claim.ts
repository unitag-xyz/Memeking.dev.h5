import { TOKEN_PROGRAM_ID, createCloseAccountInstruction } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { getAccountInfo } from '@/apis/account'
import { submitCloseTransaction } from '@/apis/claim'
import { lamportsToSol } from '@/utils/converts'

import useAuthStatus from './use-auth-status'

export default function useClaim() {
  const { connection } = useConnection()

  const { publicKey, sendTransaction } = useWallet()

  const { isLogin } = useAuthStatus()
  const { data: account, mutate: mutateAccount } = useSWR(['account', isLogin, publicKey], () => {
    if (isLogin) {
      return getAccountInfo()
    }
  })

  const { data: balance, mutate: mutateBalance } = useSWR(
    ['balance', isLogin, publicKey],
    async () => {
      if (isLogin && publicKey) {
        return await connection.getBalance(publicKey)
      }
    },
  )

  const { data: tokenAccounts, mutate: mutateTokenAccounts } = useSWR(
    ['token-accounts', publicKey],
    async () => {
      if (!publicKey) return

      const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      })

      return response.value
    },
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times.
        if (retryCount >= 3) return

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  const emptyTokenAccounts = useMemo(
    () =>
      tokenAccounts?.filter(
        (tokenAccount) => tokenAccount.account.data.parsed['info']['tokenAmount']['amount'] === '0',
      ),
    [tokenAccounts],
  )

  const totalSOLToClaim = useMemo(
    () =>
      _.sum(
        emptyTokenAccounts?.map((tokenAccount) => lamportsToSol(tokenAccount.account.lamports)),
      ),
    [emptyTokenAccounts],
  )

  const claimTokenAccount = useCallback(async () => {
    if (
      account === undefined ||
      emptyTokenAccounts === undefined ||
      emptyTokenAccounts.length === 0 ||
      publicKey === null
    )
      return

    const fee = Math.floor(
      _.sum(emptyTokenAccounts.map((tokenAccount) => tokenAccount.account.lamports)) * 0.2,
    )

    const parentFee = account.parent ? Math.floor(fee * 0.4) : 0

    const tx = new Transaction().add(
      ...emptyTokenAccounts.map((tokenAccount) =>
        createCloseAccountInstruction(
          tokenAccount.pubkey, // token account which you want to close
          publicKey, // destination
          publicKey, // owner of token account
        ),
      ),
      ...(account.parent
        ? [
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(process.env.NEXT_PUBLIC_TREASURY_ADDR!),
              lamports: fee - parentFee,
            }),
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(account.parent),
              lamports: parentFee,
            }),
          ]
        : [
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(process.env.NEXT_PUBLIC_TREASURY_ADDR!),
              lamports: fee,
            }),
          ]),
    )

    let latestBlockhash = await connection.getLatestBlockhash()

    tx.feePayer = publicKey
    tx.recentBlockhash = latestBlockhash.blockhash

    const signature = await sendTransaction(tx, connection)
    //const latestBlockhash = await connection.getLatestBlockhash()
    // await connection.confirmTransaction(
    //   {
    //     signature: signature,
    //     blockhash: latestBlockhash.blockhash,
    //     lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    //   },
    //   'confirmed',
    // )

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      var status = await connection.getSignatureStatuses([signature], {
        searchTransactionHistory: true,
      })
      if (status.value[0]?.err != null) {
        throw new Error(`Transaction failed: ${status.value[0]?.err}`)
      }
      if (
        status.value[0]?.confirmationStatus == 'finalized' ||
        status.value[0]?.confirmationStatus == 'confirmed'
      )
        break
    }

    await submitCloseTransaction({
      txHash: signature,
    })

    await mutateTokenAccounts()
    await mutateAccount()
    await mutateBalance()
  }, [
    account,
    connection,
    emptyTokenAccounts,
    mutateAccount,
    mutateBalance,
    mutateTokenAccounts,
    publicKey,
    sendTransaction,
  ])

  return {
    balance,
    tokenAccounts,
    emptyTokenAccounts,
    totalSOLToClaim,
    claimTokenAccount,
  }
}
