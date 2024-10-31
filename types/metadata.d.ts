type MetadataProps<T> = {
  params: Promise<T>
  searchParams: { [key: string]: string | string[] | undefined }
}
