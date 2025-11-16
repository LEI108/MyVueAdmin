// mock/stationRevenue.ts
import type { StationRevenueItem } from '@/views/revenue/stationRevenue/utils/types'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

function randomNum(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(2)
}

const stationCodes = ['CS001', 'CS002', 'CS003', 'CS004']
const stationNames = ['中心广场充电站', '海滨充电站', '科技园充电站', '南山充电站']
const stationAddresses = ['某市中心广场', '某市滨海大道', '某市科技园区', '某市南山区']
const statusList: StationRevenueItem['status'][] = [1, 2, 3] // 1=正常运营, 2=维护中, 3=暂停服务

function generateReports(count: number): StationRevenueItem[] {
  return Array.from({ length: count }).map((_, idx) => ({
    id: idx + 1,
    stationCode: stationCodes[Math.floor(Math.random() * stationCodes.length)],
    stationName: stationNames[Math.floor(Math.random() * stationNames.length)],
    stationAddress: stationAddresses[Math.floor(Math.random() * stationAddresses.length)],
    status: statusList[Math.floor(Math.random() * statusList.length)],
    chargerCount: Math.floor(Math.random() * 50) + 5,
    dailyRevenue: randomNum(500, 5000),
    monthlyRevenue: randomNum(20000, 150000),
    electricityRevenue: randomNum(10000, 100000),
    parkingRevenue: randomNum(500, 5000),
    serviceRevenue: randomNum(1000, 10000),
    otherRevenue: randomNum(0, 3000),
  }))
}

const reportList = generateReports(30)

export default defineFakeRoute([
  { url: '/api/stationRevenue', method: 'get', response: () => ({ success: true, data: reportList }) },
  { url: '/api/stationRevenue', method: 'post', response: ({ body }) => {
    const newReport = { ...(body as Omit<StationRevenueItem, 'id'>), id: reportList.length + 1 }
    reportList.push(newReport)
    return { success: true, data: newReport }
  } },
  { url: '/api/stationRevenue/:id', method: 'put', response: ({ params, body }) => {
    const idx = reportList.findIndex(r => r.id === +params.id)
    if (idx > -1) {
      reportList[idx] = { ...reportList[idx], ...(body as Partial<StationRevenueItem>) }
      return { success: true, data: reportList[idx] }
    }
    return { success: false }
  } },
  { url: '/api/stationRevenue/:id', method: 'delete', response: ({ params }) => {
    const idx = reportList.findIndex(r => r.id === +params.id)
    if (idx > -1) {
      const removed = reportList.splice(idx, 1)[0]
      return { success: true, data: removed }
    }
    return { success: false }
  } },
])
