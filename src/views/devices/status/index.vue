<script setup lang="ts">
import type { Charger, ChargerStatus, ChargingStation } from '@/types/charging-station'
import { computed, onMounted, ref, watch } from 'vue'
import { getChargingStations } from '@/api/charging-station'
import ChargerList from './components/ChargerList.vue'
import FilterBar from './components/FilterBar.vue'

// ========== 响应式状态 ==========
const stations = ref<ChargingStation[]>([])
const selectedStation = ref<string>('') // 当前选中充电站
const selectedStatus = ref<ChargerStatus | 0>(0) // 当前选中状态
const filteredChargers = ref<Charger[]>([]) // 筛选后充电桩数据
const statusCount = ref<Record<ChargerStatus, number>>() // 状态数量统计
const loading = ref(false) // 加载状态

// ========== 分页相关 ==========
const pageSize = 16
const currentPage = ref(1)

// 当前页的充电桩
const paginatedChargers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredChargers.value.slice(start, end)
})

// 当筛选结果变化时重置页码
watch(filteredChargers, () => {
  currentPage.value = 1
})

// 页码切换事件
function handlePageChange(page: number) {
  currentPage.value = page
}

// ========== 数据加载 ==========
onMounted(async () => {
  loading.value = true
  try {
    const { data } = await getChargingStations()
    stations.value = data
    if (data.length)
      selectedStation.value = data[0].name

    updateFilters()
  }
  catch (e) {
    console.error('加载充电站数据失败：', e)
  }
  finally {
    loading.value = false
  }
})

// ========== 筛选逻辑 ==========
function updateFilters() {
  const current = stations.value.find(s => s.name === selectedStation.value)
  if (!current) {
    filteredChargers.value = []
    statusCount.value = undefined
    return
  }

  // 统计各状态数量
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } as Record<ChargerStatus, number>
  current.list.forEach((ch) => {
    counts[ch.status] = (counts[ch.status] || 0) + 1
  })
  statusCount.value = counts

  // 筛选当前状态
  filteredChargers.value
    = selectedStatus.value === 0
      ? current.list
      : current.list.filter(ch => ch.status === selectedStatus.value)
}

// 监听筛选条件变化
watch([selectedStation, selectedStatus], updateFilters)
</script>

<template>
  <div class="charging-station-container">
    <!-- 顶部筛选栏 -->
    <FilterBar
      v-model="selectedStation"
      v-model:selected-status="selectedStatus"
      :stations="stations"
      :status-count="statusCount"
    />

    <!-- 充电桩列表 + 分页 -->
    <div class="mt-4">
      <ChargerList
        :chargers="paginatedChargers"
        :loading="loading"
      />

      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="filteredChargers.length"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
