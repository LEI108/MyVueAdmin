<script setup lang="ts">
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { useAlarmLite } from './utils/useAlarmLite'

const {
  loading,
  columns,
  Empty,
  pagedData,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange,
  handleSelectionChange,
} = useAlarmLite()
</script>

<template>
  <pure-table
    row-key="id"
    align-whole="center"
    show-overflow-tooltip
    table-layout="auto"
    :loading="loading"
    :loading-config="loadingConfig"
    :data="pagedData"
    :columns="columns"
    :pagination="pagination"
    max-height="455px"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)',
    }"
    @page-size-change="onSizeChange"
    @page-current-change="onCurrentChange"
    @selection-change="handleSelectionChange"
  >
    <template #empty>
      <el-empty description="暂无告警数据" :image-size="60">
        <template #image>
          <Empty class="w-24 h-24 opacity-50" />
        </template>
      </el-empty>/>
    </template>
    <template #operation="{ row }">
      <el-button
        plain
        circle
        size="small"
        :title="`查看序号为${row.id}的详情`"
        :icon="useRenderIcon('ri:search-line')"
      />
    </template>
  </pure-table>
</template>
