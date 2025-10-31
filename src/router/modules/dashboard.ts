// src/router/modules/home/dashboard.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/dashboard',
  redirect: '/dashboard/overview',
  meta: {
    icon: 'ph/chart-bar',
    title: $t('menus.dashboard'),
    rank: RouteRank.DASHBOARD,
  },
  children: [
    {
      path: '/dashboard/overview',
      name: 'DashboardOverview',
      component: () => import('@/views/dashboard/overview/index.vue'),
      meta: {
        title: $t('menus.overview'),
      },
    },
    {
      path: '/dashboard/realtime',
      name: 'DashboardRealtime',
      component: () => import('@/views/dashboard/realtime/index.vue'),
      meta: {
        title: $t('menus.realtime'),
      },
    },
    {
      path: '/dashboard/trends',
      name: 'DashboardTrends',
      component: () => import('@/views/dashboard/trends/index.vue'),
      meta: {
        title: $t('menus.trends'),
      },
    },
  ],
} satisfies RouteConfigsTable
