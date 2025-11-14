/** 工单项数据结构 */
export interface WorkOrderItem {
  id: string // 工单 ID
  orderCode: string // 工单编号
  orderTitle: string // 工单描述
  orderType: string | number// 工单类型（维修、巡检、安装、其他）
  orderSource: string // 工单来源（系统生成、人工录入、告警转工单等）
  deviceCode: string // 设备编号
  deviceAddress: string // 设备地点
  createTime: string // 创建时间
  deadline: string // 要求完成时间
  status: number // 处理状态：1待处理、2处理中、3已完成
  priority: number // 优先级：高(3)、中(2)、低(1)
  assignName?: string // 指派人姓名
  assignJobNo?: string // 指派人工号
  assignPhone?: string // 指派人电话
  finishTime?: string // 完成时间（已完成时）
}

/** 用于新增/修改工单的表单数据结构 */
export interface WorkOrderFormData {
  orderCode: string
  orderTitle: string
  orderType: string | number
  orderSource: string
  deviceCode: string
  deviceAddress: string
  deadline: string
  priority: number
}

/** 工单状态值类型 */
export type WorkOrderStatus = 1 | 2 | 3
/** 优先级值类型 */
export type PriorityLevel = 1 | 2 | 3
