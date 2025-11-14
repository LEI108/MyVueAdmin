import type { WorkOrderItem } from '@/views/alarm/workorders/utils/types'
import dayjs from 'dayjs'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

const workOrderList: WorkOrderItem[] = []

function generateWorkOrderCode() {
  return `WO${Math.floor(100000 + Math.random() * 900000)}`
}

export default defineFakeRoute([
  {
    url: '/api/workorders',
    method: 'get',
    response: () => ({ success: true, data: workOrderList }),
  },
  {
    url: '/api/workorders',
    method: 'post',
    response: ({ body }) => {
      const now = dayjs()
      const newItem: WorkOrderItem = {
        ...(body as Omit<WorkOrderItem, 'id' | 'workOrderCode' | 'createTime'>),
        id: workOrderList.length + 1,
        workOrderCode: generateWorkOrderCode(),
        createTime: now.format('YYYY-MM-DD HH:mm:ss'), // 指派提交时间
        deadline: now.add(Math.floor(Math.random() * 5) + 3, 'day').format('YYYY-MM-DD HH:mm:ss'), // 随机未来时间
        finishTime: '', // 默认空
      }
      workOrderList.push(newItem)
      return { success: true, data: newItem }
    },
  },
  {
    url: '/api/workorders/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = workOrderList.findIndex(i => i.id === +params.id)
      if (index > -1) {
        const { createTime, ...rest } = body as Partial<WorkOrderItem> // 排除 createTime
        workOrderList[index] = { ...workOrderList[index], ...rest }
        return { success: true, data: workOrderList[index] }
      }
      return { success: false, message: '未找到工单' }
    },
  },
  {
    url: '/api/workorders/:id',
    method: 'delete',
    response: ({ params }) => {
      const index = workOrderList.findIndex(i => i.id === +params.id)
      if (index > -1) {
        const removed = workOrderList.splice(index, 1)[0]
        return { success: true, data: removed }
      }
      return { success: false }
    },
  },
])
