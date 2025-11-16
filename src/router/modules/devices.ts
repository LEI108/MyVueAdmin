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
  ],
} satisfies RouteConfigsTable
