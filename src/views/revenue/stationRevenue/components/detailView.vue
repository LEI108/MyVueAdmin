<script setup lang="ts">
import type { StationRevenueItem } from '../utils/types'

const props = defineProps<{ detail: StationRevenueItem }>()
</script>

<template>
  <div class="detail-container">
    <el-descriptions :title="`充电站详情 - ${props.detail.stationCode}`" border :column="2">
      <el-descriptions-item label="充电站编号">
        {{ props.detail.stationCode }}
      </el-descriptions-item>
      <el-descriptions-item label="充电站名称">
        {{ props.detail.stationName }}
      </el-descriptions-item>
      <el-descriptions-item label="充电站地址">
        {{ props.detail.stationAddress }}
      </el-descriptions-item>
      <el-descriptions-item label="运营状态">
        {{ props.detail.status === 1 ? '正常运营' : props.detail.status === 2 ? '维护中' : '暂停服务' }}
      </el-descriptions-item>
      <el-descriptions-item label="充电桩数量">
        {{ props.detail.chargerCount }}
      </el-descriptions-item>
      <el-descriptions-item label="单日收入">
        {{ props.detail.dailyRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="月度收入">
        {{ props.detail.monthlyRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="电费营收">
        {{ props.detail.electricityRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="停车费营收">
        {{ props.detail.parkingRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="服务费营收">
        {{ props.detail.serviceRevenue }}
      </el-descriptions-item>
      <el-descriptions-item label="其他收入">
        {{ props.detail.otherRevenue }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 12px;
}
</style>
