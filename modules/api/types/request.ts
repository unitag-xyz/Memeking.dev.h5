import type { AxiosRequestConfig } from 'axios'

export type { TypeCodeErrors, HttpRequest, HttpRequestOptions, HttpResponse }

type TypeCodeErrors = Record<string, (error: any) => void>

type HttpRequest = <TResponse = any, TMapper = TResponse>(
  params: AxiosRequestConfig,
  options?: HttpRequestOptions<TResponse, TMapper>,
) => Promise<TMapper>

type HttpRequestOptions<TResponse = any, TMapper = any> = {
  useToken?: boolean
  format?: boolean
  responseError?: TypeCodeErrors
  mapper?: (data: TResponse) => TMapper
}

type HttpResponse<T = any> = {
  content: T | null
  typeCode: number
  message: string | null
}
