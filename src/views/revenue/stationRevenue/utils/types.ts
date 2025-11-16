/** 电站营收数据结构 */
export interface StationRevenueItem {
  id: number
  stationCode: string // 充电站编号
  stationName: string // 充电站名称
  stationAddress: string // 充电站地址
  status: number // 运营状态: 1=正常运营, 2=维护中, 3=暂停服务
  chargerCount: number // 充电桩数量
  dailyRevenue: number // 单日收入
  monthlyRevenue: number // 月度收入
  electricityRevenue: number // 电费营收
  parkingRevenue: number // 停车费营收
  serviceRevenue: number // 服务费营收
  otherRevenue: number // 其他收入
}

/** 表单数据结构，用于新增和编辑 */
export interface FormItemProps {
  stationCode: string
  stationName: string
  stationAddress: string
  status: number
  chargerCount: number
  dailyRevenue: number
  monthlyRevenue: number
  electricityRevenue: number
  parkingRevenue: number
  serviceRevenue: number
  otherRevenue: number
}
