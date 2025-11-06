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
      path: '/alarm/record',
      name: 'AlarmRecord',
      component: () => import('@/views/alarm/records/index.vue'),
      meta: { title: $t('menus.alarmRecord') },
    },
    {
      path: '/alarm/statistics',
      name: 'AlarmStatistics',
      component: () => import('@/views/alarm/statistics/index.vue'),
      meta: { title: $t('menus.alarmStatistics') },
    },
    {
      path: '/alarm/rule-config',
      name: 'AlarmRuleConfig',
      component: () => import('@/views/alarm/rules/index.vue'),
      meta: { title: $t('menus.alarmRuleConfig') },
    },
  ],
} satisfies RouteConfigsTable
