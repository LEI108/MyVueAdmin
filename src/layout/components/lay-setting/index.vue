<script setup lang="ts">
import type { OptionsType } from '@/components/ReSegmented/index'
import { useDark, useGlobal } from '@pureadmin/utils'
import {
  computed,
  nextTick,
  onBeforeMount,
  onUnmounted,
  reactive,
  ref,
  unref,
} from 'vue'
import { useI18n } from 'vue-i18n'
import Check from '~icons/ep/check'
import DarkIcon from '@/assets/svg/moon.svg?component'
import DayIcon from '@/assets/svg/sun.svg?component'
import SystemIcon from '@/assets/svg/system.svg?component'
import Segmented from '@/components/ReSegmented/index'

import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange'
import { useMultiTagsStoreHook } from '@/store/modules/multiTags'
import { emitter } from '@/utils/mitt'
import LayPanel from '../lay-panel/index.vue'

const { t } = useI18n()
const { isDark } = useDark()
const { $storage } = useGlobal<GlobalPropertiesApi>()

const {
  dataTheme,
  overallStyle,
  layoutTheme,
  themeColors,
  dataThemeChange,
  setLayoutThemeColor,
} = useDataThemeChange()

/** 默认灵动模式 */
const markValue = ref($storage.configure?.showModel ?? 'smart')

// 保留 logo 相关
const logoVal = ref($storage.configure?.showLogo ?? true)

const settings = reactive({
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  hideFooter: $storage.configure.hideFooter,
  multiTagsCache: $storage.configure.multiTagsCache,
})

const getThemeColorStyle = computed(() => {
  return (color) => {
    return { background: color }
  }
})

/** 当网页整体为暗色风格时不显示亮白色主题配色切换选项 */
const showThemeColors = computed(() => {
  return (themeColor) => {
    return !(themeColor === 'light' && isDark.value)
  }
})

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = $storage.configure
  storageConfigure[key] = val
  $storage.configure = storageConfigure
}

/** 隐藏标签页设置 */
function tagsChange() {
  const showVal = settings.tabsVal
  storageConfigureChange('hideTabs', showVal)
  emitter.emit('tagViewsChange', showVal as unknown as string)
}

/** 隐藏页脚设置 */
function hideFooterChange() {
  const hideFooter = settings.hideFooter
  storageConfigureChange('hideFooter', hideFooter)
}

/** 标签页持久化设置 */
function multiTagsCacheChange() {
  const multiTagsCache = settings.multiTagsCache
  storageConfigureChange('multiTagsCache', multiTagsCache)
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache)
}

function onChange({ option }) {
  const { value } = option
  markValue.value = value
  storageConfigureChange('showModel', value)
  emitter.emit('tagViewsShowModel', value)
}

/** 侧边栏Logo */
function logoChange() {
  unref(logoVal)
    ? storageConfigureChange('showLogo', true)
    : storageConfigureChange('showLogo', false)
  emitter.emit('logoChange', unref(logoVal))
}

/** 主题色 激活选择项 */
const getThemeColor = computed(() => {
  return (current) => {
    if (
      current === layoutTheme.value.theme
      && layoutTheme.value.theme !== 'light'
    ) {
      return '#fff'
    }
    else if (
      current === layoutTheme.value.theme
      && layoutTheme.value.theme === 'light'
    ) {
      return '#1d2b45'
    }
    else {
      return 'transparent'
    }
  }
})

const pClass = computed(() => {
  return ['mb-[12px]!', 'font-medium', 'text-sm', 'dark:text-white']
})

const themeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.pureOverallStyleLight'),
      icon: DayIcon,
      theme: 'light',
      tip: t('panel.pureOverallStyleLightTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
    {
      label: t('panel.pureOverallStyleDark'),
      icon: DarkIcon,
      theme: 'dark',
      tip: t('panel.pureOverallStyleDarkTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
    {
      label: t('panel.pureOverallStyleSystem'),
      icon: SystemIcon,
      theme: 'system',
      tip: t('panel.pureOverallStyleSystemTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
  ]
})

const markOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.pureTagsStyleSmart'),
      tip: t('panel.pureTagsStyleSmartTip'),
      value: 'smart',
    },
    {
      label: t('panel.pureTagsStyleCard'),
      tip: t('panel.pureTagsStyleCardTip'),
      value: 'card',
    },
    {
      label: t('panel.pureTagsStyleChrome'),
      tip: t('panel.pureTagsStyleChromeTip'),
      value: 'chrome',
    },
  ]
})

const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

/** 根据操作系统主题设置平台整体风格 */
function updateTheme() {
  if (overallStyle.value !== 'system')
    return
  if (mediaQueryList.matches) {
    dataTheme.value = true
  }
  else {
    dataTheme.value = false
  }
  dataThemeChange(overallStyle.value)
}

function removeMatchMedia() {
  mediaQueryList.removeEventListener('change', updateTheme)
}

/** 监听操作系统主题改变 */
function watchSystemThemeChange() {
  updateTheme()
  removeMatchMedia()
  mediaQueryList.addEventListener('change', updateTheme)
}

onBeforeMount(() => {
  /* 初始化系统配置 */
  nextTick(() => {
    watchSystemThemeChange()
    settings.tabsVal && tagsChange()
    settings.hideFooter && hideFooterChange()
  })
})

onUnmounted(() => removeMatchMedia)
</script>

<template>
  <LayPanel>
    <div class="p-5">
      <p :class="pClass">
        {{ t("panel.pureOverallStyle") }}
      </p>
      <Segmented
        resize
        class="select-none"
        :model-value="overallStyle === 'system' ? 2 : dataTheme ? 1 : 0"
        :options="themeOptions"
        @change="
          theme => {
            theme.index === 1 && theme.index !== 2
              ? (dataTheme = true)
              : (dataTheme = false);
            overallStyle = theme.option.theme;
            dataThemeChange(theme.option.theme);
            theme.index === 2 && watchSystemThemeChange();
          }
        "
      />

      <p class="mt-5!" :class="[pClass]">
        {{ t("panel.pureThemeColor") }}
      </p>
      <ul class="theme-color">
        <li
          v-for="(item, index) in themeColors"
          v-show="showThemeColors(item.themeColor)"
          :key="index"
          :style="getThemeColorStyle(item.color)"
          @click="setLayoutThemeColor(item.themeColor)"
        >
          <el-icon
            style="margin: 0.1em 0.1em 0 0"
            :size="17"
            :color="getThemeColor(item.themeColor)"
          >
            <IconifyIconOffline :icon="Check" />
          </el-icon>
        </li>
      </ul>

      <p class="mt-4!" :class="[pClass]">
        {{ t("panel.pureTagsStyle") }}
      </p>
      <Segmented
        resize
        class="select-none"
        :model-value="markValue === 'smart' ? 0 : markValue === 'card' ? 1 : 2"
        :options="markOptions"
        @change="onChange"
      />

      <p class="mt-5! font-medium text-sm dark:text-white">
        {{ t("panel.pureInterfaceDisplay") }}
      </p>
      <ul class="setting">
        <li>
          <span class="dark:text-white">{{ t("panel.pureHiddenTags") }}</span>
          <el-switch
            v-model="settings.tabsVal"
            inline-prompt
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            @change="tagsChange"
          />
        </li>
        <li>
          <span class="dark:text-white">{{ t("panel.pureHiddenFooter") }}</span>
          <el-switch
            v-model="settings.hideFooter"
            inline-prompt
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            @change="hideFooterChange"
          />
        </li>
        <li>
          <span class="dark:text-white">Logo</span>
          <el-switch
            v-model="logoVal"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            @change="logoChange"
          />
        </li>
        <li>
          <span class="dark:text-white">
            {{ t("panel.pureMultiTagsCache") }}
          </span>
          <el-switch
            v-model="settings.multiTagsCache"
            inline-prompt
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            @change="multiTagsCacheChange"
          />
        </li>
      </ul>
    </div>
  </LayPanel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}

:deep(.el-switch__core) {
  --el-switch-off-color: var(--pure-switch-off-color);
  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}

.theme-color {
  height: 20px;

  li {
    float: left;
    height: 20px;
    margin-right: 8px;
    cursor: pointer;
    border-radius: 4px;

    &:nth-child(1) {
      border: 1px solid #ddd;
    }
  }
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }
}
</style>
