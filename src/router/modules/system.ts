import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

export default {
  path: '/system',
  redirect: '/system/users',
  meta: {
    icon: 'ph/users-three',
    title: $t('menus.systemManagement'),
    rank: RouteRank.USER_AUTH_MANAGEMENT,
  },
  children: [
    {
      path: '/system/users',
      name: 'UserManagement',
      component: () => import('@/views/system/users/index.vue'),
      meta: { title: $t('menus.userManagement') },
    },
    {
      path: '/system/departments',
      name: 'DepartmentManagement',
      component: () => import('@/views/system/dept/index.vue'),
      meta: { title: $t('menus.departmentManagement') },
    },
    {
      path: '/system/roles',
      name: 'RolePermission',
      component: () => import('@/views/system/roles/index.vue'),
      meta: { title: $t('menus.rolePermission') },
    },
    {
      path: '/system/logs',
      name: 'OperationLogs',
      component: () => import('@/views/system/logs/index.vue'),
      meta: { title: $t('menus.operationLogs') },
    },
    {
      path: '/system/security',
      name: 'SecuritySettings',
      component: () => import('@/views/system/security/index.vue'),
      meta: { title: $t('menus.securitySettings') },
    },
  ],
} satisfies RouteConfigsTable
