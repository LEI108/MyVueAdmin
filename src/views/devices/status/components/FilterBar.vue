<script setup lang="ts">
import type { ChargerStatus, ChargingStation, StatusFilter } from '@/types/charging-station'
import { computed } from 'vue'

const props = defineProps<{
  stations: ChargingStation[]
  modelValue?: string
  selectedStatus: ChargerStatus | 0
  statusCount?: Record<ChargerStatus, number>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', stationName: string): void
  (e: 'update:selectedStatus', status: ChargerStatus | 0): void
}>()

// 内部代理 computed，让 v-model 能双向更新
const internalStation = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const internalStatus = computed({
  get: () => props.selectedStatus,
  set: val => emit('update:selectedStatus', val),
})

// 状态筛选配置
const statusFilters: StatusFilter[] = [
  { label: '全部', value: 0, color: '#606266' },
  { label: '空闲中', value: 1, color: '#41b6ff' },
  { label: '充电中', value: 2, color: '#26ce83' },
  { label: '连接中', value: 3, color: '#ff9f40' },
  { label: '排队中', value: 4, color: '#ffb400' },
  { label: '已预约', value: 5, color: '#722ed1' },
  { label: '故障/离线', value: 6, color: '#f56c6c' },
]
</script>

<template>
  <el-card shadow="never" class="filter-bar-card">
    <div class="filter-bar">
      <!-- 充电站选择 -->
      <el-select
        v-model="internalStation"
        placeholder="选择充电站"
        filterable
        style="width: 260px"
      >
        <el-option
          v-for="station in stations"
          :key="station.id"
          :label="station.name"
          :value="station.name"
        />
      </el-select>

      <!-- 状态过滤区 -->
      <el-radio-group
        v-model="internalStatus"
        size="large"
        class="ml-6"
      >
        <el-radio-button
          v-for="filter in statusFilters"
          :key="filter.value"
          :label="filter.value"
          :value="filter.value"
        >
          <span :style="{ color: filter.color }">
            {{
              filter.label === "全部"
                ? `全部(${Object.values(statusCount || {}).reduce((a, b) => a + b, 0)})`
                : `${filter.label}(${statusCount?.[filter.value as ChargerStatus] ?? 0})`
            }}
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.filter-bar-card {
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
