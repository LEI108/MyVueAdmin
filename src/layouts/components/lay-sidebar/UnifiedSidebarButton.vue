<!-- src/layouts/components/Sidebar/UnifiedSidebarButton.vue -->
<script setup lang="ts">
import { PhList, PhX } from '@phosphor-icons/vue'
import { computed } from 'vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

// 计算属性
const isMobile = computed(() => appStore.isMobile)
const isCollapsed = computed(() => appStore.isCollapsed)
const sidebarMobileOpen = computed(() => appStore.sidebarMobileOpen)

function toggleSidebar() {
  appStore.toggleSidebar()
}
</script>

<template>
  <div
    class="unified-sidebar-btn"
    :class="{
      mobile: isMobile,
      desktop: !isMobile,
      active: isMobile && sidebarMobileOpen,
      collapsed: !isMobile && isCollapsed,
    }"
    @click="toggleSidebar"
  >
    <!-- 移动端状态 -->
    <div v-if="appStore.isMobile" class="mobile-icons">
      <PhList class="menu-icon" :size="28" />
      <PhX class="close-icon" :size="28" />
    </div>

    <!-- 桌面端状态 -->
    <div v-else class="desktop-icons">
      <PhSquareHalf class="expand-icon" :size="28" weight="duotone" />
      <PhSquareHalf class="collapse-icon" :size="28" weight="duotone" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.unified-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-right: 10px;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  // 移动端图标容器
  .mobile-icons {
    position: relative;
    width: 28px;
    height: 28px;

    .menu-icon, .close-icon {
      position: absolute;
      top: 0;
      left: 0;
      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
      color: var(--el-text-color-primary);
    }

    .menu-icon {
      opacity: 1;
      transform: rotate(0deg);
    }

    .close-icon {
      opacity: 0;
      transform: rotate(180deg);
    }
  }

  // 桌面端图标容器
  .desktop-icons {
    position: relative;
    width: 28px;
    height: 28px;

    .expand-icon, .collapse-icon {
      position: absolute;
      top: 0;
      left: 0;
      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
      color: var(--el-text-color-primary);
    }

    .expand-icon {
      opacity: 1;
      transform: rotate(0deg);
    }

    .collapse-icon {
      opacity: 0;
      transform: rotate(180deg);
    }
  }

  // 移动端打开状态 (移除 .active 的嵌套)
  &.mobile.active {
    .mobile-icons {
      .menu-icon {
        opacity: 0;
        transform: rotate(-90deg);
      }
      .close-icon {
        opacity: 1;
        transform: rotate(0deg);
      }
    }
  }

  // 桌面端折叠状态 (移除 .collapsed 的嵌套)
  &.desktop.collapsed {
    .desktop-icons {
      .expand-icon {
        opacity: 0;
        transform: rotate(-180deg);
      }
      .collapse-icon {
        opacity: 1;
        transform: rotate(180deg);
      }
    }
  }
}

// 响应式调整 (确保移动端按钮状态正确)
@media (max-width: 768px) {
  .unified-sidebar-btn.mobile.active .mobile-icons .close-icon {
    opacity: 1;
    transform: rotate(0deg);
  }
}
</style>
