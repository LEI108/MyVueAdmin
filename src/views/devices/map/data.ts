import type {
  DeviceType,
} from '@/types/map.ts'

/** 温州市坐标范围（统一管理经纬度边界） */
export const bounds = {
  lngMin: 120.4,
  lngMax: 121.1,
  latMin: 27.6,
  latMax: 28.3,
}
/** 温州市坐标边界（西南角/东北角，用于地图限制） */
export const boundSW = [bounds.lngMin, bounds.latMin] as const
export const boundNE = [bounds.lngMax, bounds.latMax] as const
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

/** 设备类型中文映射表（用于弹窗和统计显示） */
export const typeNameMap: Record<DeviceType, string> = {
  pv: '光伏板',
  battery: '储能电池',
  charger: '充电桩',
  inverter: '逆变器',
}
