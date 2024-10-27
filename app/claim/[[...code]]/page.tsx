import { Metadata } from 'next'

import { claimMeta } from '@/constants/seo'
import ShareProvider from '@/provides/ShareProvider'

import { Claim } from './components/Claim'

export const metadata: Metadata = {
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

export default function Page({ params: { code } }: { params: { code?: string[] } }) {
  return (
    <ShareProvider code={code}>
      <Claim />
    </ShareProvider>
  )
}
