<script setup lang="ts">
import { ref } from 'vue'
import Delete from '~icons/ep/delete'
import EditPen from '~icons/ep/edit-pen'
import Refresh from '~icons/ep/refresh'
import AddFill from '~icons/ri/add-circle-line'
import Assign from '~icons/ri/send-plane-fill'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { PureTableBar } from '@/components/RePureTableBar'
import { useAlarm } from './utils/hook'

defineOptions({ name: 'AlarmManage' })

const formRef = ref()
const tableRef = ref()
const { form, loading, columns, dataList, onSearch, resetForm, openDialog, handleDelete, handleSelectionChange, openAssignDialog } = useAlarm()

function onFullscreen() {
  tableRef.value.setAdaptive()
}
</script>

<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-form ref="formRef" :inline="true" :model="form" class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto">
      <el-form-item label="设备编号：" prop="deviceCode">
        <el-input v-model="form.deviceCode" placeholder="请输入设备编号" clearable class="w-[180px]!" />
      </el-form-item>
      <el-form-item label="处理状态：" prop="status">
        <el-select v-model="form.status" placeholder="请选择处理状态" clearable class="w-[180px]!">
          <el-option label="待指派" :value="1" />
          <el-option label="处理中" :value="2" />
          <el-option label="处理完毕" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon('ri/search-line')" :loading="loading" @click="onSearch">
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <PureTableBar title="告警管理" :columns="columns" :table-ref="tableRef?.getTableRef()" @refresh="onSearch" @fullscreen="onFullscreen">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDialog()">
          新增故障
        </el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef" adaptive :adaptive-config="{ offsetBottom: 45 }" align-whole="center" row-key="id" show-overflow-tooltip table-layout="auto" default-expand-all
          :loading="loading" :size="size" :data="dataList" :columns="dynamicColumns" :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)',
          }"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Assign)"
              @click="openAssignDialog(row)"
            >
              指派
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('编辑', row)"
            >
              编辑
            </el-button>
            <el-popconfirm title="确认删除该告警吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
