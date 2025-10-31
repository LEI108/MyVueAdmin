// src/vite-env.d.ts
/// <reference types="vite/client" />
declare module 'mockjs'
declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const component: ComponentOptions
  export default component
}
