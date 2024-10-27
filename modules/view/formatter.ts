export { formatAddressView }

/**
 * 合约地址的显示方法
 *
 * @param address - 合约地址全文
 * @param startLen - 显示的开头长度，默认为5
 * @param endLen - 显示的结尾长度，默认为4
 * @returns 可以显示的图片路径
 */
function formatAddressView(address: string | undefined, startLen: number = 5, endLen: number = 4) {
  if (!address) return ''

  return address.substring(0, startLen) + '****' + address.substring(address.length - endLen)
}
