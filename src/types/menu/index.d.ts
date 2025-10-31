// src/types/menu/index.d.ts
/**
 * 菜单相关类型定义
 */
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { LayoutTypeValues } from '@/router/enums'

// 菜单项类型（用于渲染）
export interface MenuItemType {
  path: string
  key?: string
  name?: string
  meta?: RouteMeta & { // 扩展路由元数据
    title?: string | undefined // 国际化键名
    icon?: string
    rank?: number
    searchable?: boolean
    needAuth?: string[]
    layoutType?: LayoutTypeValues
  }
  children?: MenuItemType[]
}

// 菜单渲染属性
export interface MenuItemProps {
  item: MenuItemType
}

// 将路由转换为菜单的函数类型
export type RouteToMenuFunction = (routes: RouteRecordRaw[]) => MenuItemType[]

// 新增：路由分类结果类型
export interface CategorizedRoutes {
  homeLayoutRoutes: RouteRecordRaw[]
  standaloneRoutes: RouteRecordRaw[]
}

// 新增：路由规范化选项
export interface RouteNormalizationOptions {
  parentPath?: string
  keepAbsolutePaths?: boolean
}
