import type { AlarmItem, AssignFormData } from '@/views/alarm/list/utils/types'
import { http } from '@/utils/http'

interface Result<T> {
  success: boolean
  data: T
}

/** 获取告警列表 */
export function getAlarmList() {
  return http.request<Result<AlarmItem[]>>('get', '/api/alarms')
}

/** 新增告警 */
export function addAlarm(data: Omit<AlarmItem, 'id'>) {
  return http.request<Result<AlarmItem>>('post', '/api/alarms', { data })
}

/** 修改告警 */
export function updateAlarm(id: number, data: Partial<AlarmItem>) {
  return http.request<Result<AlarmItem>>('put', `/api/alarms/${id}`, { data })
}

/** 删除告警 */
export function deleteAlarm(id: number) {
  return http.request<Result<AlarmItem>>('delete', `/api/alarms/${id}`)
}

/** 告警指派 */
export function assignAlarm(id: number, data: AssignFormData) {
  return http.request<Result<any>>('post', `/api/alarms/${id}/assign`, { data })
}
