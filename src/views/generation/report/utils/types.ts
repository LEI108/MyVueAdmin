export interface PowerReportItem {
  id: number
  date: string // 日期 (YYYY-MM-DD)
  stationCode: string // 电站编号
  totalGeneration: number // 总发电量 (kWh)
  gridGeneration: number // 并网发电量 (kWh)
  selfUseGeneration: number // 自用电量 (kWh)
  powerLoss: number // 电量损耗 (kWh)
  peakGeneration: number // 峰段电量 (kWh)
  valleyGeneration: number // 谷段电量 (kWh)
  flatGeneration: number // 平段电量 (kWh)
  efficiency: number // 设备运行效率 (%)
  utilizationHours: number // 设备利用率 (小时)
  status: number // 状态: 1=正常, 2=异常
}

// 用于新增/编辑报表表单
export interface FormItemProps {
  date: string
  stationCode: string
  totalGeneration: number
  gridGeneration: number
  selfUseGeneration: number
  powerLoss: number
  peakGeneration: number
  valleyGeneration: number
  flatGeneration: number
  efficiency: number
  utilizationHours: number
  status: number
}
