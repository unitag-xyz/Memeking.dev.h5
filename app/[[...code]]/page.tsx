import type { Metadata } from 'next'

import { getAccountInfo } from '@/apis/account'
import { homeMeta } from '@/constants/seo'
import ShareProvider from '@/provides/ShareProvider'

import Mint from './components/Mint'
import Tasks from './components/Tasks'
import Tokens from './components/Tokens'
import Uga from './components/Uga'

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
    title: homeMeta.title,
    description: homeMeta.description,
    twitter: {
      card: 'summary_large_image',
      title: homeMeta.title,
      description: homeMeta.description,
      images: homeMeta.image,
    },
    openGraph: {
      title: homeMeta.title,
      description: homeMeta.description,
      images: homeMeta.image,
    },
  }
}

export default function Page({ params: { code } }: { params: { code?: string[] } }) {
  // useShare(code)
  return (
    <ShareProvider code={code}>
      <Mint />
      <Tasks />
      <Tokens />
      <Uga />
    </ShareProvider>
  )
}
