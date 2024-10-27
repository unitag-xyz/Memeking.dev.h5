import { createStore } from './base'

export { authStore, finishLogin, clearAuth }

const authStore = createStore(
  'auth',
  {
    token: '',
    publicKey: '',
  },
  {
    persist: true,
  },
)

function finishLogin(token: string, publicKey: string) {
  authStore.token = token
  authStore.publicKey = publicKey
}

function clearAuth() {
  authStore.token = ''
  authStore.publicKey = ''
}
