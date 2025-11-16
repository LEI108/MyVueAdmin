import { useDark } from '@pureadmin/utils'
// 抽离可公用的工具函数等用于系统管理页面逻辑
import { computed } from 'vue'

export function usePublicHooks() {
  const { isDark } = useDark()

  const switchStyle = computed(() => {
    return {
      '--el-switch-on-color': '#6abe39',
      '--el-switch-off-color': '#e84749',
    }
  })

  const tagStyle = computed(() => {
    return (status: number) => {
      return status === 1
        ? {
            '--el-tag-text-color': isDark.value ? '#6abe39' : '#389e0d',
            '--el-tag-bg-color': isDark.value ? '#172412' : '#f6ffed',
            '--el-tag-border-color': isDark.value ? '#274a17' : '#b7eb8f',
          }
        : {
            '--el-tag-text-color': isDark.value ? '#e84749' : '#cf1322',
            '--el-tag-bg-color': isDark.value ? '#2b1316' : '#fff1f0',
            '--el-tag-border-color': isDark.value ? '#58191c' : '#ffa39e',
          }
    }
  })

  /** 告警级别颜色（轻微-绿; 中等-橙; 严重-红） */
  const alarmLevelTagStyle = computed(() => {
    return (level: number) => {
      const colors = {
        // 轻微-绿
        1: {
          light: {
            '--el-tag-text-color': '#389e0d',
            '--el-tag-bg-color': '#f6ffed',
            '--el-tag-border-color': '#b7eb8f',
          },
          dark: {
            '--el-tag-text-color': '#6abe39',
            '--el-tag-bg-color': '#172412',
            '--el-tag-border-color': '#274a17',
          },
        },
        // 中等-橙
        2: {
          light: {
            '--el-tag-text-color': '#d46b08',
            '--el-tag-bg-color': '#fff7e6',
            '--el-tag-border-color': '#ffd591',
          },
          dark: {
            '--el-tag-text-color': '#e6a23c',
            '--el-tag-bg-color': '#2b2311',
            '--el-tag-border-color': '#7d5b24',
          },
        },
        // 严重-红
        3: {
          light: {
            '--el-tag-text-color': '#cf1322',
            '--el-tag-bg-color': '#fff1f0',
            '--el-tag-border-color': '#ffa39e',
          },
          dark: {
            '--el-tag-text-color': '#e84749',
            '--el-tag-bg-color': '#2b1316',
            '--el-tag-border-color': '#58191c',
          },
        },
      }
      return isDark.value ? colors[level].dark : colors[level].light
    }
  })

  /** 优先级颜色（低-绿; 中等-橙; 高-红） */
  const statusTagStyle = computed(() => {
    return (level: number) => {
      const colors = {
        // 轻微-绿
        1: {
          light: {
            '--el-tag-text-color': '#389e0d',
            '--el-tag-bg-color': '#f6ffed',
            '--el-tag-border-color': '#b7eb8f',
          },
          dark: {
            '--el-tag-text-color': '#6abe39',
            '--el-tag-bg-color': '#172412',
            '--el-tag-border-color': '#274a17',
          },
        },
        // 中等-橙
        2: {
          light: {
            '--el-tag-text-color': '#d46b08',
            '--el-tag-bg-color': '#fff7e6',
            '--el-tag-border-color': '#ffd591',
          },
          dark: {
            '--el-tag-text-color': '#e6a23c',
            '--el-tag-bg-color': '#2b2311',
            '--el-tag-border-color': '#7d5b24',
          },
        },
        // 严重-红
        3: {
          light: {
            '--el-tag-text-color': '#cf1322',
            '--el-tag-bg-color': '#fff1f0',
            '--el-tag-border-color': '#ffa39e',
          },
          dark: {
            '--el-tag-text-color': '#e84749',
            '--el-tag-bg-color': '#2b1316',
            '--el-tag-border-color': '#58191c',
          },
        },
      }
      return isDark.value ? colors[level].dark : colors[level].light
    }
  })

  return {
    /** 当前网页是否为`dark`模式 */
    isDark,
    /** 表现更鲜明的`el-switch`组件  */
    switchStyle,
    /** 表现更鲜明的`el-tag`组件  */
    tagStyle,
    /** 告警级别样式 */
    alarmLevelTagStyle,
    /** 状态样式 */
    statusTagStyle,
  }
}
