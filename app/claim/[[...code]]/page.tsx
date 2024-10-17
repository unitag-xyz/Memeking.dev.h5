import { Metadata } from 'next'

import { getAccountInfo } from '@/apis/account'
import { claimMeta } from '@/constants/seo'
import ShareProvider from '@/provides/ShareProvider'

import { Claim } from './components/Claim'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { seo } = await getAccountInfo()

    if (seo) {
      return {
        title: seo.name,
        description: seo.description,
        twitter: {
          card: 'summary_large_image',
          site: seo.site,
          title: seo.name,
          description: seo.description,
          images: seo.image,
          creator: seo.creator,
        },
        openGraph: {
          title: seo.name,
          description: seo.description,
          images: seo.image,
        },
      }
    }
  } catch {}

  return {
    title: claimMeta.title,
    description: claimMeta.description,
    twitter: {
      card: 'summary_large_image',
      title: claimMeta.title,
      description: claimMeta.description,
      images: claimMeta.image,
    },
    openGraph: {
      title: claimMeta.title,
      description: claimMeta.description,
      images: claimMeta.image,
    },
  }
}

export default function Page({ params: { code } }: { params: { code?: string[] } }) {
  return (
    <ShareProvider code={code}>
      <Claim />
    </ShareProvider>
  )
}
