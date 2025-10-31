<!-- src/components/Search/SearchDialog.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Search from '@/components/Search/Search.vue'
import { useAppStore } from '@/store/app'

const { t } = useI18n()
const appStore = useAppStore()
const router = useRouter()

// 容错翻译 保证传入 t 的总是字符串或返回空字符串，并捕获异常
function safeTranslate(key: unknown) {
  try {
    if (key == null || key === '')
      return ''
    if (typeof key === 'string')
      return t(key)
    return String(key)
  }
  catch {
    return String(key ?? '')
  }
}

function navigateToRoute(path: string) {
  appStore.searchDialogVisible = false
  appStore.searchValue = ''
  router.push(path).catch(() => {})
}
</script>

<template>
  <el-dialog
    v-model="appStore.searchDialogVisible"
    :title="t('common.search')"
    :fullscreen="appStore.isMobile"
    width="80%"
    top="5vh"
    class="search-dialog"
  >
    <div class="search-dialog-content">
      <!-- 重用 Search 组件（移动端模式） -->
      <Search
        v-model="appStore.searchValue"
        :is-mobile="true"
        @navigate="(path) => { navigateToRoute(path) }"
      />

      <!-- 搜索结果区域（移动端，Search 组件 会填充 appStore.searchResults） -->
      <div class="search-results" style="margin-top:12px;">
        <div v-if="appStore.searchResults.length > 0" class="results-list">
          <div
            v-for="item in appStore.searchResults"
            :key="item.path"
            class="result-item"
            @click="navigateToRoute(item.path)"
          >
            <div class="result-title">
              {{ safeTranslate(item.title) }}
            </div>
          </div>
        </div>

        <div v-else-if="appStore.searchValue" class="empty-results">
          <img
            src="https://pure-admin.github.io/vue-pure-admin/images/noData.7d41a33b.svg"
            :alt="t('common.noResults')"
            class="empty-image"
          >
          <p class="empty-text">
            {{ t('common.noResults') }}
          </p>
        </div>

        <div v-else class="initial-state">
          <img
            src="https://pure-admin.github.io/vue-pure-admin/images/search.b3c4e3ae.svg"
            :alt="t('common.search')"
            class="initial-image"
          >
          <p class="initial-text">
            {{ t('common.searchHint') }}
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
// 搜索弹窗样式
.search-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &.header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--el-border-color-light);
      margin: 0;
    }

    &.body {
      padding: 0;
    }
  }

  .search-dialog-content {
    display: flex;
    flex-direction: column;
    height: 70vh;

    .dialog-search-input {
      padding: 16px;
      border-bottom: 1px solid var(--el-border-color-light);

      :deep(.el-input__wrapper) {
        border-radius: 20px;
        background-color: var(--el-fill-color-light);
        box-shadow: none;
        height: 24px;
        padding: 0 16px;

        &:hover {
          background-color: var(--el-fill-color);
        }
      }
    }

    .search-results {
      flex: 1;
      overflow-y: auto;
      padding: 0 16px;

      .results-list {
        padding: 8px 0;

        .result-item {
          padding: 12px 0;
          border-bottom: 1px solid var(--el-border-color-lighter);
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: var(--el-fill-color-light);
          }

          .result-title {
            font-weight: 500;
            color: var(--el-text-color-primary);
          }
        }
      }

      .empty-results, .initial-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        .empty-image, .initial-image {
          width: 200px;
          height: 200px;
          opacity: 0.6;
        }

        .empty-text, .initial-text {
          margin-top: 16px;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
      }
    }
  }
}
</style>
