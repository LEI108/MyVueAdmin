// src/router/utils.ts
import type { RouteRecordRaw } from 'vue-router'
import { LayoutType } from './enums'

/**
 * 按 rank 升序排列路由
 */
export function sortRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.sort((a, b) => {
    const rankA = a.meta?.rank ?? Number.MAX_SAFE_INTEGER
    const rankB = b.meta?.rank ?? Number.MAX_SAFE_INTEGER
    return rankA - rankB
  })
}

/**
 * 根据角色过滤路由
 */
export function filterRoutesByRole(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  return routes.filter((route) => {
    if (!route.meta?.needAuth)
      return true
    if (Array.isArray(route.meta.needAuth)) {
      return route.meta.needAuth.some(role => roles.includes(role))
    }
    return roles.includes(route.meta.needAuth)
  }).map((route) => {
    if (route.children?.length) {
      route.children = filterRoutesByRole(route.children, roles)
    }
    return route
  })
}

/**
 * 按 layoutType 分组路由
 */
export function categorizeRoutes(routes: RouteRecordRaw[]) {
  const grouped: Record<string, RouteRecordRaw[]> = {}
  routes.forEach((route) => {
    const type = route.meta?.layoutType ?? LayoutType.STANDALONE
    if (!grouped[type])
      grouped[type] = []
    grouped[type].push(route)
  })
  return grouped
}
