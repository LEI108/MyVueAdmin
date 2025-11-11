import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/devices',
  redirect: '/devices/status',
  meta: {
    icon: 'ph/toolbox',
    title: $t('menus.deviceMaintenance'),
    rank: RouteRank.DEVICE_MAINTENANCE,
  },
  children: [
    {
      path: '/devices/status',
      name: 'DeviceStatus',
      component: () => import('@/views/devices/status/index.vue'),
      meta: { title: $t('menus.deviceStatus') },
    },
    {
      path: '/devices/map',
      name: 'DeviceMap',
      component: () => import('@/views/devices/map/index.vue'),
      meta: { title: $t('menus.deviceMap') },
    },
    {
      path: '/devices/repair-record',
      name: 'RepairRecord',
      component: () => import('@/views/devices/repair-record/index.vue'),
      meta: { title: $t('menus.repairRecord') },
    },
    {
      path: '/devices/work-order',
      name: 'WorkOrder',
      component: () => import('@/views/devices/work-order/index.vue'),
      meta: { title: $t('menus.workOrder') },
    },
    {
      path: '/devices/maintenance-plan',
      name: 'MaintenancePlan',
      component: () => import('@/views/devices/maintenance-plan/index.vue'),
      meta: { title: $t('menus.maintenancePlan') },
    },
  ],
} satisfies RouteConfigsTable
