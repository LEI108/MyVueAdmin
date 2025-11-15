import type { AlarmItem } from '@/views/alarm/list/utils/types'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

// 温州市区域列表
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

// 告警级别枚举
const alarmLevels: AlarmItem['alarmLevel'][] = [1, 2, 3] // 1=轻微, 2=中等, 3=严重
// 处理状态枚举
const statusList: AlarmItem['status'][] = [1, 2, 3] // 1=待指派, 2=处理中, 3=处理完毕

// 模拟告警描述
const faultDescs = [
  '充电枪故障',
  '电流异常',
  '过压保护',
  '欠压保护',
  '温度过高',
  '模块通信失败',
  '漏电保护触发',
]

// 模拟随机时间（yyyy-MM-dd HH:mm:ss）
function randomDate() {
  const now = new Date()
  const past = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 最近30天
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${past.getFullYear()}-${pad(past.getMonth() + 1)}-${pad(past.getDate())} ${pad(past.getHours())}:${pad(past.getMinutes())}:${pad(past.getSeconds())}`
}

// 设备编号生成
function generateDeviceCode(idx: number) {
  return `CD${1000 + idx}`
}

// 生成模拟告警数据
function generateAlarmData(count: number): AlarmItem[] {
  return Array.from({ length: count }).map((_, idx) => {
    const area = wenzhouAreas[Math.floor(Math.random() * wenzhouAreas.length)]
    return {
      id: idx + 1,
      deviceCode: generateDeviceCode(idx),
      deviceAddress: `温州市${area}`,
      faultDesc: faultDescs[Math.floor(Math.random() * faultDescs.length)],
      alarmTime: randomDate(),
      alarmLevel: alarmLevels[Math.floor(Math.random() * alarmLevels.length)],
      status: statusList[Math.floor(Math.random() * statusList.length)],
    }
  })
}

// 模拟存储的告警列表
const alarmList: AlarmItem[] = generateAlarmData(30) // 生成15条记录

// 获取新的 ID
function getNextId() {
  return alarmList.length ? Math.max(...alarmList.map(a => a.id)) + 1 : 1
}

// Mock API
export default defineFakeRoute([
  {
    url: '/api/alarms',
    method: 'get',
    response: () => ({
      success: true,
      data: alarmList,
    }),
  },
  {
    url: '/api/alarms',
    method: 'post',
    response: ({ body }) => {
      const newAlarm: AlarmItem = { ...(body as Omit<AlarmItem, 'id'>), id: getNextId() }
      alarmList.push(newAlarm)
      return { success: true, data: newAlarm }
    },
  },
  {
    url: '/api/alarms/:id',
    method: 'put',
    response: ({ body, params }) => {
      const index = alarmList.findIndex(a => a.id === Number(params.id))
      if (index !== -1) {
        alarmList[index] = { ...alarmList[index], ...(body as Partial<AlarmItem>) }
        return { success: true, data: alarmList[index] }
      }
      return { success: false, message: '未找到告警信息' }
    },
  },
  {
    url: '/api/alarms/:id',
    method: 'delete',
    response: ({ params }) => {
      const index = alarmList.findIndex(a => a.id === Number(params.id))
      if (index !== -1) {
        const removed = alarmList.splice(index, 1)[0]
        return { success: true, data: removed }
      }
      return { success: false, message: '未找到告警信息' }
    },
  },
  {
    url: '/api/alarms/:id/assign',
    method: 'post',
    response: ({ params, body }) => {
      const index = alarmList.findIndex(a => a.id === Number(params.id))
      if (index !== -1) {
      // 模拟保存指派信息到告警记录
        (alarmList[index] as any).assignInfo = body;
        (alarmList[index] as any).status = 2 // 状态切换成"处理中"
        return { success: true, data: alarmList[index] }
      }
      return { success: false, message: '告警不存在' }
    },
  },
])
