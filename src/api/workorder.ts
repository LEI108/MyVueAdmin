import type { WorkOrderItem } from '@/views/alarm/workorders/utils/types'
import { http } from '@/utils/http'

interface Result<T> {
  success: boolean
  data: T
}

export function getWorkOrderList() {
  return http.request<Result<WorkOrderItem[]>>('get', '/api/workorders')
}

/** 新增工单 */
export function addWorkOrder(data: Omit<WorkOrderItem, 'id' | 'workOrderCode'>) {
  return http.request<Result<WorkOrderItem>>('post', '/api/workorders', { data })
}

export function updateWorkOrder(id: number, data: Partial<WorkOrderItem>) {
  return http.request<Result<WorkOrderItem>>('put', `/api/workorders/${id}`, { data })
}

export function deleteWorkOrder(id: number) {
  return http.request<Result<WorkOrderItem>>('delete', `/api/workorders/${id}`)
}

/** 同步告警状态 */
export function updateAlarmStatus(deviceCode: string, status: number) {
  return http.request<Result<any>>('post', `/api/alarms/status/update`, { data: { deviceCode, status } })
}
