'use client'

import Discord from '@/assets/images/icons/discord.svg'
import Telegram from '@/assets/images/icons/telegram.svg'
import Web from '@/assets/images/icons/web.svg'
import X from '@/assets/images/icons/x.svg'
import Logo from '@/assets/images/logo.svg'
import useShareX from '@/hooks/use-share-x'

export default function Footer() {
  const { openTwitterShareWindow } = useShareX({
    text: 'share',
    url: typeof window === 'undefined' ? '' : window.location.href,
  })

  return (
    <div className="bg-brand px-[20px] py-[20px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <Logo />
        <div className="flex gap-x-[15px]">
          <Web className="cursor-pointer" />
          <X onClick={openTwitterShareWindow} className="cursor-pointer" />
          <Telegram className="cursor-pointer" />
          <Discord className="cursor-pointer" />
        </div>
      </div>
    </div>
  )
}
