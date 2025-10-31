// src/router/guard.ts
import { useUserStore } from '@/store/auth'
import router from './index'

router.beforeEach((to) => {
  const userStore = useUserStore()

  // 白名单路由直接放行
  const whiteList = ['/login', '/notfound']
  if (whiteList.includes(to.path)) {
    if (to.path === '/login' && userStore.token) {
      return { path: '/' } // 已登录则跳首页
    }
    return true
  }

  // 未登录重定向到登录页
  if (!userStore.token) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }, // 保存目标路径用于登录后重定向
    }
  }

  // 权限检查
  if (to.meta.needAuth && !userStore.roles.some((role: string) =>
    (to.meta.needAuth as string[]).includes(role))
  ) {
    return { path: '/notfound' } // 无权限跳404
  }

  return true
})
