import { formatAPIResponse } from '../formatter/request'
import { HttpRequestOptions } from '../types/request'

export async function useSSR<TResponse = any, TMapper = TResponse>(
  url: string,
  options: HttpRequestOptions<TResponse, TMapper> = {},
) {
  const data = await fetch(url, {
    method: 'get',
  })
  const info = await data.json()
  return formatAPIResponse(info, options) as TMapper
}
