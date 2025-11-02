// mock/asyncRoutes.ts

import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import {
  RouteRank,
} from '@/router/enums'

/**
 * roles：页面级别权限，这里模拟两种角色：
 * admin：管理员角色
 * common：普通角色
 */

// 仪表盘 (Dashboard)
const dashboardRouter = {
  path: '/dashboard',
  meta: {
    icon: 'ph/chart-bar',
    title: 'menus.dashboard',
    rank: RouteRank.DASHBOARD,
  },
  children: [
    {
      path: '/dashboard/overview',
      name: 'DashboardOverview',
      meta: {
        title: 'menus.overview',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/dashboard/realtime',
      name: 'DashboardRealtime',
      meta: {
        title: 'menus.realtime',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/dashboard/trends',
      name: 'DashboardTrends',
      meta: {
        title: 'menus.trends',
        roles: ['admin', 'common'],
      },
    },
  ],
}

// 告警管理 (Alerts)
const alarmRouter = {
  path: '/alerts',
  meta: {
    icon: 'ph/bell-ringing',
    title: 'menus.alerts',
    rank: RouteRank.ALARM_MANAGEMENT,
  },
  children: [
    {
      path: '/alerts/list',
      name: 'AlertList',
      meta: {
        title: 'menus.list',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/alerts/rules',
      name: 'AlertRules',
      meta: {
        title: 'menus.rules',
        roles: ['admin'],
      },
    },
    {
      path: '/alerts/records',
      name: 'AlertRecords',
      meta: {
        title: 'menus.records',
        roles: ['admin', 'common'],
      },
    },
  ],
}

// 维护管理 (Maintenance)
const maintenanceRouter = {
  path: '/maintenance',
  meta: {
    icon: 'ph/toolbox',
    title: 'menus.maintenance',
    rank: RouteRank.MAINTENANCE_MANAGEMENT,
  },
  children: [
    {
      path: '/maintenance/records',
      name: 'MaintenanceRecords',
      meta: {
        title: 'menus.records',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/maintenance/work-orders',
      name: 'WorkOrders',
      meta: {
        title: 'menus.workOrders',
        roles: ['admin'],
      },
    },
    {
      path: '/maintenance/inventory',
      name: 'Inventory',
      meta: {
        title: 'menus.inventory',
        roles: ['admin', 'common'],
      },
    },
  ],
}

// 实时监控 (Monitoring)
const monitoringRouter = {
  path: '/monitoring',
  meta: {
    icon: 'VideoCamera',
    title: 'menus.monitoring',
    rank: RouteRank.REALTIME_MONITORING,
  },
  children: [
    {
      path: '/monitoring/single',
      name: 'SingleMonitor',
      meta: {
        title: 'menus.single',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/monitoring/compare',
      name: 'MultiMonitor',
      meta: {
        title: 'menus.multi',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/monitoring/history',
      name: 'HistoryPlayback',
      meta: {
        title: 'menus.history',
        roles: ['admin'],
      },
    },
  ],
}

// 光伏面板管理 (Panels)
const panelsRouter = {
  path: '/panels',
  meta: {
    icon: 'PhChartBar',
    title: 'menus.panels',
    rank: RouteRank.SOLAR_PANEL_MANAGEMENT,
  },
  children: [
    {
      path: '/panels/list',
      name: 'PanelList',
      meta: {
        title: 'menus.list',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/panels/map',
      name: 'PanelMap',
      meta: {
        title: 'menus.map',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/panels/status',
      name: 'PanelStatus',
      meta: {
        title: 'menus.status',
        roles: ['admin'],
      },
    },
  ],
}

// 报表管理 (Reports)
const reportsRouter = {
  path: '/reports',
  meta: {
    icon: 'Document',
    title: 'menus.reports',
    rank: RouteRank.DATA_REPORTS,
  },
  children: [
    {
      path: '/reports/daily',
      name: 'DailyReport',
      meta: {
        title: 'menus.daily',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/reports/monthly',
      name: 'MonthlyReport',
      meta: {
        title: 'menus.monthly',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/reports/yearly',
      name: 'YearlyReport',
      meta: {
        title: 'menus.yearly',
        roles: ['admin'],
      },
    },
    {
      path: '/reports/export',
      name: 'DataExport',
      meta: {
        title: 'menus.export',
        roles: ['admin'],
      },
    },
  ],
}

// 用户管理 (User Management)
const userRouter = {
  path: '/user',
  meta: {
    icon: 'User',
    title: 'menus.user',
    rank: RouteRank.USER_MANAGEMENT,
  },
  children: [
    {
      path: '/user/list',
      name: 'UserList',
      meta: {
        title: 'menus.list',
        roles: ['admin', 'common'],
      },
    },
    {
      path: '/user/roles',
      name: 'RoleManagement',
      meta: {
        title: 'menus.roles',
        roles: ['admin'],
      },
    },
    {
      path: '/user/permissions',
      name: 'PermissionConfig',
      meta: {
        title: 'menus.permissions',
        roles: ['admin'],
      },
    },
  ],
}

// 定义异步路由返回
export default defineFakeRoute([
  {
    url: '/get-async-routes',
    method: 'get',
    response: () => {
      return {
        success: true,
        data: [
          dashboardRouter,
          alarmRouter,
          maintenanceRouter,
          monitoringRouter,
          panelsRouter,
          reportsRouter,
          userRouter,
        ],
      }
    },
  },
])
