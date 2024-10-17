import type { Metadata } from 'next'

import { homeMeta } from '@/constants/seo'
import ShareProvider from '@/provides/ShareProvider'

import Mint from './components/Mint'
import Sbt from './components/Sbt'
import Tasks from './components/Tasks'
import Uga from './components/Uga'

export const metadata: Metadata = {
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

export default function Page({ params: { code } }: { params: { code?: string[] } }) {
  // useShare(code)
  return (
    <ShareProvider code={code}>
      <Mint />
      <Tasks />
      <Sbt />
      <Uga />
    </ShareProvider>
  )
}
