import { http } from '@/utils/http'

interface Result {
  success: boolean
  data: Array<any>
}

/** 获取地图设备数据 */
export function mapJson(params?: object) {
  return http.request<Result>('get', '/get-map-info', { params })
}

/** 文件上传 */
export function formUpload(data) {
  return http.request<Result>(
    'post',
    'https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b',
    { data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
