// src/types/message/message.d.ts
/**
 * 消息相关类型定义
 */

export interface NotificationItem {
  id: number | string
  title: string
  description?: string
  time?: string // ISO 或可被 dayjs 解析的字符串
  read?: boolean
  link?: string // 可选跳转链接或路由 path
}

export interface ChatMessageItem {
  id: number | string
  sender?: string
  avatar?: string
  content?: string
  time?: string
  read?: boolean
  link?: string
}

export type TodoStatus = 'pending' | 'completed' | string

export interface TodoItem {
  id: number | string
  title: string
  description?: string
  time?: string
  status?: TodoStatus
  link?: string
}

/**
 * 便捷联合类型与整体数据结构
 */
export type MessageItem = NotificationItem | ChatMessageItem | TodoItem

export interface MessageData {
  notifications: NotificationItem[]
  messages: ChatMessageItem[]
  todos: TodoItem[]
}
