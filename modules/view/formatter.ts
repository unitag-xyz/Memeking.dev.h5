export { formatStyleValue, formatAddressView }

/**
 * Format the given value into a string type value that can be used in styles.
 *
 * @param value - style value
 * @returns strings used in styles
 */
function formatStyleValue(value: number | string) {
  // Add px suffix to return when receiving number
  if (Number.isInteger(value)) return value + 'px'
  // Return directly when receiving a string
  else return value as string
}

/**
 * Format contract address strings
 *
 * @param address - contract address
 * @param prefixLen - Length of the displayed prefix, default is 5
 * @param suffixLen - Length of the displayed suffix, default is 4
 * @returns result string
 */
function formatAddressView(
  address: string | undefined,
  prefixLen: number = 5,
  suffixLen: number = 4,
) {
  if (!address) return ''

  return address.substring(0, prefixLen) + '****' + address.substring(address.length - suffixLen)
}
