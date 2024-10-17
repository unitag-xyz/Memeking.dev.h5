import { createStore } from './base'

export { authStore, startLogin, finishLogin, clearAuth }

const authStore = createStore(
  'auth',
  {
    token: '',
    publicKey: '',
    isLogining: false,
  },
  {
    persist: true,
  },
)

function startLogin() {
  authStore.isLogining = true
}

function finishLogin(token: string, publicKey: string) {
  authStore.token = token
  authStore.publicKey = publicKey
  authStore.isLogining = false
}

function clearAuth() {
  authStore.token = ''
  authStore.publicKey = ''
}
