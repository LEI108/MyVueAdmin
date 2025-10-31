import { MotionPlugin } from '@vueuse/motion'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { installI18n } from '@/plugins/i18n'
import { useUserStore } from '@/store/auth'

import App from './App.vue'
// 全局注册@iconify/vue图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
} from './components/ReIcon'
import router from './router/index'
import './styles/main.scss'
import './mock/sidebarMenuData'
import 'element-plus/dist/index.css'
import '@/router/guard'

const app = createApp(App)
const pinia = createPinia()
installI18n(app)
app.use(pinia)

const storedRoles = sessionStorage.getItem('roles')
if (storedRoles) {
  try {
    const roles = JSON.parse(storedRoles) as string[]
    if (roles.length) {
      const userStore = useUserStore()
      userStore.roles = roles
      userStore.restoreSession() // 生成菜单 + 动态路由
    }
  }
  catch (e) {
    console.error('Failed to restore session', e)
  }
}

;(window as any).router = router
app.use(router)
app.use(MotionPlugin)
app.use(ElementPlus)
app.mount('#app')
app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
