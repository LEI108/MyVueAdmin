import type { DeviceInfo, MapStatsResponse } from '@/types/map'
import { http } from '@/utils/http'

interface Result<T> {
  success: boolean
  data: T
}

/** 获取地图设备数据 */
export function mapJson(params?: object) {
  return http.request<Result<DeviceInfo[]>>('get', '/get-map-info', { params })
}

/** 获取地图统计数据 */
export function mapStats() {
  return http.request<Result<MapStatsResponse>>('get', '/get-map-stats')
}

export function createMapDevice(payload: Omit<DeviceInfo, 'id'>) {
  return http.request<Result<null>>('post', '/create-map-device', {
    data: payload,
  })
}

/** 文件上传 */
export function formUpload(data) {
  return http.request<Result<null>>(
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
