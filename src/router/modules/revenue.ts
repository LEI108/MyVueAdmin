import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/revenue',
  redirect: '/revenue/stationRevenue',
  meta: {
    icon: 'ph/credit-card',
    title: $t('menus.revenueManagement'),
    rank: RouteRank.REVENUE_MANAGEMENT,
  },
  children: [
    {
      path: '/revenue/stationRevenue',
      name: 'StationRevenue',
      component: () => import('@/views/revenue/stationRevenue/index.vue'),
      meta: { title: $t('menus.stationRevenue') },
    },
    {
      path: '/revenue/salesRevenue',
      name: 'SalesRevenue',
      component: () => import('@/views/revenue/salesRevenue/index.vue'),
      meta: { title: $t('menus.salesRevenue') },
    },
  ],
} satisfies RouteConfigsTable
