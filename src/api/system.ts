import { http } from '@/utils/http'

interface Result {
  success: boolean
  data?: Array<any>
}

interface ResultTable {
  success: boolean
  data?: {
    /** 列表数据 */
    list: Array<any>
    /** 总条目数 */
    total?: number
    /** 每页显示条目个数 */
    pageSize?: number
    /** 当前页数 */
    currentPage?: number
  }
}

/** 获取系统管理-用户管理列表 */
export function getUserList(data?: object) {
  return http.request<ResultTable>('post', '/user', { data })
}

/** 系统管理-用户管理-获取所有角色列表 */
export function getAllRoleList() {
  return http.request<Result>('get', '/list-all-role')
}

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export function getRoleIds(data?: object) {
  return http.request<Result>('post', '/list-role-ids', { data })
}

/** 获取系统管理-角色管理列表 */
export function getRoleList(data?: object) {
  return http.request<ResultTable>('post', '/role', { data })
}

/** 获取系统管理-菜单管理列表 */
export function getMenuList(data?: object) {
  return http.request<Result>('post', '/menu', { data })
}

/** 获取系统管理-部门管理列表 */
export function getDeptList(data?: object) {
  return http.request<Result>('post', '/dept', { data })
}

/** 获取系统监控-在线用户列表 */
export function getOnlineLogsList(data?: object) {
  return http.request<ResultTable>('post', '/online-logs', { data })
}

/** 获取系统监控-登录日志列表 */
export function getLoginLogsList(data?: object) {
  return http.request<ResultTable>('post', '/login-logs', { data })
}

/** 获取系统监控-操作日志列表 */
export function getOperationLogsList(data?: object) {
  return http.request<ResultTable>('post', '/operation-logs', { data })
}

/** 获取系统监控-系统日志列表 */
export function getSystemLogsList(data?: object) {
  return http.request<ResultTable>('post', '/system-logs', { data })
}

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export function getSystemLogsDetail(data?: object) {
  return http.request<Result>('post', '/system-logs-detail', { data })
}

/** 获取角色管理-权限-菜单权限 */
export function getRoleMenu(data?: object) {
  return http.request<Result>('post', '/role-menu', { data })
}

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export function getRoleMenuIds(data?: object) {
  return http.request<Result>('post', '/role-menu-ids', { data })
}
