import { http } from './base'

export async function getParts() {
  const response = await http.get<{
    content: Part[]
  }>('/composePart')

  return response.data.content
}

export async function getLogos() {
  const response = await http.get<{
    content: string[]
  }>('/ComposePart/logos')

  return response.data.content
}
