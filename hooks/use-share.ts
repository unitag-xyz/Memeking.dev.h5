import { notFound, useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { shareStore } from '@/stores/share'

import useAccount from './use-account'
import useAuth from './use-auth'

export default function useShare(code?: string[]) {
  const router = useRouter()
  const path = usePathname()
  const { isLogin } = useAuth()

  const { account } = useAccount()

  useEffect(() => {
    ;(async () => {
      if (code && code.length > 1) {
        notFound()
      }

      const shareCode = code?.[0]

      const pathname = path === '/' ? '' : path

      const mmkPosterReversion = window.location.href.split('?')[1]

      if (isLogin && account) {
        if (shareCode) {
          if (shareCode !== account.shareCode) {
            router.replace(
              pathname.replace(shareCode, account.shareCode) + `?${account.mmkPosterReversion}`,
            )
          } else {
            if (
              mmkPosterReversion !== account.mmkPosterReversion.toString() &&
              account.mmkPosterReversion > 0
            ) {
              router.replace(pathname + `?${account.mmkPosterReversion}`)
            }
          }
        } else {
          router.replace(`${pathname}/${account.shareCode}` + `?${account.mmkPosterReversion}`)
        }
      } else {
        if (shareCode) {
          shareStore.code = shareCode
        }
      }
    })()
  }, [account, code, isLogin, path, router])
}
