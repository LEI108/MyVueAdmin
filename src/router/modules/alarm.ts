import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/alarm',
  redirect: '/alarm/list',
  meta: {
    icon: 'ph/warning-circle',
    title: $t('menus.alarmManagement'),
    rank: RouteRank.ALARM_MANAGEMENT,
  },
  children: [
    {
      path: '/alarm/list',
      name: 'AlarmList',
      component: () => import('@/views/alarm/list/index.vue'),
      meta: { title: $t('menus.alarmList') },
    },
    {
      path: '/alarm/workorders',
      name: 'AlarmOrders',
      component: () => import('@/views/alarm/workorders/index.vue'),
      meta: { title: $t('menus.alarmWorkOrders') },
    },
  ],
} satisfies RouteConfigsTable
