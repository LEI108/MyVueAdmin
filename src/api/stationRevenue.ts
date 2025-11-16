import type { StationRevenueItem } from '@/views/revenue/stationRevenue/utils/types'
import { http } from '@/utils/http'

interface Result<T> {
  success: boolean
  data: T
}

export function getStationRevenueList() {
  return http.request<Result<StationRevenueItem[]>>('get', '/api/stationRevenue')
}

export function addStationRevenue(data: Omit<StationRevenueItem, 'id'>) {
  return http.request<Result<StationRevenueItem>>('post', '/api/stationRevenue', { data })
}

export function updateStationRevenue(id: number, data: Partial<StationRevenueItem>) {
  return http.request<Result<StationRevenueItem>>('put', `/api/stationRevenue/${id}`, { data })
}

export function deleteStationRevenue(id: number) {
  return http.request<Result<StationRevenueItem>>('delete', `/api/stationRevenue/${id}`)
}
