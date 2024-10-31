export { getENV, getRandomInt, sleep }

function getENV() {
  return process.env.NEXT_PUBLIC_ENV ?? 'development'
}

function getRandomInt(min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}

function sleep(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time))
}
