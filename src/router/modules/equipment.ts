import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/equipment',
  redirect: '/equipment/status',
  meta: {
    icon: 'ph/toolbox',
    title: $t('menus.deviceMaintenance'),
    rank: RouteRank.DEVICE_MAINTENANCE,
  },
  children: [
    {
      path: '/equipment/status',
      name: 'DeviceStatus',
      component: () => import('@/views/equipment/status/index.vue'),
      meta: { title: $t('menus.deviceStatus') },
    },
    {
      path: '/equipment/map',
      name: 'DeviceMap',
      component: () => import('@/views/equipment/map/index.vue'),
      meta: { title: $t('menus.deviceMap') },
    },
    {
      path: '/equipment/repair-record',
      name: 'RepairRecord',
      component: () => import('@/views/equipment/repair-record/index.vue'),
      meta: { title: $t('menus.repairRecord') },
    },
    {
      path: '/equipment/work-order',
      name: 'WorkOrder',
      component: () => import('@/views/equipment/work-order/index.vue'),
      meta: { title: $t('menus.workOrder') },
    },
    {
      path: '/equipment/maintenance-plan',
      name: 'MaintenancePlan',
      component: () => import('@/views/equipment/maintenance-plan/index.vue'),
      meta: { title: $t('menus.maintenancePlan') },
    },
  ],
} satisfies RouteConfigsTable
