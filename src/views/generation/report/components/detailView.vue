<script setup lang="ts">
import type { PowerReportItem } from '../utils/types'

const props = defineProps<{ detail: PowerReportItem }>()
</script>

<template>
  <div class="detail-container">
    <el-descriptions :title="`报表日期 ${props.detail.date}`" border :column="2">
      <el-descriptions-item label="电站编号">
        {{ props.detail.stationCode }}
      </el-descriptions-item>
      <el-descriptions-item label="总发电量(kWh)">
        {{ props.detail.totalGeneration }}
      </el-descriptions-item>
      <el-descriptions-item label="并网发电量(kWh)">
        {{ props.detail.gridGeneration }}
      </el-descriptions-item>
      <el-descriptions-item label="自用电量(kWh)">
        {{ props.detail.selfUseGeneration }}
      </el-descriptions-item>
      <el-descriptions-item label="电量损耗(kWh)">
        {{ props.detail.powerLoss }}
      </el-descriptions-item>
      <el-descriptions-item label="峰段电量(kWh)">
        {{ props.detail.peakGeneration }}
      </el-descriptions-item>
      <el-descriptions-item label="谷段电量(kWh)">
        {{ props.detail.valleyGeneration }}
      </el-descriptions-item>
      <el-descriptions-item label="平段电量(kWh)">
        {{ props.detail.flatGeneration }}
      </el-descriptions-item>
      <el-descriptions-item label="设备运行效率(%)">
        {{ props.detail.efficiency }}
      </el-descriptions-item>
      <el-descriptions-item label="设备利用率(小时)">
        {{ props.detail.utilizationHours }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 12px;
}
</style>
