import dayjs from 'dayjs'

export { cloneDeep, randomGradient, useDark } from '@pureadmin/utils'
export { default as dayjs } from 'dayjs'

export function getRandomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface LatestOpItem {
  date: string // 例：2025-11-15 周六
  content: string // 例：维修员张三维修鹿城区设备#A102
}

interface GenerateOpsOptions {
  includeToday?: boolean // 是否包含今天（默认 true）
}

/** 生成中文周几 */
function getWeekCN(d: dayjs.Dayjs): string {
  const w = d.day() // 0-周日, 1-周一, ..., 6-周六
  const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return map[w]
}

/** 简单随机工具 */
function randInt(min: number, max: number): number {
  // [min, max] 闭区间整数
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

/** 设备编号生成，如：#A102、#PV305 */
function genDeviceId(): string {
  const prefixes = ['A', 'B', 'C', 'M', 'PV', 'CH']
  const prefix = pick(prefixes)
  const num = randInt(101, 999) // 3位数更真实一些
  return `#${prefix}${num}`
}

/** 工单号生成，如：#WO-3421 */
function genWorkOrderId(): string {
  return `#WO-${randInt(1000, 9999)}`
}

export function generateLatestOpsData(
  count = 10,
  options: GenerateOpsOptions = { includeToday: true },
): LatestOpItem[] {
  const includeToday = options.includeToday ?? true

  const people = [
    { role: '维修员', name: '张三' },
    { role: '管理员', name: '李四' },
    { role: '安装员', name: '王五' },
    { role: '检测员', name: '赵六' },
    { role: '运维员', name: '钱七' },
    { role: '技术员', name: '孙八' },
    { role: '巡检员', name: '周九' },
  ]
  const regions = [
    '鹿城区',
    '瓯海区',
    '瑞安市',
    '乐清市',
    '永嘉县',
    '平阳县',
    '洞头区',
    '苍南县',
  ]
  const anomalyTypes = ['电流异常', '功率异常', '温度异常', '通讯中断', '电压异常']

  const items: LatestOpItem[] = []
  for (let i = 0; i < count; i++) {
    // 是否从今天开始
    const dayOffset = includeToday ? i : i + 1
    const d = dayjs().subtract(dayOffset, 'day')
    const dateStr = `${d.format('YYYY-MM-DD')} ${getWeekCN(d)}`

    // 随机生成内容
    const region = pick(regions)
    const person = pick(people)
    const deviceId = genDeviceId()
    const workOrderId = genWorkOrderId()

    // 20%-30% 的概率生成“系统自动”类内容
    const useSystem = Math.random() < 0.3

    let content = ''
    if (useSystem) {
      const anomaly = pick(anomalyTypes)
      const sysTemplates = [
        `系统自动发送预警通知（${anomaly}）`,
        `系统自动生成工单${workOrderId}（${region}设备${deviceId}）`,
      ]
      content = pick(sysTemplates)
    }
    else {
      const actionTemplates = [
        `${person.role}${person.name}维修${region}设备${deviceId}`,
        `${person.role}${person.name}对${region}设备${deviceId}进行年度检修`,
        `${person.role}${person.name}安装${region}屋顶新能源板${deviceId}`,
        `${person.role}${person.name}更换${region}充电站模块${deviceId}`,
        `${person.role}${person.name}调整预警阈值（${pick(anomalyTypes)}上限）`,
        `${person.role}${person.name}审批${region}工单${workOrderId}`,
      ]
      content = pick(actionTemplates)
    }

    items.push({ date: dateStr, content })
  }

  return items
}
