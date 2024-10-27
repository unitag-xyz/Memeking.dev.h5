import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr/immutable'

import {
  getAccountInfo,
  setEvm,
  setLevel as setLevelApi,
  upgradeLevel as upgradeLevelApi,
} from '@/apis/account'
import { LEVELS, MAX_LEVEL } from '@/constants/levels'
import { solToLamports } from '@/utils/converts'

import useAuthStatus from './use-auth-status'
import useClaim from './use-claim'

export default function useAccount() {
  const { tokenAccounts } = useClaim()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const { isLogin } = useAuthStatus()

  const { data: account, mutate: mutateAccount } = useSWR(['account', isLogin, publicKey], () => {
    if (isLogin) {
      return getAccountInfo()
    }
  })

  const level = useMemo(() => {
    if (account) {
      if (account.sbtMetadata) {
        return account.sbtMetadata.level
      } else if (tokenAccounts) {
        for (const l of LEVELS.sort((a, b) => b.level - a.level)) {
          if (tokenAccounts.length + account.closedAccounts >= l.minAccount) {
            return l.level
          }
        }
      }
    }
  }, [account, tokenAccounts])

  const isMinted = useMemo(() => Boolean(account?.sbtMetadata), [account?.sbtMetadata])

  const status = useMemo<'not-login' | 'not-mint' | 'can-upgrade' | 'minted' | undefined>(() => {
    if (account) {
      if (!isLogin) return 'not-login'

      if (!account.sbtMetadata) return 'not-mint'

      if (account.level > account.sbtMetadata.level) return 'can-upgrade'

      return 'minted'
    }
  }, [account, isLogin])

  const setEvmAddress = useCallback(
    async (evm: string) => {
      await setEvm(evm)
      mutateAccount()
    },
    [mutateAccount],
  )

  const levelInfo = useMemo(() => {
    if (level) {
      return LEVELS.find((l) => l.level === level)
    }
  }, [level])

  const targetLevelInfo = useMemo(() => {
    return LEVELS.find((l) => l.level === account?.level)
  }, [account?.level])

  const checkAndSetLevel = useCallback(async () => {
    if (account) {
      if (account.sbtMetadata && account.sbtMetadata?.level >= MAX_LEVEL) {
        return
      } else if (tokenAccounts) {
        for (const l of LEVELS.sort((a, b) => b.level - a.level)) {
          if (tokenAccounts.length + account.closedAccounts >= l.minAccount) {
            if (l.level > account.level) {
              await setLevelApi(l.level)
              mutateAccount()
            }

            break
          }
        }
      }
    }
  }, [account, mutateAccount, tokenAccounts])

  // useEffect(() => {
  //   ;(async () => {
  //     if (account) {
  //       if (account.sbtMetadata && account.sbtMetadata?.level >= MAX_LEVEL) {
  //         setLevel(MAX_LEVEL)
  //       } else if (tokenAccounts) {
  //         for (const l of LEVELS.sort((a, b) => b.level - a.level)) {
  //           if (tokenAccounts.length + account.closedAccounts >= l.minAccount) {
  //             setLevel(account.sbtMetadata?.level ?? l.level)

  //             if (l.level > account.level) {
  //               await setLevelApi(l.level)
  //               mutateAccount()
  //             }

  //             break
  //           }
  //         }
  //       }
  //     }
  //   })()
  // }, [account, mutateAccount, tokenAccounts])

  const upgradeLevel = useCallback(async () => {
    if (!targetLevelInfo || !levelInfo || !publicKey) return

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(process.env.NEXT_PUBLIC_TREASURY_ADDR!),
        lamports: solToLamports(targetLevelInfo.cost - levelInfo.cost),
      }),
    )
    const latestBlockhash = await connection.getLatestBlockhash() // 获取最新的区块哈希

    tx.feePayer = publicKey
    tx.recentBlockhash = latestBlockhash.blockhash

    const signature = await sendTransaction(tx, connection)
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

    const result = await upgradeLevelApi({
      txHash: signature,
    })

    mutateAccount()

    return result
  }, [connection, levelInfo, mutateAccount, publicKey, sendTransaction, targetLevelInfo])

  const getLatestLevelInfo = useCallback(async () => {
    const account = await getAccountInfo()
    return {
      info: LEVELS.find((l) => l.level === account?.level),
      account,
    }
  }, [])

  return {
    isLogin,
    level,
    levelInfo,
    account,
    isMinted,
    setEvmAddress,
    status,
    upgradeLevel,
    targetLevelInfo,
    getLatestLevelInfo,
    mutateAccount,
    checkAndSetLevel,
  }
}
