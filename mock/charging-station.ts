import type { ChargingStation } from '@/types/charging-station'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

// 温州市区域列表（与地图模块统一）
const wenzhouAreas = [
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
]

// 生成模拟充电站数据
function generateChargingStations(): ChargingStation[] {
  return wenzhouAreas.map((area, index) => ({
    id: `WZ-${index + 1000}`,
    name: `温州市${area}充电站`,
    list: generateChargers(12 + Math.floor(Math.random() * 8)), // 每个站12-20个充电桩
  }))
}

// 生成单个充电桩数据
function generateChargers(count: number) {
  const statuses = [1, 2, 3, 4, 5, 6] as const // 状态枚举值
  return Array.from({ length: count }).map((_, i) => ({
    id: `CD${1000 + i}`,
    voltage: `${310 + Math.floor(Math.random() * 10)}v`,
    current: `${(210 + Math.random() * 5).toFixed(1)}A`,
    power: `${20 + Math.floor(Math.random() * 10)}KW`,
    tem: `${25 + Math.floor(Math.random() * 15)}°c`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    percent: Math.random() > 0.5 ? `${Math.floor(Math.random() * 100)}%` : undefined,
    record: Math.random() > 0.3 ? generateRecords() : undefined,
  }))
}

// 生成使用记录
function generateRecords() {
  return Array.from({ length: 3 + Math.floor(Math.random() * 4) }).map(() => ({
    time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    msg: `充电${50 + Math.floor(Math.random() * 150)}度，消费${50 + Math.floor(Math.random() * 150)}元`,
  }))
}

// Mock路由定义
export default defineFakeRoute([
  {
    url: '/api/charging-stations',
    method: 'get',
    response: () => ({
      success: true,
      data: generateChargingStations(),
    }),
  },
])
