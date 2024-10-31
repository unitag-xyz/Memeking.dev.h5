import { formatAPIResponse } from '../formatter/request'
import type { HttpRequestOptions } from '../types/request'

export { requestSSR }

async function requestSSR<TResponse = any, TMapper = TResponse>(
  url: string,
  options: HttpRequestOptions<TResponse, TMapper> = {},
) {
  const data = await fetch(url, {
    method: 'get',
  })
  const info = await data.json()
  return formatAPIResponse(info, options) as TMapper
}
