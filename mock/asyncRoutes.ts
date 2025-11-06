// mock/asyncRoutes.ts

import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import {
  RouteRank,
} from '@/router/enums'

/**
 * roles：页面级别权限，这里模拟两种角色：
 * admin：管理员角色
 * common：普通角色
 */

// 仪表盘 (Dashboard)
const testRouter = {
  path: '/test',
  meta: {
    icon: 'ph/chart-bar',
    title: 'menus.dashboard',
    rank: RouteRank.TEST,
  },
  children: [
    {
      path: '/test/index',
      name: 'test',
      meta: {
        title: 'menus.test',
        roles: ['admin', 'common'],
      },
    },
  ],
}

// 定义异步路由返回
export default defineFakeRoute([
  {
    url: '/get-async-routes',
    method: 'get',
    response: () => {
      return {
        success: true,
        data: [
          testRouter,
        ],
      }
    },
  },
])
