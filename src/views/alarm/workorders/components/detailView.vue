<script setup lang="ts">
import type { WorkOrderItem } from '../utils/types'

const props = defineProps<{ detail: WorkOrderItem }>()
</script>

<template>
  <div class="detail-container">
    <el-descriptions :title="`工单 ${props.detail.workOrderCode}`" border :column="2">
      <el-descriptions-item label="指派人员">
        {{ props.detail.assignee }}
      </el-descriptions-item>
      <el-descriptions-item label="电话">
        {{ props.detail.assigneePhone }}
      </el-descriptions-item>
      <el-descriptions-item label="工号">
        {{ props.detail.assigneeJobNo }}
      </el-descriptions-item>
      <el-descriptions-item label="类型">
        {{ props.detail.type }}
      </el-descriptions-item>
      <el-descriptions-item label="设备编号">
        {{ props.detail.deviceCode }}
      </el-descriptions-item>
      <el-descriptions-item label="设备地点">
        {{ props.detail.deviceAddress }}
      </el-descriptions-item>
      <el-descriptions-item label="工单描述">
        {{ props.detail.description }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ props.detail.createTime }}
      </el-descriptions-item>
      <el-descriptions-item label="截止时间">
        {{ props.detail.deadline }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        {{ props.detail.status }}
      </el-descriptions-item>
      <el-descriptions-item label="优先级">
        {{ props.detail.priority }}
      </el-descriptions-item>
      <el-descriptions-item label="管理人">
        {{ props.detail.manager }}
      </el-descriptions-item>
      <el-descriptions-item label="完成时间">
        {{ props.detail.finishTime || '未完成' }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 12px;
}
</style>
