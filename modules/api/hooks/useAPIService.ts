import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import { formatErrorMessage } from '@/modules/base'

import { formatAPIResponse } from '../formatter/request'
import { createService } from '../service'
import type { HttpRequest, HttpRequestOptions, HttpResponse } from '../types/request'

export { useAPIService }

const services: Record<string, AxiosInstance> = {}

function useAPIService(
  baseURL: string,
  { timeout, errors = {} }: { timeout?: number; errors?: Record<string, () => void> } = {
    errors: {},
  },
) {
  if (!services[baseURL]) services[baseURL] = createService(baseURL, { timeout })
  const service = services[baseURL]

  const request: HttpRequest = async function <TResponse = any, TMapper = TResponse>(
    params: AxiosRequestConfig,
    { responseError, mapper }: HttpRequestOptions<TResponse, TMapper> = {},
  ) {
    try {
      const { data } = await service.request<HttpResponse<TResponse>>(params)
      return formatAPIResponse(data, { responseError, mapper }) as TMapper
    } catch (error: any) {
      const status = error?.message.startsWith('timeout')
        ? 'timeout'
        : (error?.response?.status as string)
      if (status && errors[status]) {
        errors[status]()
        return Promise.reject({
          isResponseError: true,
          message: formatErrorMessage(error),
        })
      } else {
        console.log('APIService: ', error)
        return Promise.reject(error)
      }
    }
  }

  return {
    request,
  }
}
