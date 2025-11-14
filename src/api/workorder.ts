import type { WorkOrderFormData, WorkOrderItem } from '@/views/alarm/workorders/utils/types'
import { http } from '@/utils/http'

/** 获取工单列表 */
export function getWorkOrderList() {
  return http.request<WorkOrderItem[]>('get', '/mock/workorder/list')
}

/** 新增工单 */
export function addWorkOrder(data: WorkOrderFormData) {
  return http.request('post', '/mock/workorder/add', { data })
}

/** 更新工单 */
export function updateWorkOrder(id: string, data: Partial<WorkOrderFormData>) {
  return http.request('put', `/mock/workorder/update/${id}`, { data })
}

/** 删除工单 */
export function deleteWorkOrder(id: string) {
  return http.request('delete', `/mock/workorder/delete/${id}`)
}

/** 指派工单 */
export function assignWorkOrder(id: string, formData: any) {
  return http.request('post', `/mock/workorder/assign/${id}`, { data: formData })
}
