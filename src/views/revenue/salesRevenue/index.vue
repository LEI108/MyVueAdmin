<script setup lang="ts">
import { ref } from 'vue'
import Delete from '~icons/ep/delete'
import EditPen from '~icons/ep/edit-pen'
import Refresh from '~icons/ep/refresh'
import ViewIcon from '~icons/ep/view'
import AddFill from '~icons/ri/add-circle-line'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { PureTableBar } from '@/components/RePureTableBar'
import { getPickerShortcuts } from './utils/getPickerShortcuts'
import { useSalesRevenue } from './utils/hook'

defineOptions({ name: 'SalesRevenueManage' })

const formRef = ref()
const tableRef = ref()

const {
  form,
  loading,
  columns,
  pagedData,
  onExport,
  onSearch,
  resetForm,
  openDialog,
  openViewDialog,
  handleDelete,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange,
  handleSelectionChange,
} = useSalesRevenue()

function onFullscreen() {
  tableRef.value.setAdaptive()
}
</script>

<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="日期" prop="timeRange">
        <el-date-picker
          v-model="form.timeRange"
          :shortcuts="getPickerShortcuts()"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期时间"
          end-placeholder="结束日期时间"
        />
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
    <PureTableBar
      title="售电营收报表"
      :columns="columns"
      :table-ref="tableRef?.getTableRef()"
      @refresh="onSearch"
      @fullscreen="onFullscreen"
    >
      <template #buttons>
        <el-button type="primary" @click="onExport">
          导出
        </el-button>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDialog('新增')">
          新增报表
        </el-button>
      </template>

      <template #default="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="id"
          adaptive
          :adaptive-config="adaptiveConfig"
          align-whole="center"
          show-overflow-tooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :loading-config="loadingConfig"
          :size="size"
          :data="pagedData"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)',
          }"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
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

            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(ViewIcon)"
              @click="openViewDialog(row)"
            >
              查看
            </el-button>

            <el-popconfirm title="确认删除该报表吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
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
