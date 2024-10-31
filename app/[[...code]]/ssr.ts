import { requestSSR } from '@/modules/api'
import type { AccountModel } from '@/types/account'

export { getHomeSSR }

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL as string

async function getHomeSSR(shareCode?: string) {
  const url = baseURL + '/Account' + (shareCode ? `/${shareCode}` : '')
  return requestSSR<AccountModel>(url)
}
