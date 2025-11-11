import { getRandomIntBetween } from './utils'

// 区域名称
const regions = ['鹿城', '龙湾', '瓯海', '洞头', '瑞安', '乐清', '永嘉', '平阳', '苍南', '文成', '泰顺']

// 横向柱状图数据（各区总产能）
const barHorizontalData = regions.map(r => ({
  name: r,
  value: getRandomIntBetween(500, 2500), // 单位：MWh
}))

// === 产能结构饼图（光伏相关类型占比） ===
const energyTypes = [
  '集中式光伏电站',
  '分布式屋顶光伏',
  '农光互补',
  '渔光互补',
  '工业园区光伏',
  '光伏储能一体化',
]

const pieData = energyTypes.map(t => ({
  name: t,
  value: getRandomIntBetween(500, 2500), // 单位：MWh
}))

// 各区产能构成（不同光伏类型堆叠）
const stackedBarData = regions.map(region => ({
  region,
  values: energyTypes.map(() => getRandomIntBetween(100, 1000)),
}))

// 四个季度趋势数据（2023-2025，每年都有 Q1-Q4）
const years = ['2023', '2024', '2025']
// === 生成三年季度数据 ===
const generationDataQuarter = {
  y2023: ['Q1', 'Q2', 'Q3', 'Q4'].map(() => regions.reduce(total => total + getRandomIntBetween(500, 2000), 0)),
  y2024: ['Q1', 'Q2', 'Q3', 'Q4'].map(() => regions.reduce(total => total + getRandomIntBetween(500, 2000), 0)),
  y2025: ['Q1', 'Q2', 'Q3', 'Q4'].map(() => regions.reduce(total => total + getRandomIntBetween(500, 2000), 0)),
}

// X轴标签
const xLabelsQuarter = {
  y2023: ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4'],
  y2024: ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'],
  y2025: ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4'],
}

export {
  barHorizontalData,
  energyTypes,
  generationDataQuarter,
  pieData,
  regions,
  stackedBarData,
  xLabelsQuarter,
  years,
}
