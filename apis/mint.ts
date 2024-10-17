import { http } from './base'

export async function submitMintTransaction({
  txHash,
  composeDataProps,
}: {
  txHash: string
  composeDataProps: ComposeDataProps
}) {
  const response = await http.post<{
    content: {
      sbtMetadata: {
        id: number
        level: number
      } | null
      account: string
      composeData: ComposeData
      parent: null | string
      shareCode: string
      level: number
      sbtPoints: number
      refferalPoints: number
      closedAccountPoints: number
      totalPoints: number
      closedAccounts: number
      reclaimedSols: number
      mmkPosterReversion: number
      avatar: string
      seo: {
        type: string
        creator: string
        site: string
        image: string
        name: string
        description: string
      } | null
      evmAddress: string | null
    }
  }>('/Account/tx/mint', {
    txHash,
    composeData: composeDataProps,
  })

  return response.data.content
}
