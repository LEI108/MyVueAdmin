// src/router/modules/home/panels.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/panels',
  redirect: '/panels/list',
  meta: {
    icon: 'PhChartBar',
    title: $t('menus.panels'),
    rank: RouteRank.SOLAR_PANEL_MANAGEMENT,
  },
  children: [
    {
      path: '/panels/list',
      name: 'PanelList',
      component: () => import('@/views/panels/list/index.vue'),
      meta: {
        title: $t('menus.list'),
      },
    },
    {
      path: '/panels/map',
      name: 'PanelMap',
      component: () => import('@/views/panels/map/index.vue'),
      meta: {
        title: $t('menus.map'),
      },
    },
    {
      path: '/panels/status',
      name: 'PanelStatus',
      component: () => import('@/views/panels/status/index.vue'),
      meta: {
        title: $t('menus.status'),
      },
    },
  ],
} satisfies RouteConfigsTable
