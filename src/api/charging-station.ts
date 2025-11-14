import type { Charger, ChargingStation } from '@/types/charging-station'
import { http } from '@/utils/http'

// 接口返回统一封装
interface Result<T> {
  success: boolean
  data: T
}

/**
 * 获取所有充电站及充电桩信息
 */
export function getChargingStations() {
  return http.request<Result<ChargingStation[]>>('get', '/api/charging-stations')
}

/**
 * 获取单个充电桩详情（预留接口）
 */
export function getChargerDetail(id: string) {
  return http.request<Result<Charger>>('get', `/api/chargers/${id}`)
}
