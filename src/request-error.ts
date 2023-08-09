export type RequestError = {
  name: string
  status: number
  documentation_url: string
  errors?: {
    resource: string
    code: string
    field: string
    message?: string
  }[]
}
