import { createStore } from './base'

export const musicStore = createStore(
  'music',
  {
    showPlay: true,
  },
  {
    persist: true,
  },
)
