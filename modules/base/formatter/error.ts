export { formatErrorMessage }

function formatErrorMessage(error: any) {
  if (typeof error === 'string') return error
  else return error.data?.message || error.message
}
