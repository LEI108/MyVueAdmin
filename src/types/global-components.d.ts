declare module 'vue' {
  /**
   * 自定义全局组件获得 Volar 提示（自定义的全局组件需要在这里声明下才能获得 Volar 类型提示哦）
   */
  export interface GlobalComponents {
    IconifyIconOffline: (typeof import('../src/components/ReIcon'))['IconifyIconOffline']
    IconifyIconOnline: (typeof import('../src/components/ReIcon'))['IconifyIconOnline']
    Auth: (typeof import('../src/components/ReAuth'))['Auth']
    Perms: (typeof import('../src/components/RePerms'))['Perms']
  }
}

/**
 * TODO https://github.com/element-plus/element-plus/blob/dev/global.d.ts#L2
 * No need to install @vue/runtime-core
 */
declare module 'vue' {

  interface ComponentCustomProperties {
    $storage: ResponsiveStorage
    $message: (typeof import('element-plus'))['ElMessage']
    $notify: (typeof import('element-plus'))['ElNotification']
    $msgbox: (typeof import('element-plus'))['ElMessageBox']
    $messageBox: (typeof import('element-plus'))['ElMessageBox']
    $alert: (typeof import('element-plus'))['ElMessageBox']['alert']
    $confirm: (typeof import('element-plus'))['ElMessageBox']['confirm']
    $prompt: (typeof import('element-plus'))['ElMessageBox']['prompt']
    $loading: (typeof import('element-plus'))['ElLoadingService']
  }
}

export {}
