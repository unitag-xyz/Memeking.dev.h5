'use client'

import Discord from '@/assets/images/icons/discord.svg'
import Telegram from '@/assets/images/icons/telegram.svg'
import Web from '@/assets/images/icons/web.svg'
import X from '@/assets/images/icons/x.svg'
import Logo from '@/assets/images/logo.svg'
import useShareX from '@/hooks/use-share-x'

export default function Footer() {
  const { openTwitterShareWindow } = useShareX({
    text: "No more PVP! 🫵\nI just collected my $MMK which only true meme lovers can collect!\nLet's keep building together and make #Memeking 👑 @memekingclub ignite this meme supercycle! 💥\n",
    url: typeof window === 'undefined' ? '' : window.location.href,
  })
  function openTelegram() {
    const url = 'https://t.me/MemekingGlobal'
    window.open(url)
  }
  function openXcom() {
    const url = 'https://x.com/memekingclub'
    window.open(url)
  }
  return (
    <div className="bg-brand px-[20px] py-[20px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <Logo />
        <div className="flex gap-x-[15px]">
          <X onClick={openXcom} className="cursor-pointer" />
          <Telegram onClick={openTelegram} className="cursor-pointer" />
        </div>
      </div>
    </div>
  )
}
