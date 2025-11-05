<script setup lang="ts">
import { isAllEmpty, storageLocal } from '@pureadmin/utils'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { responsiveStorageNameSpace } from '@/config'
import { useNav } from '@/layout/hooks/useNav'
import { usePermissionStoreHook } from '@/store/modules/permission'
import { emitter } from '@/utils/mitt'
import LaySidebarCenterCollapse from '../lay-sidebar/components/SidebarCenterCollapse.vue'
import LaySidebarItem from '../lay-sidebar/components/SidebarItem.vue'
import LaySidebarLogo from '../lay-sidebar/components/SidebarLogo.vue'

const route = useRoute()
const isShow = ref(false)
const showLogo = ref(
  storageLocal().getItem<StorageConfigs>(
    `${responsiveStorageNameSpace()}configure`,
  )?.showLogo ?? true,
)

const {
  device,
  pureApp,
  isCollapse,
  tooltipEffect,
  menuSelect,
  toggleSideBar,
} = useNav()

// 删除：mix模式专用的子菜单数据（subMenuData）相关代码

// 简化：直接使用完整菜单数据（不再区分mix/vertical）
const menuData = computed(() => usePermissionStoreHook().wholeMenus)

// 简化：loading状态仅依赖全量菜单是否加载完成
const loading = computed(() => menuData.value.length === 0)

const defaultActive = computed(() =>
  !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path,
)

// 删除：mix模式专用的子菜单数据处理方法（getSubMenuData()）

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    if (route.path.includes('/redirect'))
      return
    // 删除：mix模式下的子菜单数据更新逻辑
    menuSelect(route.path) // 保留：路由切换时选中菜单
  },
)

onMounted(() => {
  // 删除：mix模式下的子菜单初始化
  menuSelect(route.path) // 新增：初始化时选中当前路由菜单

  emitter.on('logoChange', (key) => {
    showLogo.value = key
  })
})

onBeforeUnmount(() => {
  emitter.off('logoChange') // 保留：事件解绑
})
</script>

<template>
  <div
    v-loading="loading"
    class="sidebar-container" :class="[showLogo ? 'has-logo' : 'no-logo']"
    @mouseenter.prevent="isShow = true"
    @mouseleave.prevent="isShow = false"
  >
    <LaySidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="[device === 'mobile' ? 'mobile' : 'pc']"
    >
      <el-menu
        unique-opened
        mode="vertical"
        popper-class="pure-scrollbar"
        class="outer-most select-none"
        :collapse="isCollapse"
        :collapse-transition="false"
        :popper-effect="tooltipEffect"
        :default-active="defaultActive"
      >
        <LaySidebarItem
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          :base-path="routes.path"
          class="outer-most select-none"
        />
      </el-menu>
    </el-scrollbar>
    <LaySidebarCenterCollapse
      v-if="device !== 'mobile' && (isShow || isCollapse)"
      :is-active="pureApp.sidebar.opened"
      @toggle-click="toggleSideBar"
    />
    <LaySidebarLeftCollapse
      v-if="device !== 'mobile'"
      :is-active="pureApp.sidebar.opened"
      @toggle-click="toggleSideBar"
    />
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
