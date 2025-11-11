import type {
  DeviceInfo,
  DeviceStatus,
  DeviceType,
} from '@/types/device'
import { faker } from '@faker-js/faker/locale/zh_CN'

import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import {
  bounds,
  typeNameMap,
  wenzhouDistricts,
} from '@/types/device'

/**
 * 随机生成设备列表
 */
function generateDeviceList(count = 100): DeviceInfo[] {
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
      lng: faker.location.longitude({ min: bounds.lngMin, max: bounds.lngMax }), // ★经度
      lat: faker.location.latitude({ min: bounds.latMin, max: bounds.latMax }), // ★纬度
      weather: {
        temperature: Number(faker.number.float({ min: 15, max: 35, fractionDigits: 1 })), // 一位小数
        humidity: faker.number.int({ min: 30, max: 90 }),
      },
    })
  }

  return result
}

/**
 * 定义 mock 路由
 */
export default defineFakeRoute([
  {
    url: '/get-map-info',
    method: 'get',
    response: () => {
      return {
        success: true,
        data: generateDeviceList(100),
      }
    },
  },
])
