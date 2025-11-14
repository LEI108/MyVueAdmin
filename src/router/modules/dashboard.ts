import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/dashboard',
  redirect: '/dashboard/generation',
  meta: {
    icon: 'ph/chart-bar',
    title: $t('menus.dashboard'),
    rank: RouteRank.DASHBOARD,
  },
  children: [
    {
      path: '/dashboard/generation',
      name: 'Generationdashboard',
      component: () => import('@/views/dashboard/generation/index.vue'),
      meta: { title: $t('menus.generationDashboard') },
    },
    {
      path: '/dashboard/energy',
      name: 'Energydashboard',
      component: () => import('@/views/dashboard/energy/index.vue'),
      meta: { title: $t('menus.energyDashboard') },
    },
    {
      path: '/dashboard/custom-report',
      name: 'CustomReport',
      component: () => import('@/views/dashboard/custom-report/index.vue'),
      meta: { title: $t('menus.customReport') },
    },
  ],
} satisfies RouteConfigsTable
