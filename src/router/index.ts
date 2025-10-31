// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { asyncRoutes } from '../mock/asyncRoutes'
import { LayoutType } from './enums'
import { categorizeRoutes, filterRoutesByRole, sortRoutes } from './utils'

const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'common.login', searchable: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: 'common.notFound', searchable: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...basicRoutes,
  ],
})

export function addDynamicRoutes(roles: string[]) {
  let routes = filterRoutesByRole(asyncRoutes, roles)
  routes = sortRoutes(routes)

  const groupedLayouts = categorizeRoutes(routes)

  Object.keys(groupedLayouts).forEach((layoutKey) => {
    const layoutName = layoutKey.charAt(0).toUpperCase() + layoutKey.slice(1)

    if (!router.hasRoute(layoutName)) {
      if (layoutKey === LayoutType.STANDALONE) {
        // 独立页面直接作为顶级路由添加
        groupedLayouts[layoutKey].forEach((route) => {
          if (!router.hasRoute(route.name!)) {
            router.addRoute(route)
          }
        })
        return
      }

      // 带布局类型的父路由
      router.addRoute({
        path: layoutKey === LayoutType.HOME ? '/' : `/${layoutKey}`,
        name: layoutName,
        component: () => import(`@/layouts/index.vue`),
        redirect: groupedLayouts[layoutKey][0].path,
        children: [],
      })

      groupedLayouts[layoutKey].forEach((route) => {
        if (!router.hasRoute(route.name!)) {
          router.addRoute(layoutName, route)
        }
      })
    }
  })

  // 保证 basic routes 存在
  basicRoutes.forEach((route) => {
    if (!router.hasRoute(route.name!)) {
      router.addRoute(route)
    }
  })
}

export default router
