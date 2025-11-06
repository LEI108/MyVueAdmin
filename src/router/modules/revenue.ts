import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/revenue',
  redirect: '/revenue/power-purchase',
  meta: {
    icon: 'ph/currency-dollar-simple',
    title: $t('menus.revenueManagement'),
    rank: RouteRank.REVENUE_MANAGEMENT,
  },
  children: [
    {
      path: '/revenue/power-purchase',
      name: 'PowerPurchaseReport',
      component: () => import('@/views/revenue/power-purchase/index.vue'),
      meta: { title: $t('menus.powerPurchaseAnalysis') },
    },
    {
      path: '/revenue/station',
      name: 'StationRevenue',
      component: () => import('@/views/revenue/station/index.vue'),
      meta: { title: $t('menus.stationRevenue') },
    },
    {
      path: '/revenue/owner',
      name: 'OwnerRevenue',
      component: () => import('@/views/revenue/owner/index.vue'),
      meta: { title: $t('menus.ownerRevenue') },
    },
    {
      path: '/revenue/report',
      name: 'FinanceReport',
      component: () => import('@/views/revenue/report/index.vue'),
      meta: { title: $t('menus.financeReport') },
    },
  ],
} satisfies RouteConfigsTable
