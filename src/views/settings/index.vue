<!-- src/views/settings/index.vue -->
<script setup lang="ts">
import { useAppStore } from '@/store/app'
import SettingsMobile from './components/SettingsMobile.vue'
import SettingsDialog from './compu=mponents/SettingsDialog.vue'

const appStore = useAppStore()
</script>

<template>
  <div>
    <SettingsMobile v-if="appStore.isMobile" />
    <SettingsDialog v-else />
  </div>
</template>
