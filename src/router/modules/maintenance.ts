// src/router/modules/home/operations.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/maintenance',
  redirect: '/maintenance/records',
  meta: {
    icon: 'ph/toolbox',
    title: $t('menus.maintenance'),
    rank: RouteRank.MAINTENANCE_MANAGEMENT,
  },
  children: [
    {
      path: '/maintenance/records',
      name: 'MaintenanceRecords',
      component: () => import('@/views/maintenance/records/index.vue'),
      meta: {
        title: $t('menus.records'),
      },
    },
    {
      path: '/maintenance/work-orders',
      name: 'WorkOrders',
      component: () => import('@/views/maintenance/workorders/index.vue'),
      meta: {
        title: $t('menus.workOrders'),
      },
    },
    {
      path: '/maintenance/inventory',
      name: 'Inventory',
      component: () => import('@/views/maintenance/inventory/index.vue'),
      meta: {
        title: $t('menus.inventory'),
      },
    },
  ],
} satisfies RouteConfigsTable
