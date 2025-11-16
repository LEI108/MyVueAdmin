// mock/salesRevenue.ts
import type { SalesRevenueItem } from '@/views/revenue/salesRevenue/utils/types'
import dayjs from 'dayjs'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

function randomNum(min: number, max: number, digits = 2) {
  return +(Math.random() * (max - min) + min).toFixed(digits)
}

function generateList(count: number): SalesRevenueItem[] {
  return Array.from({ length: count }).map((_, idx) => {
    const date = dayjs().subtract(idx, 'day').format('YYYY-MM-DD')
    const peakPrice = randomNum(1.0, 1.6, 3)
    const valleyPrice = randomNum(0.4, 0.9, 3)
    const flatPrice = randomNum(0.8, 1.3, 3)
    const averagePrice = +(((peakPrice + valleyPrice + flatPrice) / 3)).toFixed(3)

    const salesRevenue = randomNum(20000, 300000, 2)
    const subsidyRevenue = randomNum(0, 30000, 2)
    const totalRevenue = +(salesRevenue + subsidyRevenue).toFixed(2)
    const omCost = randomNum(5000, 60000, 2)
    const netProfit = +(totalRevenue - omCost).toFixed(2)

    return {
      id: idx + 1,
      date,
      peakPrice,
      valleyPrice,
      flatPrice,
      averagePrice,
      salesRevenue,
      subsidyRevenue,
      totalRevenue,
      omCost,
      netProfit,
    }
  })
}

const reportList = generateList(30)

export default defineFakeRoute([
  {
    url: '/api/salesRevenue',
    method: 'get',
    response: () => ({ success: true, data: reportList }),
  },
  {
    url: '/api/salesRevenue',
    method: 'post',
    response: ({ body }) => {
      const newItem = { ...(body as Omit<SalesRevenueItem, 'id'>), id: reportList.length + 1 }
      reportList.push(newItem)
      return { success: true, data: newItem }
    },
  },
  {
    url: '/api/salesRevenue/:id',
    method: 'put',
    response: ({ params, body }) => {
      const idx = reportList.findIndex(r => r.id === +params.id)
      if (idx > -1) {
        reportList[idx] = { ...reportList[idx], ...(body as Partial<SalesRevenueItem>) }
        return { success: true, data: reportList[idx] }
      }
      return { success: false }
    },
  },
  {
    url: '/api/salesRevenue/:id',
    method: 'delete',
    response: ({ params }) => {
      const idx = reportList.findIndex(r => r.id === +params.id)
      if (idx > -1) {
        const removed = reportList.splice(idx, 1)[0]
        return { success: true, data: removed }
      }
      return { success: false }
    },
  },
])
