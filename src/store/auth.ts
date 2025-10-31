// src/store/auth.ts
import type { RouteRecordRaw } from 'vue-router'
import type { LoginParams, UserInfo } from '@/types/auth'
import type { MenuItemType } from '@/types/menu'
import { defineStore } from 'pinia'
import { loginApi } from '@/api/user'
import { asyncRoutes } from '@/mock/asyncRoutes'
import { addDynamicRoutes } from '@/router'
import { LayoutType } from '@/router/enums' // 需要全面移除LayoutType，待修改
import { filterRoutesByRole, sortRoutes } from '@/router/utils'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: sessionStorage.getItem('token') || '',
    roles: sessionStorage.getItem('roles')
      ? JSON.parse(sessionStorage.getItem('roles')!)
      : [] as string[],
    username: sessionStorage.getItem('username') || '',
    menu: [] as MenuItemType[],
    isCollapsed: localStorage.getItem('sidebarCollapsed') === 'true' || false,
    user: (sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')!)
      : null) as UserInfo | null, // ✅ 新增 user 对象
  }),

  actions: {
    async login(data: LoginParams) {
      try {
        const res = await loginApi(data)

        this.token = res.data.token
        this.username = res.data.user.username
        this.roles = res.data.user.roles
        this.user = {
          username: res.data.user.username,
          roles: res.data.user.roles,
          avatar: res.data.user.avatar || '',
          nickname: res.data.user.nickname || '',
          email: res.data.user.email || '',
        }

        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('username', this.username)
        sessionStorage.setItem('roles', JSON.stringify(this.roles))
        sessionStorage.setItem('user', JSON.stringify(this.user))

        this.generateMenuAndRoutes()
        return res
      }
      catch (err) {
        console.error('登录失败:', err)
        throw err
      }
    },

    /** 更新用户信息（比如在 ProfileSettings 保存时调用） */
    updateUserInfo(partial: Partial<UserInfo>) {
      if (!this.user)
        return
      this.user = { ...this.user, ...partial }
      sessionStorage.setItem('user', JSON.stringify(this.user))
    },

    /** 将路由转换为菜单项对象 */
    routeToMenuItem(route: RouteRecordRaw): MenuItemType {
      let iconName = ''
      if (typeof route.meta?.icon === 'string') {
        iconName = route.meta.icon
      }
      else if (route.meta?.icon && typeof (route.meta.icon as any).name === 'string') {
        iconName = (route.meta.icon as any).name
      }

      if (Array.isArray(route.children) && route.children.length > 0) {
        const validChildren = route.children
          .filter(c => c.meta?.title)
          .map(child => this.routeToMenuItem(child))

        if (validChildren.length === 1) {
          return {
            ...validChildren[0],
            meta: {
              ...validChildren[0].meta,
              title: validChildren[0].meta?.title || route.meta?.title || '',
              icon: iconName || validChildren[0].meta?.icon || '',
              rank: route.meta?.rank ?? validChildren[0].meta?.rank,
            },
          }
        }

        return {
          path: route.path,
          name: route.name?.toString(),
          meta: {
            title: route.meta?.title || '',
            icon: iconName,
            rank: route.meta?.rank,
            searchable: route.meta?.searchable,
            needAuth: route.meta?.needAuth,
            layoutType: route.meta?.layoutType,
          },
          children: validChildren.length > 0 ? validChildren : undefined,
        }
      }

      return {
        path: route.path,
        name: route.name?.toString(),
        meta: {
          title: route.meta?.title || '',
          icon: iconName,
          rank: route.meta?.rank,
          searchable: route.meta?.searchable,
          needAuth: route.meta?.needAuth,
          layoutType: route.meta?.layoutType,
        },
      }
    },

    /** 根据角色生成菜单和路由 */
    generateMenuAndRoutes() {
      const filtered = filterRoutesByRole(asyncRoutes, this.roles)
      const sorted = sortRoutes(filtered)
      this.menu = sorted
        .filter(r => r.meta?.layoutType === LayoutType.HOME)
        .map(r => this.routeToMenuItem(r))
      sessionStorage.setItem('menu', JSON.stringify(this.menu))
      addDynamicRoutes(this.roles)
    },

    restoreSession() {
      if (this.roles.length) {
        this.generateMenuAndRoutes()
      }
    },

    logout() {
      this.token = ''
      this.roles = []
      this.username = ''
      this.menu = []
      this.user = null
      sessionStorage.clear()
    },
  },
})
