// 工单数据类型
export interface WorkOrderItem {
  id: number // 工单ID
  workOrderCode: string // 工单编号
  assignee: string // 指派人员姓名
  assigneePhone: string // 指派人员电话
  assigneeJobNo: string // 指派人员工号
  description: string // 工单描述
  type: string // 工单类型
  deviceCode: string // 设备编号
  deviceAddress: string // 设备地点
  createTime: string // 创建时间
  deadline: string // 截止时间
  status: number // 处理状态（1待处理 2处理中 3已完成）
  priority: number // 优先级（1高 2中 3低）
  manager: string // 管理人姓名
  finishTime?: string // 完成时间
}

// 表单类型（新增/编辑工单）
export interface WorkOrderFormProps {
  formInline: WorkOrderItem
}
