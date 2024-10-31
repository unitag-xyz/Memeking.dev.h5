export { formatNumber, formatStringNumber }

const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi']

function formatNumber(number: number | string | undefined, decimal: number = 1) {
  if (number == undefined) return undefined

  number = Number(number)
  if (number === 0) return '0'
  if (number < 1000) return number.toFixed(decimal)

  let unitCount = 0
  while (number >= 1000) {
    number /= 1000
    unitCount++
  }

  return Math.floor(number * 10) / 10 + (units[unitCount] ?? '?')
}

function formatStringNumber(
  number: string,
  {
    decimal = 1,
    formatStart = 4,
    formatMax = 12,
  }: { decimal?: number; formatStart?: number; formatMax?: number } = {
    decimal: 1,
    formatStart: 4,
    formatMax: 12,
  },
) {
  if (number.length < formatStart) return number

  const validLength = formatMax < 0 ? number.length : Math.min(number.length, formatMax)
  const unitCount = Math.floor((validLength - 1) / 3)

  const intValue = number.slice(0, number.length - unitCount * 3)
  const decimalValue = number.slice(
    number.length - unitCount * 3,
    number.length - unitCount * 3 + decimal,
  )

  return intValue + '.' + decimalValue + (units[unitCount] ?? '?')
}
