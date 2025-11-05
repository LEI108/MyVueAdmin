// src/plugins/i18n.ts
import type { App, WritableComputedRef } from 'vue'
import type { Composer, I18n } from 'vue-i18n'
import { isObject, storageLocal } from '@pureadmin/utils'
import enLocale from 'element-plus/es/locale/lang/en'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import { createI18n } from 'vue-i18n'
import { responsiveStorageNameSpace } from '@/config'

/**
 * =====================
 *  1. 读取并缓存多语言文件
 * =====================
 */
const loadLocaleMessages = (() => {
  const cache: Record<string, Record<string, any>> = {}

  // 直接读取 ts 语言文件
  const modules = import.meta.glob('../locales/lang/**/*.ts', { eager: true })

  for (const path in modules) {
    const matched = path.match(/lang\/([\w-]+)\/(.+)\.ts$/i)
    if (!matched)
      continue

    const [, locale, moduleName] = matched
    const moduleData = (modules[path] as any).default

    // 初始化对应语言对象
    if (!cache[locale])
      cache[locale] = {}

    /**
     * 支持文件导出形式：
     *  1. export default { login: {...} } （如 pureadmin 风格）
     *  2. export default { username: 'xxx', password: 'xxx' } （更简洁）
     */
    if (
      moduleData
      && isObject(moduleData)
      && moduleData[moduleName]
      && isObject(moduleData[moduleName])
    ) {
      cache[locale][moduleName] = moduleData[moduleName]
    }
    else {
      cache[locale][moduleName] = moduleData
    }
  }

  // 合并 Element Plus 国际化
  if (cache['zh-CN'])
    cache['zh-CN'] = { ...cache['zh-CN'], ...zhLocale }
  if (cache.en)
    cache.en = { ...cache.en, ...enLocale }

  // 返回函数供外部通过 prefix 取
  return (prefix: string) => cache[prefix] ?? {}
})()

/**
 * =====================
 *  2. 获取所有嵌套 key（修复 pureadmin 原写法丢 key 的问题）
 * =====================
 */
function getObjectKeys(obj: Record<string, any>): Set<string> {
  const stack: Array<{ obj: Record<string, any>, key: string }> = []
  const keys: Set<string> = new Set()

  stack.push({ obj, key: '' })

  while (stack.length > 0) {
    const { obj: currentObj, key: currentKey } = stack.pop()!

    for (const k in currentObj) {
      if (!Object.prototype.hasOwnProperty.call(currentObj, k))
        continue

      const newKey = currentKey ? `${currentKey}.${k}` : k

      if (currentObj[k] && isObject(currentObj[k])) {
        stack.push({ obj: currentObj[k], key: newKey })
      }
      else {
        // 修复: 保证记录完整的嵌套 key，而不是上一级 key
        keys.add(newKey)
      }
    }
  }

  return keys
}

/**
 * =====================
 *  3. 缓存 flat key 集合，用于智能判断
 * =====================
 */
const keysCache: Map<string, Set<string>> = new Map()

function flatI18n(prefix: string): Set<string> {
  let cache = keysCache.get(prefix)
  if (!cache) {
    cache = getObjectKeys(loadLocaleMessages(prefix))
    keysCache.set(prefix, cache)
  }
  return cache
}

/**
 * =====================
 *  6. 创建 I18n 实例
 * =====================
 */
export const i18n: I18n = createI18n({
  legacy: false, // composition API 模式
  locale:
    storageLocal().getItem<StorageConfigs>(
      `${responsiveStorageNameSpace()}locale`,
    )?.locale ?? 'zh-CN',
  fallbackLocale: 'en',
  messages: {
    'zh-CN': loadLocaleMessages('zh-CN'),
    'en': loadLocaleMessages('en'),
  },
})

/**
 * =====================
 *  4. transformI18n 智能翻译
 * =====================
 */
export function transformI18n(message: any = ''): string {
  if (!message)
    return ''

  // 获取当前语言代码（兼容 legacy 和 composition）
  const localeCode: string
    = typeof i18n.global.locale === 'string'
      ? i18n.global.locale
      : (i18n.global.locale as WritableComputedRef<string>).value

  // 处理动态对象：{ zh: "xxx", en: "xxx" }
  if (typeof message === 'object') {
    return message[localeCode] ?? ''
  }

  // 判断是否是嵌套 key
  const key = message.match(/^[\w-]+\.[\w-]+/)?.[0]

  if (key && flatI18n(localeCode).has(message)) {
    return (i18n.global as Composer).t(message) as string
  }
  else if (!key && Object.hasOwn(loadLocaleMessages(localeCode), message)) {
    // 兼容非嵌套 key
    return (i18n.global as Composer).t(message) as string
  }
  else {
    return message
  }
}

/**
 * =====================
 *  5. 类型提示辅助 ($t)
 * =====================
 */
export const $t = (key: string): string => key

export function useI18n(app: App): void {
  app.use(i18n)
}
