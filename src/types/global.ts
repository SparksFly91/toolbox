interface ApiResponse<T> {
  success: boolean
  code: number
  msg: string
  data: T
}

interface PageResult<T> {
  total: number
  list: T[]
  page: number
  page_size: number
}

export type { ApiResponse, PageResult }