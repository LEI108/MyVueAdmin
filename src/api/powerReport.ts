// src/api/powerReport.ts
import type { PowerReportItem } from '@/views/powerReport/utils/types'
import { http } from '@/utils/http'

interface Result<T> {
  success: boolean
  data: T
}

export function getPowerReportList() {
  return http.request<Result<PowerReportItem[]>>('get', '/api/powerReports')
}

export function addPowerReport(data: Omit<PowerReportItem, 'id'>) {
  return http.request<Result<PowerReportItem>>('post', '/api/powerReports', { data })
}

export function updatePowerReport(id: number, data: Partial<PowerReportItem>) {
  return http.request<Result<PowerReportItem>>('put', `/api/powerReports/${id}`, { data })
}

export function deletePowerReport(id: number) {
  return http.request<Result<PowerReportItem>>('delete', `/api/powerReports/${id}`)
}
