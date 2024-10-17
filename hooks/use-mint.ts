import {
  mintV1,
  mplCandyMachine as mplCoreCandyMachine,
} from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit, transferSol } from '@metaplex-foundation/mpl-toolbox'
import { generateSigner, publicKey, sol, some, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import bs58 from 'bs58'
import { useCallback, useMemo } from 'react'

import { submitMintTransaction } from '@/apis/mint'

import useAccount from './use-account'

export default function useMint() {

  const { connection } = useConnection()

  const network = process.env.NEXT_PUBLIC_CHAIN_ID as ChainID

  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const endpoint = process.env.NEXT_PUBLIC_RPC as string

  // Import useWallet hook
  const wallet = useWallet()

  const { levelInfo, mutateAccount } = useAccount()

  const mint = useCallback(
    async (composeDataProps: ComposeDataProps) => {
      if (!levelInfo) return

      const umi = createUmi(endpoint, 'confirmed')
        .use(mplCoreCandyMachine()) // Register Wallet Adapter to Umi
        .use(walletAdapterIdentity(wallet))

      const asset = generateSigner(umi)

      const txMint = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          transferSol(umi, {
            destination: publicKey(process.env.NEXT_PUBLIC_TREASURY_ADDR!),
            amount: sol(levelInfo.cost - 0.01),
          }),
        )
        .add(
          mintV1(umi, {
            candyMachine: publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ADDR!),
            asset: asset,
            collection: publicKey(process.env.NEXT_PUBLIC_COLLECTION_ADDR!),
            mintArgs: {
              solPayment: some({ destination: publicKey(process.env.NEXT_PUBLIC_TREASURY_ADDR!) }),
            },
          }),
        )
        .setVersion('legacy')
        .send(umi);
      //        AndConfirm(umi, { confirm: { commitment: 'confirmed' } })
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); 
        var status = await connection.getSignatureStatuses([bs58.encode(txMint)], { searchTransactionHistory: true })
        if (status.value[0]?.err != null) {
          throw new Error(`Transaction failed: ${status.value[0]?.err}`)
        }
        if (status.value[0]?.confirmationStatus == 'finalized' || status.value[0]?.confirmationStatus == 'confirmed')
          break;
      }

      const result = await submitMintTransaction({
        txHash: bs58.encode(txMint),
        composeDataProps,
      })

      mutateAccount()

      return result
    },
    [endpoint, levelInfo, mutateAccount, wallet],
  )

  return { mint }
}
