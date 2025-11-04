// src/router/modules/home/profile.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/system',
  redirect: '/system/list',
  meta: {
    icon: 'User',
    title: $t('menus.user'),
    rank: RouteRank.USER_MANAGEMENT,
  },
  children: [
    {
      path: '/system/list',
      name: 'UserList',
      component: () => import('@/views/system/list/index.vue'),
      meta: {
        title: $t('menus.list'),
      },
    },
    {
      path: '/system/roles',
      name: 'RoleManagement',
      component: () => import('@/views/system/roles/index.vue'),
      meta: {
        title: $t('menus.roles'),
      },
    },
  ],
} satisfies RouteConfigsTable
