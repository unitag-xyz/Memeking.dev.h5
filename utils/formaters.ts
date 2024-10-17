export function beautifyAddress(address: string) {
  return address.slice(0, 4) + '...' + address.slice(-4)
}
export function formatSol(sol: number, fractionDigits = 9) {
  return Number(sol.toFixed(fractionDigits))
}
