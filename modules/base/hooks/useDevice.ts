'use Client'

import checkMobile from 'is-mobile'

export function useDevice() {
  const isMobile = checkMobile() ? true : false
  const urlTag = isMobile ? '_self' : '_blank'

  return {
    isMobile,
    urlTag,
  }
}
