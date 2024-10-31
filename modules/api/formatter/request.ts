import { HttpRequestOptions, HttpResponse } from '../types/request'

export { formatAPIResponse }

function formatAPIResponse<TResponse = any, TMapper = TResponse>(
  response: HttpResponse<TResponse>,
  { responseError, mapper }: HttpRequestOptions<TResponse, TMapper> = { format: true },
): TMapper | null {
  const { content, typeCode, message } = response
  let result: TResponse | null = null

  if (typeCode === undefined) {
    // Do Nothing
  }
  // typeCode is correct, return content
  else if (typeCode === 1) result = content
  else {
    if (responseError) {
      if (responseError[typeCode]) {
        responseError[typeCode](message)
        result = null
      } else if (responseError['default']) {
        responseError['default'](message)
        result = null
      }
    }
    // Return error message
    throw new Error('code' + typeCode + ': ' + message || 'Error')
  }

  if (result !== null) return mapper ? mapper(result) : (result as TMapper)
  else return null
}
