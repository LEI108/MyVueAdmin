import type { Component } from 'vue'
// src/components/ReIcon/src/hooks.ts
import type { iconType } from './types'
import { defineComponent, h } from 'vue'
import { IconifyIconOffline, IconifyIconOnline } from '../index'
import { offlineIconRegistry } from './offlineIcon'

/**
 * useRenderIcon（最终版）
 * 支持自定义 SVG / Iconify 在线 / Iconify 离线，且离线优先
 * @param icon 必传 图标（string | Vue组件 | 离线对象）
 * @param attrs 可选 iconType 属性（样式等）
 * @returns Vue Component / 渲染函数
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
  // 情况1：自定义 SVG 组件
  if (typeof icon === 'function' || typeof icon?.render === 'function') {
    return attrs ? h(icon, { ...attrs }) : icon
  }

  // 情况2：离线 iconify 对象（比如 addIcon 注册的对象）
  else if (typeof icon === 'object') {
    return defineComponent({
      name: 'OfflineIcon',
      render() {
        return h(IconifyIconOffline, { icon, ...attrs })
      },
    })
  }

  // 情况3：字符串类型（在线 / 离线）
  else if (typeof icon === 'string') {
    return defineComponent({
      name: 'Icon',
      render() {
        if (!icon)
          return null

        let IconifyIcon
        if (offlineIconRegistry.has(icon)) {
          // 离线优先：字符串名已注册离线
          IconifyIcon = IconifyIconOffline
        }
        else {
          // 未注册 → 判断是否冒号在线 iconify 名称
          IconifyIcon = icon.includes(':')
            ? IconifyIconOnline
            : IconifyIconOffline
        }
        return h(IconifyIcon, { icon, ...attrs })
      },
    })
  }

  // 情况4：其它类型直接返回 null
  else {
    return defineComponent({
      name: 'EmptyIcon',
      render() {
        return null
      },
    })
  }
}
