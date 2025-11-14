// 充电桩状态枚举（语义化命名，避免硬编码数字）
export enum ChargerStatus {
  IDLE = 1, // 空闲中
  CHARGING = 2, // 充电中
  CONNECTING = 3, // 连接中
  QUEUING = 4, // 排队中
  RESERVED = 5, // 已预约
  FAULT = 6, // 故障/离线
}

// 充电桩使用记录
export interface ChargerRecord {
  time: string // 时间格式："HH:mm:ss"
  msg: string // 记录描述
}

// 充电桩详细信息
export interface Charger {
  id: string // 设备ID，如"CD1001"
  voltage: string // 电压，如"314v"
  current: string // 电流，如"212.2A"
  power: string // 功率，如"21KW"
  tem: string // 温度，如"32°c"
  status: ChargerStatus // 状态（强类型枚举）
  percent?: string // 充电百分比，仅状态为CHARGING时存在
  record?: ChargerRecord[] // 使用记录，可选
}

// 充电站信息
export interface ChargingStation {
  id: string // 充电站ID，如"VXZ10001"
  name: string // 充电站名称，如"温州市鹿城区充电站"
  list: Charger[] // 该充电站下的充电桩列表
}

// 状态筛选配置（用于单选按钮组）
export interface StatusFilter {
  label: string // 显示文本，如"空闲中(5)"
  value: ChargerStatus | 0 // 0表示全部
  icon?: string // 可选图标，增强视觉区分
  color?: string // 状态文本颜色
}
