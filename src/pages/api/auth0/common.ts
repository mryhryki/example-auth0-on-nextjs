export type ApiSuccessResponse<T> = {
  success: true
  payload: T
}

export type ApiErrorResponse = {
  success: false
  error: unknown
}


export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
