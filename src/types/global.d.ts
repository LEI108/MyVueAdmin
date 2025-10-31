// src/types/global.d.ts
/**
 * 全局类型声明
 */

// 图标组件类型
declare type IconComponent = DefineComponent<object, object, any>

// 国际化函数类型
declare type I18nFunction = (key: string, values?: Record<string, any>) => string

declare type ComponentType = import('vue').Component
// 全局环境变量
interface ImportMetaEnv {
  VITE_API_BASE_URL: string
  VITE_APP_TITLE: string
  VITE_DEFAULT_LANGUAGE: 'zh-CN' | 'en'
  // 其他环境变量...
}
