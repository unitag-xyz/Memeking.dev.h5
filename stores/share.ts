import { createStore } from './base'

export const shareStore = createStore<{
  code: string | null
}>(
  'share',
  {
    code: null,
  },
  {
    persist: true,
  },
)
