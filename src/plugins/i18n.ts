// ==== Vue & Vue-i18n 类型 ====
import type { App, WritableComputedRef } from 'vue'
import type { I18n } from 'vue-i18n'

import { isObject, storageLocal } from '@pureadmin/utils'
// ==== Element Plus 国际化 ====
import enLocale from 'element-plus/es/locale/lang/en'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import { createI18n } from 'vue-i18n'
// ==== 项目工具方法 ====
import { responsiveStorageNameSpace } from '@/config'

const siphonI18n = (function () {
  // 基于项目根目录匹配 locales/lang 下的所有 ts 文件
  const cache = Object.fromEntries(
    Object.entries(
      import.meta.glob('../../locales/lang/**/*.ts', { eager: true }),
    ).map(([key, value]: any) => {
      // 匹配 locales/lang/{locale}/{module}.ts
      // 捕获 {locale}
      const matched = key.match(/lang\/([\w-]+)\/.+\.ts$/i)?.[1]
      return [matched, value.default || {}]
    }),
  )

  // 返回对应语言的 messages
  return (prefix = 'zh-CN') => {
    return cache[prefix] || {}
  }
})()

/**
 * 统一语言配置对象
 * key 必须和你的 locale 名一致
 */
export const localesConfigs = {
  'zh-CN': {
    ...siphonI18n('zh-CN'),
    ...zhLocale,
  },
  'en': {
    ...siphonI18n('en'),
    ...enLocale,
  },
}

/** 获取对象中所有嵌套对象的 key，并用点号分隔（如 a.b.c） */
function getObjectKeys(obj: Record<string, any>) {
  const stack: Array<{ obj: any, key: string }> = []
  const keys: Set<string> = new Set()

  stack.push({ obj, key: '' })

  while (stack.length > 0) {
    const { obj, key } = stack.pop()!
    for (const k in obj) {
      const newKey = key ? `${key}.${k}` : k
      if (obj[k] && isObject(obj[k])) {
        stack.push({ obj: obj[k], key: newKey })
      }
      else {
        keys.add(newKey)
      }
    }
  }

  return keys
}

/** 缓存扁平化 key，避免重复遍历 */
const keysCache: Map<string, Set<string>> = new Map()
function flatI18n(prefix = 'zh-CN') {
  let cache = keysCache.get(prefix)
  if (!cache) {
    cache = getObjectKeys(siphonI18n(prefix))
    keysCache.set(prefix, cache)
  }
  return cache
}
/**
 * 创建 i18n 实例
 * 从本地存储读取当前语言，如果没有则默认中文
 */
export const i18n: I18n = createI18n({
  legacy: false,
  locale:
    storageLocal().getItem<{ locale: string }>(
      `${responsiveStorageNameSpace()}locale`,
    )?.locale ?? 'zh-CN',
  fallbackLocale: 'en',
  messages: localesConfigs,
})

/**
 * 国际化转换工具函数
 * 自动读取 locales/lang 文件夹中的文案
 */
export function transformI18n(message: any = ''): string {
  if (!message)
    return ''

  // 如果 message 是对象格式：{ zh-CN: "xxx", en: "yyy" }
  if (typeof message === 'object') {
    const locale: string | WritableComputedRef<string> | any
      = i18n.global.locale
    return message[locale?.value] || ''
  }

  const key = message.match(/(\S*)\./)?.input

  // 嵌套 key 形式
  if (key && flatI18n('zh-CN').has(key)) {
    return i18n.global.t.call(i18n.global.locale, message)
  }
  // 非嵌套形式
  else if (!key && Object.hasOwn(siphonI18n('zh-CN'), message)) {
    return i18n.global.t.call(i18n.global.locale, message)
  }
  // 如果不存在，直接返回原文
  else {
    return message
  }
}

/** 配合 i18n Ally 插件的提示辅助函数 */
export const $t = (key: string) => key

/** 在 Vue 根应用上安装 i18n */
export function useI18n(app: App) {
  app.use(i18n)
}
