import { createStore } from './base'

export const partsStore = createStore<{
  background: Part | null
  border: Part | null
  logo: Part | null
  hat: Part | null
  accessory: Part | null
}>(
  'parts',
  {
    background: null,
    border: null,
    logo: null,
    hat: null,
    accessory: null,
  },
  {
    persist: true,
  },
)
