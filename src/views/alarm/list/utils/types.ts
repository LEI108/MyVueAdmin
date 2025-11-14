// 告警数据类型
export interface AlarmItem {
  id: number
  deviceCode: string // 设备编号
  deviceAddress: string // 设备地址
  faultDesc: string // 故障描述
  alarmTime: string // 告警时间（字符串，格式xxxx-xx-xx xx:xx:xx）
  alarmLevel: number // 告警级别（1=轻微, 2=中等, 3=严重）
  status: number // 处理状态（1=待指派, 2=处理中, 3=已完成）
}

// 表单类型（新增/编辑告警）
export interface FormItemProps {
  deviceCode: string
  deviceAddress: string
  faultDesc: string
  alarmTime: string
  alarmLevel: number
  status: number
}

export interface FormProps {
  formInline: FormItemProps
}

/** 第一步：被指派人员信息 */
export interface AssignStep1 {
  name: string
  phone: string
  jobNo: string
  urgent: boolean
  options: string[]
  remark: string
}

/** 第二步：审批部门信息 */
export interface AssignStep2 {
  approvalDept: string
  copyDept: string
}

/** 第三步：管理人员信息 */
export interface AssignStep3 {
  leaderName: string
  leaderPhone: string
}

/** 分步指派表单总类型 */
export interface AssignFormData {
  step1: AssignStep1
  step2: AssignStep2
  step3: AssignStep3
}
