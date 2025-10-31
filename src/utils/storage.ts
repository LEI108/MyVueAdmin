// src/utils/storage.ts
/**
 * 本地存储工具类
 * 提供对 localStorage 的安全访问和类型化存储
 */

// 存储配置类型定义
export interface StorageConfigs {
  [key: string]: any
}

/**
 * 创建带命名空间的存储工具
 * @param namespace 存储命名空间，用于隔离不同应用的存储
 * @returns 存储操作对象
 */
export function storageLocal(namespace?: string) {
  // 获取带命名空间的完整键名
  const getKey = (key: string) => {
    return namespace ? `${namespace}:${key}` : key
  }

  return {
    /**
     * 获取存储项
     * @param key 存储键名
     * @returns 存储的值或null
     */
    getItem<T = any>(key: string): T | null {
      try {
        const fullKey = getKey(key)
        const value = localStorage.getItem(fullKey)
        return value ? JSON.parse(value) : null
      }
      catch (error) {
        console.error(`Storage getItem error: ${error}`)
        return null
      }
    },

    /**
     * 设置存储项
     * @param key 存储键名
     * @param value 存储的值
     */
    setItem(key: string, value: any): void {
      try {
        const fullKey = getKey(key)
        const valueStr = JSON.stringify(value)
        localStorage.setItem(fullKey, valueStr)
      }
      catch (error) {
        console.error(`Storage setItem error: ${error}`)
      }
    },

    /**
     * 移除存储项
     * @param key 存储键名
     */
    removeItem(key: string): void {
      try {
        const fullKey = getKey(key)
        localStorage.removeItem(fullKey)
      }
      catch (error) {
        console.error(`Storage removeItem error: ${error}`)
      }
    },

    /**
     * 清空命名空间下的所有存储
     */
    clear(): void {
      try {
        if (namespace) {
          // 只清除当前命名空间下的项
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(`${namespace}:`)) {
              localStorage.removeItem(key)
            }
          })
        }
        else {
          // 清空所有存储
          localStorage.clear()
        }
      }
      catch (error) {
        console.error(`Storage clear error: ${error}`)
      }
    },

    /**
     * 检查存储项是否存在
     * @param key 存储键名
     * @returns 是否存在
     */
    hasItem(key: string): boolean {
      try {
        const fullKey = getKey(key)
        return localStorage.getItem(fullKey) !== null
      }
      catch (error) {
        console.error(`Storage hasItem error: ${error}`)
        return false
      }
    },

    /**
     * 获取所有存储键名
     * @returns 键名数组
     */
    keys(): string[] {
      try {
        if (namespace) {
          return Object.keys(localStorage)
            .filter(key => key.startsWith(`${namespace}:`))
            .map(key => key.replace(`${namespace}:`, ''))
        }
        return Object.keys(localStorage)
      }
      catch (error) {
        console.error(`Storage keys error: ${error}`)
        return []
      }
    },
  }
}

/**
 * 默认存储实例（使用全局命名空间）
 */
export const defaultStorage = storageLocal()
