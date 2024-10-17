export function uint8ArrayToHexString(array: Uint8Array) {
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const lamportsToSol = (lamports: number) => lamports / 1_000_000_000
export const solToLamports = (sol: number) => Math.floor(sol * 1_000_000_000)
