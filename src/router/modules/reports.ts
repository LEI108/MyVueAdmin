// src/router/modules/home/alarm.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/reports',
  redirect: '/reports/daily',
  meta: {
    icon: 'Document',
    title: $t('menus.reports'),
    rank: RouteRank.DATA_REPORTS,
  },
  children: [
    {
      path: '/reports/daily',
      name: 'DailyReport',
      component: () => import('@/views/reports/daily/index.vue'),
      meta: {
        title: $t('menus.daily'),
      },
    },
    {
      path: '/reports/monthly',
      name: 'MonthlyReport',
      component: () => import('@/views/reports/monthly/index.vue'),
      meta: {
        title: $t('menus.monthly'),
      },
    },
    {
      path: '/reports/yearly',
      name: 'YearlyReport',
      component: () => import('@/views/reports/yearly/index.vue'),
      meta: {
        title: $t('menus.yearly'),
      },
    },
    {
      path: '/reports/export',
      name: 'DataExport',
      component: () => import('@/views/reports/export/index.vue'),
      meta: {
        title: $t('menus.export'),
      },
    },
  ],
} satisfies RouteConfigsTable
