// src/types/device.ts

/** 设备类型枚举 */
export type DeviceType = 'pv' | 'battery' | 'charger' | 'inverter'

/** 设备状态枚举 */
export type DeviceStatus = 'normal' | 'abnormal' | 'idle'

/** 设备信息接口 */
export interface DeviceInfo {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  lng: number // 经度
  lat: number // 纬度
  weather: {
    temperature: number // 温度（℃）
    humidity: number // 湿度（%）
  }
}

/** 温州市坐标范围（统一管理经纬度边界） */
export const bounds = {
  lngMin: 120.4,
  lngMax: 121.1,
  latMin: 27.6,
  latMax: 28.3,
}

/** 温州市坐标边界（西南角/东北角，用于地图限制） */
export const boundSW = [bounds.lngMin, bounds.latMin] as const // [120.4, 27.6]
export const boundNE = [bounds.lngMax, bounds.latMax] as const // [121.1, 28.3]

/** 温州市下属区域（用于生成设备名称） */
export const wenzhouDistricts = [
  '鹿城区',
  '龙湾区',
  '瓯海区',
  '洞头区',
  '瑞安市',
  '乐清市',
  '永嘉县',
  '平阳县',
  '苍南县',
  '文成县',
  '泰顺县',
] as const

/** 设备类型中文映射表 */
export const typeNameMap: Record<DeviceType, string> = {
  pv: '光伏板',
  battery: '储能电池',
  charger: '充电桩',
  inverter: '逆变器',
}
