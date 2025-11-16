/** 售电营收数据结构 */
export interface SalesRevenueItem {
  id: number
  date: string // 日期 YYYY-MM-DD
  peakPrice: number // 峰段电价
  valleyPrice: number // 谷段电价
  flatPrice: number // 平段电价
  averagePrice: number // 平均电价
  salesRevenue: number // 售电收入
  subsidyRevenue: number // 补贴收入
  totalRevenue: number // 总营收
  omCost: number // 运维成本
  netProfit: number // 净利润
}

/** 表单数据结构，用于新增和编辑 */
export interface FormItemProps {
  date: string
  peakPrice: number
  valleyPrice: number
  flatPrice: number
  averagePrice: number
  salesRevenue: number
  subsidyRevenue: number
  totalRevenue: number
  omCost: number
  netProfit: number
}
