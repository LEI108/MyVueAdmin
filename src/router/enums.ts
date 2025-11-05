// src/router/enums.ts
/**
 * 路由排序枚举 - 确保菜单项按正确顺序显示
 */
export const RouteRank = {
  HOME: 0,
  DASHBOARD: 10,

  // 光伏板管理
  SOLAR_PANEL_MANAGEMENT: 20,

  // 实时监控
  REALTIME_MONITORING: 30,

  // 数据分析
  DATA_REPORTS: 40,

  // 告警系统
  ALARM_MANAGEMENT: 50,

  // 运维管理
  MAINTENANCE_MANAGEMENT: 60,

  // 用户与权限
  USER_MANAGEMENT: 70,

} as const
