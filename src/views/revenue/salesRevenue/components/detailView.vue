<script setup lang="ts">
import type { SalesRevenueItem } from '../utils/types'

const props = defineProps<{ detail: SalesRevenueItem }>()
</script>

<template>
  <div class="detail-container">
    <el-descriptions :title="`售电营收详情 - ${props.detail.date}`" border :column="2">
      <el-descriptions-item label="日期">
        {{ props.detail.date }}
      </el-descriptions-item>
      <el-descriptions-item label="峰段电价">
        {{ props.detail.peakPrice }}
      </el-descriptions-item>
      <el-descriptions-item label="谷段电价">
        {{ props.detail.valleyPrice }}
      </el-descriptions-item>
      <el-descriptions-item label="平段电价">
        {{ props.detail.flatPrice }}
      </el-descriptions-item>
      <el-descriptions-item label="平均电价">
        {{ props.detail.averagePrice }}
      </el-descriptions-item>
      <el-descriptions-item label="售电收入">
        {{ props.detail.salesRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="补贴收入">
        {{ props.detail.subsidyRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="总营收">
        {{ props.detail.totalRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="运维成本">
        {{ props.detail.omCost }}
      </el-descriptions-item>
      <el-descriptions-item label="净利润">
        {{ props.detail.netProfit }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 12px;
}
</style>
