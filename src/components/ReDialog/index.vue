<script setup lang="ts">
import type { ArgsType, ButtonProps, DialogOptions, EventType } from './type'
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill'
import Fullscreen from '~icons/ri/fullscreen-fill'
import { isFunction } from '../../utils/is'
import { closeDialog, dialogStore } from './index'

defineOptions({ name: 'ReDialog' })

/**
 * 初始化弹窗状态（确保每个弹窗有独立的 fullscreen 和 sureBtnLoading）
 * @param options 弹窗配置
 */
function initDialogState(options: DialogOptions) {
  // 初始化全屏状态（优先取 options.fullscreen，默认 false）
  if (options.fullscreen === undefined)
    options.fullscreen = false
  // 初始化确定按钮 loading 状态（默认 false）
  if (options.sureBtnLoading === undefined)
    options.sureBtnLoading = false
}

/**
 * 生成默认底部按钮（取消 + 确定）
 * @param options 弹窗配置
 * @param index 弹窗索引
 */
function getDefaultFooterButtons(options: DialogOptions, index: number): ButtonProps[] {
  return [
    {
      label: '取消',
      text: true,
      bg: true,
      btnClick: () => handleCancel(options, index),
    },
    {
      label: '确定',
      type: 'primary',
      text: true,
      bg: true,
      popconfirm: options.popconfirm,
      btnClick: () => handleSure(options, index),
    },
  ]
}

/** 取消按钮逻辑 */
function handleCancel(options: DialogOptions, index: number) {
  const done = () => closeDialog(options, index, { command: 'cancel' })
  isFunction(options.beforeCancel) ? options.beforeCancel(done, { options, index }) : done()
}

/** 确定按钮逻辑 */
function handleSure(options: DialogOptions, index: number) {
  // 开启 loading（直接修改 options，无需全局 sureBtnMap）
  options.sureBtnLoading = true

  const closeLoading = () => options.sureBtnLoading = false
  const done = () => {
    closeLoading()
    closeDialog(options, index, { command: 'sure' })
  }

  isFunction(options.beforeSure) ? options.beforeSure(done, { options, index, closeLoading }) : done()
}

/** 切换全屏（修改当前弹窗的 options.fullscreen） */
function toggleFullscreen(options: DialogOptions) {
  options.fullscreen = !options.fullscreen
  options.fullscreenCallBack?.({ options, fullscreen: options.fullscreen })
}

/** 触发弹窗事件回调（如 open/close） */
function triggerEvent(options: DialogOptions, index: number, event: EventType) {
  options[event]?.({ options, index })
}
</script>

<template>
  <!-- 遍历弹窗队列，动态渲染每个弹窗 -->
  <el-dialog
    v-for="(options, index) in dialogStore"
    :key="index"
    v-bind="options"
    v-model="options.visible"
    class="pure-dialog"
    :fullscreen="options.fullscreen"
    @closed="triggerEvent(options, index, 'close')"
    @opened="triggerEvent(options, index, 'open')"
    @open-auto-focus="triggerEvent(options, index, 'openAutoFocus')"
    @close-auto-focus="triggerEvent(options, index, 'closeAutoFocus')"
    @mounted="initDialogState(options)"
  >
    <!-- 头部（标题 + 全屏按钮） -->
    <template v-if="options.fullscreenIcon || options.headerRenderer" #header="{ close, titleId, titleClass }">
      <div v-if="options.fullscreenIcon" class="flex items-center justify-between">
        <span :id="titleId" :class="titleClass">{{ options.title }}</span>
        <!-- 全屏切换按钮 -->
        <i
          v-if="!options.fullscreen"
          class="el-icon el-dialog__close -translate-x-2 cursor-pointer hover:text-[red]!"
          @click="toggleFullscreen(options)"
        >
          <IconifyIconOffline
            class="dialog-svg"
            :icon="options.fullscreen ? ExitFullscreen : Fullscreen"
          />
        </i>
      </div>
      <!-- 自定义头部渲染 -->
      <component
        :is="options.headerRenderer?.({ close, titleId, titleClass })"
        v-else
      />
    </template>

    <!-- 内容区域（自定义组件渲染） -->
    <component
      v-bind="options.props"
      :is="options.contentRenderer({ options, index })"
      v-if="options.contentRenderer"
      @close="(args: ArgsType) => closeDialog(options, index, args)"
    />

    <!-- 底部按钮区域 -->
    <template v-if="!options.hideFooter" #footer>
      <!-- 自定义底部渲染 -->
      <component
        :is="options.footerRenderer({ options, index })"
        v-if="options.footerRenderer"
      />
      <!-- 默认底部按钮 -->
      <template v-else>
        <template v-for="(btn, key) in (options.footerButtons || getDefaultFooterButtons(options, index))" :key="key">
          <el-popconfirm
            v-if="btn.popconfirm"
            v-bind="btn.popconfirm"
            @confirm="btn.btnClick"
          >
            <template #reference>
              <el-button v-bind="btn" :loading="key === 1 && options.sureBtnLoading">
                {{ btn.label }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-else
            v-bind="btn"
            :loading="key === 1 && options.sureBtnLoading"
            @click="btn.btnClick"
          >
            {{ btn.label }}
          </el-button>
        </template>
      </template>
    </template>
  </el-dialog>
</template>
