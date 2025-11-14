/**
 * ------------------------------
 * 地图 & 设备类型定义文件
 * ------------------------------
 */
/** 温州市坐标边界（西南角/东北角，用于地图限制） */
export const boundSW = [bounds.lngMin, bounds.latMin] as const
export const boundNE = [bounds.lngMax, bounds.latMax] as const
/** 设备类型枚举（支持未来增加新类型） */
export type DeviceType = 'pv' | 'battery' | 'charger' | 'inverter'

/** 设备状态枚举 */
export type DeviceStatus = 'normal' | 'abnormal' | 'idle'

/** 设备天气信息 */
export interface DeviceWeather {
  temperature: number // 温度（℃）
  humidity: number // 湿度（百分比）
}

/** 设备信息接口 */
export interface DeviceInfo {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  lng: number // 经度
  lat: number // 纬度
  weather: DeviceWeather
  /** 可选：用于统计卡片的字段 */
  revenue?: number // 营收（万元）
  faultCount?: number // 故障次数
}

/** 地图统计卡片用的 UI 数据结构 */
export interface DeviceTypeStatsUI {
  type: DeviceType
  name: string
  icon: string
  color: string
  bgColor: string
  count: number
}

/** 地图统计信息接口（匹配 /get-map-stats 返回的数据结构） */
export interface MapStatsResponse {
  countByType: DeviceTypeStatsUI[]
  highestFaultArea: string
  highestRevenueArea: string
}
