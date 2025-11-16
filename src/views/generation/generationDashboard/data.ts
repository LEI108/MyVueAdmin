import { cloneDeep } from '@pureadmin/utils'
import PhBatteryChargingVertical from '~icons/ph/battery-charging-vertical'
import PhClover from '~icons/ph/clover'
import PhLeaf from '~icons/ph/leaf'
import CheckLine from '~icons/ri/chat-check-line'
import Question from '~icons/ri/question-answer-line'
import { dayjs, getRandomIntBetween } from './utils'

// 日周月发电量（kWh）
const generationData = {
  day: Array.from({ length: 24 }).map(() => getRandomIntBetween(200, 800)),
  week: Array.from({ length: 7 }).map(() => getRandomIntBetween(5000, 9000)),
  month: Array.from({ length: 30 }).map(() => getRandomIntBetween(5000, 12000)),
}

// X 轴标签
const xLabels = {
  day: Array.from({ length: 24 }).map((_, i) => `${i}h`),
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  month: Array.from({ length: 30 }).map((_, i) => `${i + 1}日`),
}

// 24小时实时功率（MW）
const realTimePowerData = Array.from({ length: 24 }).map(() =>
  getRandomIntBetween(50, 260),
)

// 累计发电量
const totalGeneration = 520000
const expectedGeneration = 600000
const generationPercent = ((totalGeneration / expectedGeneration) * 100).toFixed(2)
const totalGenerationData = [
  {
    icon: PhBatteryChargingVertical,
    bgColor: '#effaff',
    color: '#41b6ff',
    duration: 2200,
    name: '当前发电量 (MWh)',
    value: 571.86,
    percent: '+88%',
    data: [2101, 5288, 4239, 4962, 6752, 5208, 7450], // 平滑折线图数据
  },
  {
    icon: PhBatteryChargingVertical,
    bgColor: '#fff5f4',
    color: '#e85f33',
    duration: 1600,
    name: '预计发电量 (MWh)',
    value: 49.08,
    percent: '+70%',
    data: [2216, 1148, 1255, 788, 4821, 1973, 4379],
  },
]

// 设备负荷
const equipmentLoadData = [
  { name: '设备1', value: getRandomIntBetween(60, 95) },
  { name: '设备2', value: getRandomIntBetween(50, 88) },
  { name: '设备3', value: getRandomIntBetween(65, 92) },
  { name: '设备5', value: getRandomIntBetween(40, 75) },
  { name: '设备6', value: getRandomIntBetween(40, 75) },
  { name: '设备7', value: getRandomIntBetween(40, 75) },
  { name: '设备8', value: getRandomIntBetween(40, 75) },
]

// 碳排分析数据
const carbonAnalysisData = [
  {
    icon: PhLeaf,
    bgColor: '#effaff',
    color: '#41b6ff',
    duration: 2200,
    name: 'CO₂减排量 (吨)',
    value: 571.86,
    percent: '+88%',
    data: [2101, 5288, 4239, 4962, 6752, 5208, 7450], // 平滑折线图数据
  },
  {
    icon: PhClover,
    bgColor: '#fff5f4',
    color: '#e85f33',
    duration: 1600,
    name: 'SO₂减排量 (吨)',
    value: 49.08,
    percent: '+70%',
    data: [2216, 1148, 1255, 788, 4821, 1973, 4379],
  },
  {
    icon: PhLeaf,
    bgColor: '#eff8f4',
    color: '#26ce83',
    duration: 1500,
    name: '碳积分',
    value: 729,
    percent: '+99%',
    data: [861, 1002, 3195, 1715, 3666, 2415, 3645],
  },
]

export {
  carbonAnalysisData,
  equipmentLoadData,
  generationData,
  generationPercent,
  realTimePowerData,
  totalGenerationData,
  xLabels,
}
