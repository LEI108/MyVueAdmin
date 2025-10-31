<!-- src/views/settings/components/SettingsMobile.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const menuItems = [
  { key: 'profile', title: t('settings.menu.profile'), path: '/settings/profile' },
  { key: 'system', title: t('settings.menu.system') },
  { key: 'notifications', title: t('settings.menu.notifications') },
  { key: 'security', title: t('settings.menu.security') },
]

function goToMenu(path?: string) {
  if (!path)
    return
  router.push(path)
}
const goBack = () => router.go(-1)
</script>

<template>
  <div class="mobile-settings">
    <!-- 顶部导航 -->
    <div class="mobile-header">
      <el-icon class="back-icon" @click="goBack">
        <PhArrowLeft />
      </el-icon>
      <h1 class="page-title">
        {{ t('common.settings') }}
      </h1>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-list">
      <el-list>
        <el-list-item
          v-for="item in menuItems"
          :key="item.key"
          class="menu-item"
          @click="goToMenu(item.path)"
        >
          <span class="menu-title">{{ item.title }}</span>
          <el-icon class="arrow-right">
            <PhChevronRight />
          </el-icon>
        </el-list-item>
      </el-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-settings {
  .mobile-header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--el-border-color);

    .back-icon {
      margin-right: 12px;
      cursor: pointer;
    }

    .page-title {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .menu-list {
    padding: 10px 0;

    .menu-item {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .menu-title {
        font-size: 16px;
      }
    }
  }
}
</style>
