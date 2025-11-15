import AlertIcon from '~icons/ri/alarm-warning-line'
import PowerIcon from '~icons/ri/flashlight-line'
import ProfitIcon from '~icons/ri/money-cny-box-line'
// src/views/home/data.ts
import SolarIcon from '~icons/ri/sun-line'
import { dayjs, generateLatestOpsData, getRandomIntBetween } from './utils'

/** 顶部4个指标卡数据 */
const chartData = [
  {
    icon: SolarIcon,
    bgColor: '#effaff',
    color: '#41b6ff',
    duration: 2000,
    name: '设备总数',
    value: 1200,
    percent: '+5%',
    data: Array.from({ length: 7 }, () => getRandomIntBetween(1000, 1250)),
  },
  {
    icon: PowerIcon,
    bgColor: '#fff5f4',
    color: '#e85f33',
    duration: 2000,
    name: '设备平均负荷',
    value: 65, // 百分比
    percent: '+2%',
    data: Array.from({ length: 7 }, () => getRandomIntBetween(60, 70)),
  },
  {
    icon: AlertIcon,
    bgColor: '#FFFCE8',
    color: '#F7BA1E',
    duration: 1500,
    name: '今日预警数',
    value: 15,
    percent: '-10%',
    data: Array.from({ length: 7 }, () => getRandomIntBetween(10, 20)),
  },
  {
    icon: ProfitIcon,
    bgColor: '#f6f4fe',
    color: '#7846e5',
    duration: 1200,
    name: '今日收益（元）',
    value: 3560,
    percent: '+8%',
    data: Array.from({ length: 7 }, () => getRandomIntBetween(3000, 3700)),
  },
]

/** 发电概览，包含 24 小时发电量与发电功率 */
const genOverviewData = {
  hours: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  power: Array.from({ length: 24 }, () => getRandomIntBetween(80, 200)), // 发电功率 kW
  energy: Array.from({ length: 24 }, () => getRandomIntBetween(200, 500)), // 发电量 kWh
}

/** 设备分布（各区域设备数量） */
const deviceDistData = [
  { name: '鹿城区', value: 320 },
  { name: '瓯海区', value: 280 },
  { name: '龙湾区', value: 260 },
  { name: '瑞安市', value: 180 },
  { name: '乐清市', value: 160 },
  { name: '永嘉县', value: 120 },
]

/** 最近操作动态（模拟） */
const latestOpsData = generateLatestOpsData(12)

export {
  chartData,
  deviceDistData,
  genOverviewData,
  latestOpsData,
}
