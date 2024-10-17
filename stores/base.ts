import { proxy, subscribe } from 'valtio'

import { getCookie, setCookie } from '@/utils/cookie'

export { createStore }

function createStore<T extends object>(
  key: string,
  defaultValue: T,
  {
    persist = false,
  }: {
    persist?: boolean
  } = {},
) {
  if (persist) {
    key = `${process.env.NEXT_PUBLIC_PROJECT_NAME}-${key}`

    const valueStr = getCookie(key)

    let value
    if (valueStr) {
      try {
        value = JSON.parse(valueStr)
      } catch {}
    }

    const store = proxy<T>(value ?? defaultValue)
    subscribe(store, () => {
      setCookie(key, JSON.stringify(store))
    })
    return store
  } else {
    return proxy(defaultValue)
  }
}
