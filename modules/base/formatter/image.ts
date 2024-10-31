export { formatImageRevision }

function formatImageRevision(url: string, revision?: number) {
  if (!url) return ''
  else if (revision === undefined) return url
  else return url + '?' + revision
}
