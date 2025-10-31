// src/router/modules/home/alarm.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/alerts',
  redirect: '/alerts/list',
  meta: {
    icon: 'ph/bell-ringing',
    title: $t('menus.alerts'),
    rank: RouteRank.ALARM_MANAGEMENT,
  },
  children: [
    {
      path: '/alerts/list',
      name: 'AlertList',
      component: () => import('@/views/alerts/list/index.vue'),
      meta: {
        title: $t('menus.list'),
      },
    },
    {
      path: '/alerts/rules',
      name: 'AlertRules',
      component: () => import('@/views/alerts/rules/index.vue'),
      meta: {
        title: $t('menus.rules'),
      },
    },
    {
      path: '/alerts/records',
      name: 'AlertRecords',
      component: () => import('@/views/alerts/records/index.vue'),
      meta: {
        title: $t('menus.records'),
      },
    },
  ],
} satisfies RouteConfigsTable
