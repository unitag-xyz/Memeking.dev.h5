import { useDevice } from '../hooks/useDevice'

export { openWindow }

const { urlTag } = useDevice()

function openWindow(url: string) {
  if (!url) return

  window.open(url, urlTag)
}
