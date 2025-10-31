import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),
    // 自动按需导入组件（包括 icons）
    Components({
      resolvers: [IconsResolver()],
    }),
    // 图标插件
    Icons({
      compiler: 'vue3',
      autoInstall: true, // 自动安装缺少的图标集
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
