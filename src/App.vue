<!-- src/App.vue -->
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { ref, watch } from 'vue'
import { getElementPlusLocale, setLocale } from '@/plugins/i18n'
import { useAppStore } from '@/store/app'

const elementLocale = ref(getElementPlusLocale())
const appStore = useAppStore()

// 监听语言变化并更新 Element Plus
watch(() => appStore.language, (newLang) => {
  setLocale(newLang)
  elementLocale.value = getElementPlusLocale()
})
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
  </ElConfigProvider>
</template>
