<!-- src/layouts/components/TopHeader/TopHeader.vue -->
<script setup lang="ts">
import { PhGearSix } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import MessageDropdown from '@/components/Message/MessageDropdown.vue'
import Search from '@/components/Search/Search.vue'
import SearchDialog from '@/components/Search/SearchDialog.vue'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/auth'
import SettingsDialog from '@/views/settings/components/SettingsDialog.vue'
import { mockMessages } from '../../../mock/messageData'
import UnifiedSidebarButton from '../Sidebar/UnifiedSidebarButton.vue'

const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const unreadCount = ref(8)
const notifications = ref(mockMessages.notifications)
const messages = ref(mockMessages.messages)
const todos = ref(mockMessages.todos)
const settingsDialogVisible = ref(false) // 弹窗可见性

// ✅ 改成直接绑定 userStore.user
const avatar = computed(() => userStore.user?.avatar || '/default-avatar.png')
const nickname = computed(() => userStore.user?.nickname || userStore.username || t('common.guest'))

function toggleDarkMode() {
  appStore.toggleDarkMode()
}
function changeLanguage(lang: string) {
  appStore.language = lang as 'zh-CN' | 'en'
}
function handleUserCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile/index')
      break
    case 'settings':
      if (appStore.isMobile) {
        router.push('/settings')
      }
      else {
        settingsDialogVisible.value = true
      }
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
function onMessageSelect(payload: { type: string, item: any }) {
  if (payload.type === 'message' && payload.item?.link) {
    router.push(payload.item.link).catch(() => {})
  }
}
function onMarkAllAsRead() {
  unreadCount.value = 0
  notifications.value.forEach(item => (item.read = true))
  messages.value.forEach(item => (item.read = true))
}
</script>

<template>
  <el-header class="top-header">
    <!-- 左侧 -->
    <div class="header-left">
      <UnifiedSidebarButton
        :class="{
          active: appStore.isMobile && appStore.sidebarMobileOpen,
          collapsed: !appStore.isMobile && appStore.isCollapsed,
        }"
      />
    </div>

    <!-- 右侧 -->
    <div class="header-right">
      <!-- 搜索 -->
      <template v-if="!appStore.isMobile">
        <Search
          v-model="appStore.searchValue"
          :is-mobile="appStore.isMobile"
          @navigate="(path) => {
            appStore.searchDialogVisible = false;
            appStore.searchValue = '';
            router.push(path)
          }"
          @toggle-dropdown="(v) => appStore.setDesktopSearchDropdownVisible(v)"
        />
      </template>
      <template v-else>
        <div class="action-item" @click="appStore.searchDialogVisible = true">
          <PhMagnifyingGlass :size="20" />
        </div>
      </template>

      <!-- 国际化 -->
      <el-dropdown @command="changeLanguage">
        <div class="action-item">
          <PhTranslate :size="20" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">
              {{ t('common.zh') }}
            </el-dropdown-item>
            <el-dropdown-item command="en">
              {{ t('common.en') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 明暗模式 -->
      <div class="action-item" @click="toggleDarkMode">
        <PhSun v-if="!appStore.isDarkMode" :size="20" />
        <PhMoon v-else :size="20" />
      </div>

      <!-- 消息 -->
      <MessageDropdown
        :notifications="notifications"
        :messages="messages"
        :todos="todos"
        :unread-count="unreadCount"
        @mark-all-read="onMarkAllAsRead"
        @select="onMessageSelect"
      />

      <!-- 用户 -->
      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="user-avatar">
          <!-- ✅ 直接绑定响应式头像和昵称 -->
          <el-avatar :size="32" :src="avatar" :style="{ border: `2px solid ${appStore.primaryColor}` }" />
          <span class="user-name">{{ nickname }}</span>
          <el-icon><PhCaretDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <PhUserCircle class="dropdown-icon" />
              <span>{{ t('common.profile') }}</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <PhGearSix class="dropdown-icon" />
              <span>{{ t('common.settings') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <PhSignOut class="dropdown-icon" />
              <span>{{ t('common.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 移动搜索弹窗 -->
    <SearchDialog />
    <!-- 桌面 Settings 弹窗 -->
    <SettingsDialog v-model="settingsDialogVisible" />
  </el-header>
</template>

<style lang="scss" scoped>
@use '../../../styles/base/variables.scss' as *;
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: background-color $transition-speed ease;
  border-radius: $border-radius;

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .action-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }
}

// 用户下拉菜单样式
:deep(.el-dropdown-menu) {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;

    .dropdown-icon {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
