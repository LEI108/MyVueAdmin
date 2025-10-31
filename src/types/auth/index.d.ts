// src/types/auth/index.d.ts
/**
 * 认证相关类型定义
 */

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 用户信息
export interface UserInfo {
  avatar?: string
  nickname?: string
  email?: string
  username: string
  roles: string[]
}

// 用户状态类型
export interface UserState {
  token: string
  roles: string[]
  username: string
  menu: MenuItem[]
  isCollapsed: boolean
}
