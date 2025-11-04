<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import UniversalDialog from '@/components/Common/ReDialog/UniversalDialog.vue'
import SettingsProfile from '@/views/settings/components/SettingsProfile.vue'

// 接收父组件传递的 v-model
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const { t } = useI18n()

// 本地可修改的 visible 状态，代理 props.modelValue
const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))

// 菜单列表
const menuItems = computed(() => [
  {
    key: 'profile',
    title: t('settings.menu.profile'),
    component: SettingsProfile,
  },
  { key: 'system', title: t('settings.menu.system') },
  { key: 'notifications', title: t('settings.menu.notifications') },
  { key: 'security', title: t('settings.menu.security') },
])

// 当前激活菜单
const activeMenu = ref('profile')

// 动态渲染子组件
const ActiveComponent = computed(() => {
  const item = menuItems.value.find(i => i.key === activeMenu.value)
  return item?.component || { render: () => h('div', '开发中...') }
})
</script>

<template>
  <UniversalDialog
    v-model="visible"
    :title="t('common.settings')"
    width="80%"
    max-width="1000px"
  >
    <div class="settings-container">
      <!-- 左侧菜单 -->
      <div class="settings-sidebar">
        <h2 class="sidebar-title">
          {{ t('common.settings') }}
        </h2>
        <el-menu
          :default-active="activeMenu"
          class="settings-menu"
          @select="(key: string) => activeMenu = key"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.key"
            :index="item.key"
          >
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容 -->
      <div class="settings-content">
        <component :is="ActiveComponent" />
      </div>
    </div>
  </UniversalDialog>
</template>

<style lang="scss" scoped>
.settings-container {
  display: flex;
  gap: 20px;
  min-height: 500px;

  .settings-sidebar {
    width: 260px;
    padding: 20px 0;
    border-right: 1px solid var(--el-border-color);

    .sidebar-title {
      padding: 0 20px 20px;
      margin: 0 0 10px;
      border-bottom: 1px solid var(--el-border-color);
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    .settings-menu {
      border-right: none;

      .el-menu-item {
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        padding-left: 30px;
      }
    }
  }

  .settings-content {
    flex: 1;
    padding: 20px;
  }
}
</style>
