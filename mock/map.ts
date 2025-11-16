import type {
  DeviceInfo,
  DeviceStatus,
  DeviceType,
  DeviceTypeStatsUI,
  MapStatsResponse,
} from '@/types/map.ts'
import { faker } from '@faker-js/faker/locale/zh_CN'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import {
  bounds,
  typeNameMap,
  wenzhouDistricts,
} from '@/views/devices/map/data'

/** 内存设备列表，用于模拟持久化 */
let mockDeviceList: DeviceInfo[] = []

/**
 * 初始化 mock 数据
 */
function initMockDevices(count = 100) {
  const types: DeviceType[] = ['pv', 'battery', 'charger', 'inverter']
  const statuses: DeviceStatus[] = ['normal', 'abnormal', 'idle']

  const result: DeviceInfo[] = []
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(types)
    const status = faker.helpers.arrayElement(statuses)
    const district = faker.helpers.arrayElement(wenzhouDistricts)

    result.push({
      id: faker.string.uuid(),
      name: `温州市${district}${typeNameMap[type]}${faker.string.numeric({ length: 2 })}`,
      type,
      status,
      lng: faker.location.longitude({ min: bounds.lngMin, max: bounds.lngMax }),
      lat: faker.location.latitude({ min: bounds.latMin, max: bounds.latMax }),
      weather: {
        temperature: Number(faker.number.float({ min: 15, max: 35, fractionDigits: 1 })),
        humidity: faker.number.int({ min: 30, max: 90 }),
      },
      revenue: faker.number.int({ min: 50, max: 500 }),
      faultCount: faker.number.int({ min: 0, max: 20 }),
    })
  }
  mockDeviceList = result
}

initMockDevices()

/**
 * 生成统计信息
 */
function generateStatsData(devices: DeviceInfo[]) {
  const countByType: Record<DeviceType, number> = {
    pv: 0,
    battery: 0,
    charger: 0,
    inverter: 0,
  }

  devices.forEach((d) => {
    countByType[d.type]++
  })

  // 故障率最高区域
  const faultRateByArea: Record<string, { total: number, faults: number }> = {}
  devices.forEach((d) => {
    const area = wenzhouDistricts.find(dist => d.name.includes(dist))
    if (!area)
      return
    if (!faultRateByArea[area]) {
      faultRateByArea[area] = { total: 0, faults: 0 }
    }
    faultRateByArea[area].total++
    if (d.status === 'abnormal')
      faultRateByArea[area].faults++
  })

  const highestFaultArea = Object.entries(faultRateByArea)
    .map(([area, { total, faults }]) => ({
      area,
      rate: total ? faults / total : 0,
    }))
    .sort((a, b) => b.rate - a.rate)[0]
    ?.area || ''

  // 营收最高区域
  const revenueByArea: Record<string, number> = {}
  devices.forEach((d) => {
    const area = wenzhouDistricts.find(dist => d.name.includes(dist))
    if (!area)
      return
    revenueByArea[area] = (revenueByArea[area] || 0) + (d.revenue || 0)
  })
  const highestRevenueArea = Object.entries(revenueByArea)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || ''

  return {
    countByType,
    highestFaultArea,
    highestRevenueArea,
  }
}

/**
 * 转成 UI 渲染格式
 */
function convertCountByTypeUI(countByType: Record<DeviceType, number>): DeviceTypeStatsUI[] {
  const typeInfoMap: Record<DeviceType, Omit<DeviceTypeStatsUI, 'type' | 'count'>> = {
    pv: { name: '光伏板', icon: 'ph/solar-panel', color: '#ffb400', bgColor: '#fff8e1' },
    battery: { name: '储能电池', icon: 'ph/battery-charging-vertical', color: '#26ce83', bgColor: '#e6fff5' },
    charger: { name: '充电桩', icon: 'ph/charging-station', color: '#41b6ff', bgColor: '#effaff' },
    inverter: { name: '逆变器', icon: 'ph/computer-tower', color: '#e85f33', bgColor: '#fff5f4' },
  }

  return (Object.entries(countByType) as [DeviceType, number][])
    .map(([type, count]) => ({
      type,
      count,
      ...typeInfoMap[type],
    }))
}

export default defineFakeRoute([
  /** 获取地图设备数据 */
  {
    url: '/get-map-info',
    method: 'get',
    response: ({ query }) => {
      const type = query?.type as DeviceType | undefined
      const filteredDevices = type
        ? mockDeviceList.filter(d => d.type === type)
        : mockDeviceList
      return {
        success: true,
        data: filteredDevices,
      }
    },
  },

  /** 获取地图统计信息 */
  {
    url: '/get-map-stats',
    method: 'get',
    response: (): { success: boolean, data: MapStatsResponse } => {
      const statsData = generateStatsData(mockDeviceList)
      return {
        success: true,
        data: {
          countByType: convertCountByTypeUI(statsData.countByType),
          highestFaultArea: statsData.highestFaultArea,
          highestRevenueArea: statsData.highestRevenueArea,
        },
      }
    },
  },

  /** 创建新设备 */
  {
    url: '/create-map-device',
    method: 'post',
    response: ({ body }) => {
      const newDevice: DeviceInfo = {
        id: faker.string.uuid(),
        name: body.name,
        type: body.type as DeviceType,
        lng: body.lng,
        lat: body.lat,
        status: body.status || 'normal',
        weather: body.weather || {
          temperature: faker.number.int({ min: 15, max: 35 }),
          humidity: faker.number.int({ min: 30, max: 90 }),
        },
        revenue: faker.number.int({ min: 50, max: 500 }),
        faultCount: faker.number.int({ min: 0, max: 20 }),
      }
      mockDeviceList.push(newDevice)
      return {
        success: true,
        data: null,
      }
    },
  },
])
