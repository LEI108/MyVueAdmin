// src/components/Menu/BaseMenu.vue
<script setup lang="ts">
import type { MenuItemType } from '@/types/menu'
import { useI18n } from 'vue-i18n'

const { items, activePath } = defineProps<{
  items: MenuItemType[]
  activePath?: string
}>()

const { t } = useI18n()

/** 严格判断是否有有效的子菜单 */
function hasValidChildren(item: MenuItemType) {
  return (
    Array.isArray(item.children)
    && item.children.length > 0
    && item.children.some(c => !!c.meta?.title)
  )
}
</script>

<template>
  <el-menu
    :default-active="activePath"
    class="base-menu"
    router
    :collapse-transition="false"
  >
    <template v-for="item in items" :key="item.path">
      <!-- 子菜单 -->
      <el-sub-menu v-if="hasValidChildren(item)" :index="item.path">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ t(item.meta?.title || '') }}</span>
        </template>
        <BaseMenu
          v-if="item.children"
          :items="item.children"
          :active-path="activePath"
        />
      </el-sub-menu>

      <!-- 普通菜单项 -->
      <el-menu-item v-else :index="item.path">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ t(item.meta?.title || '') }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">
.base-menu {
  border-right: none;
}
</style>
