import type { PowerReportItem } from '@/views/dashboard/report/utils/types.ts'
import dayjs from 'dayjs'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

function randomNum(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(2)
}

const stationCodes = ['ST001', 'ST002', 'ST003', 'ST004']
const statusList: PowerReportItem['status'][] = [1, 2]

function generateReports(count: number): PowerReportItem[] {
  return Array.from({ length: count }).map((_, idx) => ({
    id: idx + 1,
    date: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
    stationCode: stationCodes[Math.floor(Math.random() * stationCodes.length)],
    totalGeneration: randomNum(1000, 5000),
    gridGeneration: randomNum(800, 4500),
    selfUseGeneration: randomNum(50, 500),
    powerLoss: randomNum(10, 200),
    peakGeneration: randomNum(300, 1500),
    valleyGeneration: randomNum(300, 1500),
    flatGeneration: randomNum(300, 1500),
    efficiency: randomNum(80, 100),
    utilizationHours: randomNum(20, 24),
    status: statusList[Math.floor(Math.random() * statusList.length)],
  }))
}

const reportList = generateReports(30)

export default defineFakeRoute([
  { url: '/api/powerReports', method: 'get', response: () => ({ success: true, data: reportList }) },
  { url: '/api/powerReports', method: 'post', response: ({ body }) => {
    const newReport = { ...(body as Omit<PowerReportItem, 'id'>), id: reportList.length + 1 }
    reportList.push(newReport)
    return { success: true, data: newReport }
  } },
  { url: '/api/powerReports/:id', method: 'put', response: ({ params, body }) => {
    const idx = reportList.findIndex(r => r.id === +params.id)
    if (idx > -1) {
      reportList[idx] = { ...reportList[idx], ...(body as Partial<PowerReportItem>) }
      return { success: true, data: reportList[idx] }
    }
    return { success: false }
  } },
  { url: '/api/powerReports/:id', method: 'delete', response: ({ params }) => {
    const idx = reportList.findIndex(r => r.id === +params.id)
    if (idx > -1) {
      const removed = reportList.splice(idx, 1)[0]
      return { success: true, data: removed }
    }
    return { success: false }
  } },
])
