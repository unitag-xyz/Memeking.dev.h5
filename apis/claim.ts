import { http } from './base'

export async function submitCloseTransaction({ txHash }: { txHash: string }) {
  const response = await http.post('/Account/tx/close', {
    txHash,
  })

  return response.data.content
}
