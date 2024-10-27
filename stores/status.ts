import { createStore } from './base'

export { statusStore }

const statusStore = createStore('status', {
  isLogining: false,
})
