import { useCallback } from 'react'

export default function useShareX({
  text,
  url,
  hashtags = [],
}: {
  text?: string
  url?: string
  hashtags?: string[]
} = {}) {
  const openTwitterShareWindow = useCallback(() => {
    const _text =
      text ??
      "No more PVP! 🫵\nI just collected my $MMK which only true meme lovers can collect!\nLet's keep building together and make #Memeking 👑 @memekingclub ignite this meme supercycle! 💥\n"

    const _url = new URL(url ?? (typeof window === 'undefined' ? '' : window.location.href))

    // _url.searchParams.set('t', Date.now().toString())

    const twitterShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(_text)}&url=${encodeURIComponent(_url.toString())}&hashtags=${encodeURIComponent(hashtags.join(','))}`

    const width = 550
    const height = 300
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    window.open(
      twitterShareUrl,
      'Share on Twitter',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,status=0`,
    )
  }, [hashtags, text, url])

  return {
    openTwitterShareWindow,
  }
}
