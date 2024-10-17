import { http } from './base'

export async function getSIWXMsg() {
  const response = await http.get<{
    content: {
      nonce: string
      statement: string
      issuedAt: string
    }
  }>(`/Authentication/siwx/signMsg/${process.env.NEXT_PUBLIC_PROJECT}`)

  return response.data.content
}

export async function postSIWXLogin({
  domain,
  nonce,
  issuedAt,
  signature,
  address,
  chainId,
  resources,
  parent,
}: {
  domain: string
  nonce: string
  issuedAt: string
  signature: string
  address: string
  chainId: string
  resources: readonly string[]
  parent: string | null
}) {
  const response = await http.post<{
    content: {
      token: string
      type: 'Bearer'
      expireAt: string
      account: string
      project: string
      extraRoles: []
    }
  }>(`/Authentication/siwx/login/${process.env.NEXT_PUBLIC_PROJECT}`, {
    domain,
    address,
    chainId,
    nonce,
    issuedAt,
    resources,
    signature,
    parent,
  })

  return response.data.content
}
