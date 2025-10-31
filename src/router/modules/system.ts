// src/router/modules/home/profile.ts
import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/user',
  redirect: '/user/list',
  meta: {
    icon: 'User',
    title: $t('menus.user'),
    rank: RouteRank.USER_MANAGEMENT,
  },
  children: [
    {
      path: '/user/list',
      name: 'UserList',
      component: () => import('@/views/user/list/index.vue'),
      meta: {
        title: $t('menus.list'),
      },
    },
    {
      path: '/user/roles',
      name: 'RoleManagement',
      component: () => import('@/views/user/roles/index.vue'),
      meta: {
        title: $t('menus.roles'),
      },
    },
    {
      path: '/user/permissions',
      name: 'PermissionConfig',
      component: () => import('@/views/user/permissions/index.vue'),
      meta: {
        title: $t('menus.permissions'),
      },
    },
  ],
} satisfies RouteConfigsTable
