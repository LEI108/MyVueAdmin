<!-- src/components/Message/MessageDropdown.vue -->
<script setup lang="ts">
import type { PropType } from 'vue'
import type { ChatMessageItem, NotificationItem, TodoItem } from '@/types/message/message'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Props: 三类消息项与未读数（全部可选）
const props = defineProps({
  notifications: { type: Array as PropType<NotificationItem[]>, default: () => [] },
  messages: { type: Array as PropType<ChatMessageItem[]>, default: () => [] },
  todos: { type: Array as PropType<TodoItem[]>, default: () => [] },
  unreadCount: { type: Number, default: 0 },
})

// Emits: 命令回调、标记全部已读、点击项
const emit = defineEmits<{
  (e: 'command', cmd: string): void
  (e: 'markAllRead'): void
  (e: 'select', payload: { type: 'notification' | 'message' | 'todo', item: any }): void
}>()

const { t } = useI18n()

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

function formatTime(time?: string) {
  if (!time)
    return ''
  return dayjs(time).format('MM-DD HH:mm')
}

// Tabs labels（本地化）
const tabLabels = {
  notification: safeTranslate('common.notification'),
  message: safeTranslate('common.message'),
  todo: safeTranslate('common.todo'),
}

// local active tab (component internal)
const activeTab = computed(() => 'notification')

// UI handlers that emit to parent
function handleCommand(cmd: string) {
  emit('command', cmd)
}

function handleMarkAll() {
  emit('markAllRead')
}

function handleSelect(type: 'notification' | 'message' | 'todo', item: any) {
  emit('select', { type, item })
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="action-item">
      <el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0">
        <PhBell :size="20" />
      </el-badge>
    </div>

    <template #dropdown>
      <el-dropdown-menu class="message-dropdown">
        <div class="message-header">
          <div class="message-header-left">
            <span>{{ safeTranslate('common.notificationCenter') }}</span>
          </div>
          <div class="message-header-right">
            <el-button link type="primary" @click.prevent="handleMarkAll">
              {{ safeTranslate('common.markAllRead') }}
            </el-button>
          </div>
        </div>

        <el-tabs v-model="activeTab" stretch>
          <el-tab-pane :label="tabLabels.notification" name="notification">
            <div class="message-list">
              <div v-for="item in props.notifications" :key="item.id" class="message-item" @click="handleSelect('notification', item)">
                <div class="message-icon">
                  <PhNotification :size="20" />
                </div>
                <div class="message-content">
                  <div class="message-title">
                    {{ item.title }}
                  </div>
                  <div class="message-desc">
                    {{ item.description }}
                  </div>
                  <div class="message-time">
                    {{ formatTime(item.time) }}
                  </div>
                </div>
              </div>
              <div v-if="props.notifications.length === 0" class="empty-message">
                {{ safeTranslate('common.noNotifications') }}
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="tabLabels.message" name="message">
            <div class="message-list">
              <div v-for="item in props.messages" :key="item.id" class="message-item" @click="handleSelect('message', item)">
                <el-avatar :size="32" :src="item.avatar" class="message-avatar" />
                <div class="message-content">
                  <div class="message-title">
                    {{ item.sender }}
                  </div>
                  <div class="message-desc">
                    {{ item.content }}
                  </div>
                  <div class="message-time">
                    {{ formatTime(item.time) }}
                  </div>
                </div>
              </div>
              <div v-if="props.messages.length === 0" class="empty-message">
                {{ safeTranslate('common.noMessages') }}
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="tabLabels.todo" name="todo">
            <div class="message-list">
              <div v-for="item in props.todos" :key="item.id" class="message-item" @click="handleSelect('todo', item)">
                <div class="message-icon">
                  <PhClipboardText :size="20" />
                </div>
                <div class="message-content">
                  <div class="message-title">
                    {{ item.title }}
                  </div>
                  <div class="message-desc">
                    {{ item.description }}
                  </div>
                  <div class="message-time">
                    {{ formatTime(item.time) }}
                  </div>
                </div>
                <el-tag :type="item.status === 'pending' ? 'warning' : 'success'" size="small">
                  {{ item.status === 'pending' ? safeTranslate('common.pending') : safeTranslate('common.completed') }}
                </el-tag>
              </div>
              <div v-if="props.todos.length === 0" class="empty-message">
                {{ safeTranslate('common.noTodos') }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
@use '../../styles/base/variables.scss' as *;
.message-dropdown {
  padding: 0;
  width: 360px;
  max-height: 70vh;
  overflow: hidden;

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-light);

    span {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .message-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 8px 0;

    .message-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      gap: 12px;
      transition: background-color 0.3s;
      cursor: pointer;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .message-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        flex-shrink: 0;
      }

      .message-avatar {
        flex-shrink: 0;
      }

      .message-content {
        flex: 1;
        overflow: hidden;

        .message-title {
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .message-desc {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-bottom: 4px;
          display: -webkit-box;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .message-time {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }
    }

    .empty-message {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      color: var(--el-text-color-secondary);
    }
  }

  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0;
      padding: 0 16px;
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }

    .el-tabs__item {
      padding: 0 0 12px;
      margin: 0 12px;
    }
  }
}
</style>
