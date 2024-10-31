import type { SeoModel } from '@/modules/api'

export type { AccountModel }

type AccountModel = {
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
  seo: SeoModel | null
  evmAddress: string | null
}
