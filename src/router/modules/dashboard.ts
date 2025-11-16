import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/generation',
  redirect: '/generation/generationDashboard',
  meta: {
    icon: 'ph/chart-bar',
    title: $t('menus.generationManagement'),
    rank: RouteRank.GENERATION_MANAGEMENT,
  },
  children: [
    {
      path: '/generation/generationDashboard',
      name: 'GenerationDashboard',
      component: () => import('@/views/generation/generationDashboard/index.vue'),
      meta: { title: $t('menus.generationDashboard') },
    },
    {
      path: '/generation/energy',
      name: 'Energydashboard',
      component: () => import('@/views/generation/energy/index.vue'),
      meta: { title: $t('menus.energyDashboard') },
    },
    {
      path: '/generation/report',
      name: 'CustomReport',
      component: () => import('@/views/generation/report/index.vue'),
      meta: { title: $t('menus.powerReport') },
    },
  ],
} satisfies RouteConfigsTable
