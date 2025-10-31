import type { ArgsType, ButtonProps, DialogOptions, DialogProps, EventType } from './type'
import { useTimeoutFn } from '@vueuse/core'
// src/components/ReDialog/index.ts
import { ref } from 'vue'
import ReDialogVue from './index.vue'

const dialogStore = ref<Array<DialogOptions>>([])

/** 打开弹框 */
function addDialog(options: DialogOptions) {
  const open = () => dialogStore.value.push({ ...options, visible: true })
  options?.openDelay
    ? useTimeoutFn(open, options.openDelay)
    : open()
}

/** 关闭弹框 */
function closeDialog(options: DialogOptions, index: number, args?: any) {
  dialogStore.value[index].visible = false
  options.closeCallBack?.({ options, index, args })
  useTimeoutFn(() => dialogStore.value.splice(index, 1), options?.closeDelay ?? 200)
}

/** 更新弹框属性值 */
function updateDialog<K extends keyof DialogOptions>(
  value: DialogOptions[K],
  key: K = 'title' as K,
  index = 0,
) {
  if (dialogStore.value[index]) {
    dialogStore.value[index][key] = value
  }
}

/** 关闭所有弹框 */
function closeAllDialog() {
  dialogStore.value = []
}

export const ReDialog = ReDialogVue
export {
  addDialog,
  closeAllDialog,
  closeDialog,
  dialogStore,
  updateDialog,
}
export type { ArgsType, ButtonProps, DialogOptions, DialogProps, EventType }
