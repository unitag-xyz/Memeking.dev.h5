export type { PaginationOptions, PaginationModel }

type PaginationOptions<T> = {
  page?: number
  pageSize?: number
} & T

type PaginationModel<T> = {
  pageNumber: number
  pageSize: number
  totalNumberOfPages: number
  totalNumberOfRecords: number
  results: T[]
  count?: number
}
