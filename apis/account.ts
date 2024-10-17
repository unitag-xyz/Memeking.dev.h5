import { http } from './base'

export async function getAccountInfo() {
  const response = await http.get<{
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
  }>('/Account')

  return response.data.content
}

export async function setLevel(level: number) {
  await http.put(`/Account/level/${level}`)
}

export async function setEvm(evm: string) {
  await http.put(`/Account/evm/${evm}`)
}

export async function upgradeLevel({ txHash }: { txHash: string }) {
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
  }>('/Account/tx/upgrade', {
    txHash,
  })

  return response.data.content
}
