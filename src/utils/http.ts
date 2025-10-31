// src/utils/http.ts
import service from './axios'

interface ResponseData {
  code: number
  data: any
  message: string
}
// 封装GET方法
function get(url: string, params?: any): Promise<ResponseData> {
  return service.get(url, { params })
}

// 封装POST方法
function post(url: string, data?: any): Promise<ResponseData> {
  return service.post(url, data)
}

export { get, post }
