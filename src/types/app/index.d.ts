// src/types/app/index.d.ts
/**
 * 应用状态相关类型定义
 */

// 面包屑导航项
export interface BreadcrumbItem {
  path: string
  name: string
  meta?: {
    title?: string
    icon?: string
  }
}

// 应用状态类型
export interface AppState {
  // 侧边栏状态
  sidebar: {
    isCollapsed: boolean
    withoutAnimation: boolean
    isMobile: boolean
    isMobileOpen: boolean
  }

  // 主题设置
  theme: {
    isDarkMode: boolean
    primaryColor: string
  }

  // 用户界面设置
  ui: {
    breadcrumbs: BreadcrumbItem[]
    showBreadcrumb: boolean
    showFooter: boolean
    showSettings: boolean
    tagsView: boolean
  }

  // 设备信息
  device: 'desktop' | 'mobile' | 'tablet'

  // 页面加载状态
  pageLoading: boolean

  // 搜索状态
  search: {
    value: string
    results: SearchResultItem[]
    dialogVisible: boolean
    desktopDropdownVisible: boolean
  }
}
