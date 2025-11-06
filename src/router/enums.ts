/**
 * 路由排序枚举 - 确保菜单项按正确顺序显示
 */
export const RouteRank = {
  HOME: 0,

  // 1. 数据看板
  DASHBOARD: 10,

  // 2. 数据分析与报表
  DATA_ANALYSIS: 20,

  // 3. 设备运维管理
  DEVICE_MAINTENANCE: 30,

  // 4. 告警管理
  ALARM_MANAGEMENT: 40,

  // 5. 营收管理
  REVENUE_MANAGEMENT: 50,

  // 6. 用户与权限管理
  USER_AUTH_MANAGEMENT: 60,

  TEST: 100,
} as const
