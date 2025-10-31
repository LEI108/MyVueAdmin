import type { App } from 'vue'
import type { Composer, I18n } from 'vue-i18n'

// ==== UI 组件库语言包 ====
// Element Plus
import elementEn from 'element-plus/es/locale/lang/en'
import elementZhCn from 'element-plus/es/locale/lang/zh-cn'
import { createI18n } from 'vue-i18n'

// ==== 类型定义 ====
export type LocaleType = 'zh-CN' | 'en'
export type LocaleMessages = Record<string, any>
export type ElementLocaleType = typeof elementZhCn | typeof elementEn

// ==== 命名空间加载 ====
/**
 * 按模块加载多语言文件
 * 格式： ./lang/{locale}/{module}.ts
 * 例如： ./lang/zh-CN/common.ts
 */
function loadLocaleMessages(): Record<LocaleType, LocaleMessages> {
  const messages: Record<LocaleType, LocaleMessages> = {
    'zh-CN': {},
    'en': {},
  }

  const modules = import.meta.glob('./lang/**/*.ts', { eager: true })

  for (const path in modules) {
    const match = path.match(/lang\/([\w-]+)\/(.+)\.ts$/i)
    if (match) {
      const [, locale, namespace] = match as [string, LocaleType, string]
      const nsKey = namespace.replace(/\//g, '.') // 支持嵌套文件夹转换为点分隔
      const moduleData = (modules[path] as any).default

      // 合并同命名空间
      if (!messages[locale][nsKey]) {
        messages[locale][nsKey] = moduleData
      }
      else {
        messages[locale][nsKey] = {
          ...messages[locale][nsKey],
          ...moduleData,
        }
      }
    }
  }

  return messages
}

// ==== 合并 UI 组件库文案 ====
function mergeUiLibraryMessages(messages: Record<LocaleType, LocaleMessages>) {
  messages['zh-CN'] = { ...messages['zh-CN'], ...elementZhCn }
  messages.en = { ...messages.en, ...elementEn }
  return messages
}

// ==== Key 扁平化缓存（高性能） ====
function getObjectKeys(obj: any): Set<string> {
  const stack: Array<{ obj: any, key: string }> = [{ obj, key: '' }]
  const keys: Set<string> = new Set()

  while (stack.length > 0) {
    const { obj, key } = stack.pop()!
    for (const k in obj) {
      const newKey = key ? `${key}.${k}` : k
      if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
        stack.push({ obj: obj[k], key: newKey })
      }
      else {
        keys.add(newKey)
      }
    }
  }
  return keys
}

const keysCache: Map<LocaleType, Set<string>> = new Map()
function flatI18nKeys(locale: LocaleType, messages: LocaleMessages) {
  if (!keysCache.has(locale)) {
    keysCache.set(locale, getObjectKeys(messages))
  }
  return keysCache.get(locale)!
}

// ==== 存储语言配置（统一命名空间） ====
const STORAGE_KEY = 'myapp-i18n-locale' // 可替换为项目命名空间

function getInitialLocale(): LocaleType {
  const saved = localStorage.getItem(STORAGE_KEY) as LocaleType | null
  if (saved)
    return saved
  return navigator.language.toLowerCase().includes('zh') ? 'zh-CN' : 'en'
}

function saveLocale(lang: LocaleType): void {
  localStorage.setItem(STORAGE_KEY, lang)
}

// ==== 创建 i18n 实例 ====
const messages = mergeUiLibraryMessages(loadLocaleMessages())

export const i18n: I18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages,
  silentFallbackWarn: true,
  missingWarn: false,
})

// 💡 在 legacy: false 模式下, i18n.global 实际是 Composer 类型
const composer = i18n.global as unknown as Composer

// ==== 对象格式翻译支持 ====
function transformI18n(message: any = ''): string {
  if (!message)
    return ''

  // 对象格式：{ zh-CN: "xxx", en: "yyy" }
  if (typeof message === 'object') {
    const value = composer.locale.value
    return message[value] || ''
  }

  // 检查 key 是否存在
  const currentLocale = composer.locale.value as LocaleType
  const keySet = flatI18nKeys(currentLocale, messages[currentLocale])
  if (keySet.has(message)) {
    return composer.t(message)
  }

  return message // 如果不存在，原样返回
}

// ==== IDE 提示辅助 ====
export const $t = (key: string) => key

// ==== API 方法 ====
export function getLocale(): LocaleType {
  return composer.locale.value as LocaleType
}

export function setLocale(lang: LocaleType): void {
  composer.locale.value = lang
  saveLocale(lang)
}

export function getElementPlusLocale(): ElementLocaleType {
  return getLocale() === 'zh-CN' ? elementZhCn : elementEn
}

export function installI18n(app: App): void {
  app.use(i18n)
}

export { transformI18n }
