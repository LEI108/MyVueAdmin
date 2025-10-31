// src/types/app/search.d.ts
/**
 * 搜索相关类型定义（重构建议）
 */

// 搜索结果项（title 可为 i18n key 或原始字符串）
export interface SearchResultItem {
  name?: string // 路由 name（可选）
  path: string // 路由 path（必需）
  title?: string // 标题（i18n key 或原文），组件显示时应通过 safeTranslate 处理
  icon?: string // 图标 key（可选）

  // 以下用于性能优化（可选，组件可在索引构建时填充）
  pinyinFull?: string // 全拼（小写、已归一）
  pinyinAcronym?: string // 首字母缩写（小写）
}

// 搜索路由函数类型
export type SearchRoutesFunction = (query: string) => void

// 路由导航函数类型
export type NavigateToRouteFunction = (path: string) => void

// 搜索组件 props（适配 v-model 的形式）
export interface SearchProps {
  modelValue?: string
  isMobile?: boolean
  debounceMs?: number
}

// 组件 emits 类型（最终在组件实现中使用）
export interface SearchEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'navigate', path: string): void
  (e: 'toggleDropdown', visible: boolean): void
}
