import type { Directive } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import VueTippy from 'vue-tippy'
// 全局注册按钮级别权限组件
import { Auth } from '@/components/ReAuth/index'
import { Perms } from '@/components/RePerms/index'
import { useElementPlus } from '@/plugins/elementPlus'
import { useI18n } from '@/plugins/i18n'
import { setupStore } from '@/store'
import { injectResponsiveStorage } from '@/utils/responsive'
// import { useEcharts } from "@/plugins/echarts";

import App from './App.vue'
// 全局注册@iconify/vue图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
} from './components/ReIcon'

import { getPlatformConfig } from './config'

// 自定义指令
import * as directives from './directives'

import router from './router'
import './styles/index.scss'
import './styles/utils/tailwind.css'

import 'element-plus/dist/index.css'
// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'

const app = createApp(App)
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})
app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
app.component('Auth', Auth)
app.component('Perms', Perms)

app.use(VueTippy)

getPlatformConfig(app).then(async (config) => {
  setupStore(app)
  app.use(router)
  await router.isReady()
  injectResponsiveStorage(app, config)
  app
    .use(MotionPlugin)
    .use(useI18n)
    .use(useElementPlus)
    // .use(Table)
    // .use(useVxeTable)
    // .use(PureDescriptions)
    // .use(useEcharts);
  app.mount('#app')
})
