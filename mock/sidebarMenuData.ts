// src/mock/sidebarMenuData.ts
import Mock from 'mockjs'

Mock.setup({
  timeout: '200-600',
})

Mock.mock('https://www.demo.com/login', 'post', (options: any) => {
  const { username, password } = JSON.parse(options.body)
  if (username === 'admin' && password === 'admin666') {
    return {
      code: 200,
      message: '登陆成功',
      data: {
        token: 'admintoken',
        user: { username: 'LEI', roles: ['admin'] },
      },
    }
  }
  else if (username === 'user' && password === 'user666') {
    return {
      code: 200,
      message: '登陆成功',
      data: {
        token: 'usertoken',
        user: { username: 'LLL', roles: ['user'] },
      },
    }
  }
  else {
    return {
      code: 401,
      message: '用户名或者密码有误',
    }
  }
})
