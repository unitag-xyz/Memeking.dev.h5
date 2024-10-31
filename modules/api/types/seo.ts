export type { SeoCardType, SeoModel }

type SeoCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

type SeoModel = {
  type: SeoCardType
  site: string
  creator: string
  name: string
  description: string
  image: string
}
