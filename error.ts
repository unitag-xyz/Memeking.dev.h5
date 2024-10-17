export class BaseError {}

export class ErrorDuplicateEVMAddresses extends BaseError {}

export const ERRORS = {
  151: ErrorDuplicateEVMAddresses,
} as {
  [key: number]: typeof BaseError
}
