import { formatDateString } from '@/modules/base'

export { formatAPIDate, formatAPITime }

function formatAPIDate(time: string) {
  return new Date(time.replace(/-/g, '/') + ' GMT')
}

function formatAPITime(time: string, format?: string) {
  return formatDateString(formatAPIDate(time), format)
}
