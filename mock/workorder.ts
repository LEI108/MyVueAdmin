// mock/workorder.ts
import type { WorkOrderItem } from '@/views/alarm/workorders/utils/types'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

// 工单类型枚举
const orderTypes: WorkOrderItem['orderType'][] = ['维修', '巡检', '安装', '其他']

// 工单来源枚举
const orderSources: string[] = ['系统生成', '人工录入', '告警转工单']

// 地点（示例温州市区域）
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

// 状态枚举：1待处理、2处理中、3已完成
const statusList: WorkOrderItem['status'][] = [1, 2, 3]

// 优先级枚举：1低、2中、3高
const priorityList: WorkOrderItem['priority'][] = [1, 2, 3]

// 模拟随机时间（最近 30 天）
function randomDate(): string {
  const now = new Date()
  const pastTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  return dayjs(pastTime).format('YYYY-MM-DD HH:mm:ss')
}

// 工单编号生成
function generateOrderCode(idx: number): string {
  return `WO${dayjs().format('YYYYMMDD')}${(1000 + idx).toString()}`
}

// 生成模拟工单数据
function generateWorkOrderData(count: number): WorkOrderItem[] {
  return Array.from({ length: count }).map((_, idx) => {
    const area = wenzhouAreas[Math.floor(Math.random() * wenzhouAreas.length)]
    const status = faker.helpers.arrayElement(statusList)
    return {
      id: idx + 1,
      orderCode: generateOrderCode(idx),
      orderTitle: faker.commerce.productName(), // 随机工单描述
      orderType: faker.helpers.arrayElement(orderTypes),
      orderSource: faker.helpers.arrayElement(orderSources),
      deviceCode: `DEV${faker.number.int({ min: 1000, max: 9999 })}`,
      deviceAddress: `温州市${area}${faker.location.streetAddress()}`,
      createTime: randomDate(),
      deadline: dayjs(faker.date.soon({ days: 15 })).format('YYYY-MM-DD HH:mm:ss'),
      status,
      priority: faker.helpers.arrayElement(priorityList),
      assignName: faker.person.fullName(),
      assignJobNo: `J${faker.number.int({ min: 10000, max: 99999 })}`,
      assignPhone: faker.phone.number('1##########'),
      finishTime: status === 3 ? randomDate() : '',
    }
  })
}

// 模拟存储的工单列表
const workOrderList: WorkOrderItem[] = generateWorkOrderData(15)

// 获取新的 ID
function getNextId() {
  return workOrderList.length ? Math.max(...workOrderList.map(o => o.id)) + 1 : 1
}

// Mock API 路由
export default defineFakeRoute([
  // 获取工单列表
  {
    url: '/api/workorders',
    method: 'get',
    response: () => ({
      success: true,
      data: workOrderList,
    }),
  },
  // 新增工单
  {
    url: '/api/workorders',
    method: 'post',
    response: ({ body }) => {
      const newOrder: WorkOrderItem = { ...(body as Omit<WorkOrderItem, 'id'>), id: getNextId() }
      workOrderList.push(newOrder)
      return { success: true, data: newOrder }
    },
  },
  // 查看单条工单详情
  {
    url: '/api/workorders/:id',
    method: 'get',
    response: ({ params }) => {
      const order = workOrderList.find(o => o.id === Number(params.id))
      if (order) {
        return { success: true, data: order }
      }
      return { success: false, message: '工单不存在' }
    },
  },
  // 编辑工单
  {
    url: '/api/workorders/:id',
    method: 'put',
    response: ({ body, params }) => {
      const index = workOrderList.findIndex(o => o.id === Number(params.id))
      if (index !== -1) {
        workOrderList[index] = { ...workOrderList[index], ...(body as Partial<WorkOrderItem>) }
        return { success: true, data: workOrderList[index] }
      }
      return { success: false, message: '未找到工单' }
    },
  },
  // 删除工单
  {
    url: '/api/workorders/:id',
    method: 'delete',
    response: ({ params }) => {
      const index = workOrderList.findIndex(o => o.id === Number(params.id))
      if (index !== -1) {
        const removed = workOrderList.splice(index, 1)[0]
        return { success: true, data: removed }
      }
      return { success: false, message: '未找到工单' }
    },
  },
])
