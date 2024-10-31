export { createRequestHeaders }

function createRequestHeaders({ locale, token }: { locale?: string; token?: string }) {
  const headers: Record<string, string> = {}
  if (locale) headers['Accept-Language'] = locale.toLowerCase()
  if (token) headers['Authorization'] = 'Bearer ' + token

  return headers
}
