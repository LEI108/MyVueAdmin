import type { Charger, ChargingStation } from '@/types/charging-station'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getChargingStations } from '@/api/charging-station'
import { ChargerStatus } from '@/types/charging-station'

export const useChargingStationStore = defineStore('chargingStation', () => {
  /** 📦 所有充电站数据 */
  const stations = ref<ChargingStation[]>([])

  /** 🔄 加载状态 */
  const loading = ref(false)

  /** 📍 当前选中的充电站名称 */
  const selectedStation = ref<string>('')

  /** ⚡ 当前充电桩状态筛选 */
  const selectedStatus = ref<ChargerStatus | 0>(0)

  /** ⚙️ 获取当前选中充电站对象 */
  const currentStation = computed(() =>
    stations.value.find(s => s.name === selectedStation.value),
  )

  /** 🧾 当前显示的充电桩（根据状态过滤） */
  const filteredChargers = computed<Charger[]>(() => {
    if (!currentStation.value)
      return []
    if (selectedStatus.value === 0)
      return currentStation.value.list
    return currentStation.value.list.filter(
      c => c.status === selectedStatus.value,
    )
  })

  /** 📀 各状态数量统计 */
  const statusCount = computed<Record<ChargerStatus, number>>(() => {
    const counts = {
      [ChargerStatus.IDLE]: 0,
      [ChargerStatus.CHARGING]: 0,
      [ChargerStatus.CONNECTING]: 0,
      [ChargerStatus.QUEUING]: 0,
      [ChargerStatus.RESERVED]: 0,
      [ChargerStatus.FAULT]: 0,
    } as Record<ChargerStatus, number>

    if (currentStation.value) {
      currentStation.value.list.forEach((c) => {
        counts[c.status as ChargerStatus]
          = (counts[c.status as ChargerStatus] || 0) + 1
      })
    }
    return counts
  })

  /** ✅ 获取充电站数据 */
  async function fetchStations() {
    try {
      loading.value = true
      const { data } = await getChargingStations()
      stations.value = data
      if (data.length)
        selectedStation.value = data[0].name
    }
    finally {
      loading.value = false
    }
  }

  /** 🧭 切换站点 */
  function setStation(stationName: string) {
    selectedStation.value = stationName
    selectedStatus.value = 0 // 重置状态选择
  }

  /** 🧮 切换状态 */
  function setStatus(status: ChargerStatus | 0) {
    selectedStatus.value = status
  }

  return {
    // state
    stations,
    loading,
    selectedStation,
    selectedStatus,

    // getters
    currentStation,
    filteredChargers,
    statusCount,

    // actions
    fetchStations,
    setStation,
    setStatus,
  }
})
