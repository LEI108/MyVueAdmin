import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/analysis',
  redirect: '/analysis/generation',
  meta: {
    icon: 'ph/chart-line-up',
    title: $t('menus.dataAnalysis'),
    rank: RouteRank.DATA_ANALYSIS,
  },
  children: [
    {
      path: '/analysis/generation',
      name: 'GenerationAnalysis',
      component: () => import('@/views/analysis/generation/index.vue'),
      meta: { title: $t('menus.generationAnalysis') },
    },
    {
      path: '/analysis/energy',
      name: 'EnergyUsageAnalysis',
      component: () => import('@/views/analysis/energy/index.vue'),
      meta: { title: $t('menus.energyAnalysis') },
    },
    {
      path: '/analysis/efficiency',
      name: 'EfficiencyAnalysis',
      component: () => import('@/views/analysis/efficiency/index.vue'),
      meta: { title: $t('menus.efficiencyAnalysis') },
    },
    {
      path: '/analysis/carbon',
      name: 'CarbonAnalysis',
      component: () => import('@/views/analysis/carbon/index.vue'),
      meta: { title: $t('menus.carbonAnalysis') },
    },
    {
      path: '/analysis/trend',
      name: 'TrendForecast',
      component: () => import('@/views/analysis/trend/index.vue'),
      meta: { title: $t('menus.trendAnalysis') },
    },
    {
      path: '/analysis/custom-report',
      name: 'CustomReport',
      component: () => import('@/views/analysis/custom-report/index.vue'),
      meta: { title: $t('menus.customReport') },
    },
  ],
} satisfies RouteConfigsTable
