const cache: {
  [key: string]: HTMLImageElement
} = {}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    if (cache[src]) {
      resolve(cache[src])
      return
    }

    const img = new Image()

    img.onload = () => resolve(img)
    img.onerror = reject

    img.src = src
  })
}
