import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/devices',
  redirect: '/devices/status',
  meta: {
    icon: 'ph/devices',
    title: $t('menus.deviceMaintenance'),
    rank: RouteRank.DEVICE_MAINTENANCE,
  },
  children: [
    {
      path: '/devices/map',
      name: 'DeviceMap',
      component: () => import('@/views/devices/map/index.vue'),
      meta: { title: $t('menus.deviceMap') },
    },
    {
      path: '/devices/status',
      name: 'DeviceStatus',
      component: () => import('@/views/devices/status/index.vue'),
      meta: { title: $t('menus.deviceStatus') },
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
  ],
} satisfies RouteConfigsTable
