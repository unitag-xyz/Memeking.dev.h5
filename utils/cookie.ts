import * as cookiesNext from 'cookies-next'

import { isServer } from './detector'

// Error
// import { cookies } from 'next/headers'

export function getCookie(name: string): string | undefined {
  if (isServer()) {
    const cookies = require('next/headers').cookies

    return cookies().get(name)?.value
  } else {
    return cookiesNext.getCookie(name)
  }
}

export function setCookie(name: string, value: string) {
  if (!isServer()) {
    return cookiesNext.setCookie(name, value, {
      maxAge: 60 * 60 * 24 * 365,
    })
  }
}
