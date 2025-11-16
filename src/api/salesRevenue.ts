import type { SalesRevenueItem } from '@/views/revenue/salesRevenue/utils/types'
import { http } from '@/utils/http'

interface Result<T> {
  success: boolean
  data: T
}

export function getSalesRevenueList() {
  return http.request<Result<SalesRevenueItem[]>>('get', '/api/salesRevenue')
}

export function addSalesRevenue(data: Omit<SalesRevenueItem, 'id'>) {
  return http.request<Result<SalesRevenueItem>>('post', '/api/salesRevenue', { data })
}

export function updateSalesRevenue(id: number, data: Partial<SalesRevenueItem>) {
  return http.request<Result<SalesRevenueItem>>('put', `/api/salesRevenue/${id}`, { data })
}

export function deleteSalesRevenue(id: number) {
  return http.request<Result<SalesRevenueItem>>('delete', `/api/salesRevenue/${id}`)
}
