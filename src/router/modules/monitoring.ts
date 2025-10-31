// src/router/modules/home/monitoring.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/monitoring',
  redirect: '/monitoring/single',
  meta: {
    icon: 'VideoCamera',
    title: $t('menus.monitoring'),
    rank: RouteRank.REALTIME_MONITORING,
  },
  children: [
    {
      path: '/monitoring/single',
      name: 'SingleMonitor',
      component: () => import('@/views/monitoring/single/index.vue'),
      meta: {
        title: $t('menus.single'),
      },
    },
    {
      path: '/monitoring/compare',
      name: 'MultiMonitor',
      component: () => import('@/views/monitoring/multi/index.vue'),
      meta: {
        title: $t('menus.multi'),
      },
    },
    {
      path: '/monitoring/history',
      name: 'HistoryPlayback',
      component: () => import('@/views/monitoring/history/index.vue'),
      meta: {
        title: $t('menus.history'),
      },
    },
  ],
} satisfies RouteConfigsTable
