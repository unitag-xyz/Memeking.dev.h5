import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { ERRORS } from '@/error'

export function createHttp(baseURL: string) {
  const http = axios.create({
    baseURL,
  })

  http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const { authStore } = await import('@/stores/auth')

    if (authStore.token) {
      // @ts-expect-error type
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${authStore.token}`,
      }
    }
    return config
  })

  // 0x40CAdEfe581F2EC517048921DCa107A415C05f82
  // 151

  http.interceptors.response.use((response: AxiosResponse) => {
    const typeCode = response.data['typeCode'] as number
    if (typeCode !== 1) {
      throw new ERRORS[typeCode]()
    }

    return response
  })

  return http
}

export const http = createHttp(process.env.NEXT_PUBLIC_API_BASE_URL as string)
