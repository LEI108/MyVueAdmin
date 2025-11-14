import type { DeviceInfo, DeviceType, MapStatsResponse } from '@/types/map'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createMapDevice, mapJson, mapStats } from '@/api/map'

export const useMapStore = defineStore('mapStore', () => {
  const deviceList = ref<DeviceInfo[]>([])
  const currentType = ref<DeviceType | null>(null)
  const loading = ref(false)

  const stats = ref<MapStatsResponse>({
    countByType: [],
    highestFaultArea: '',
    highestRevenueArea: '',
  })

  async function fetchDevices(type: DeviceType | null = null) {
    try {
      loading.value = true
      currentType.value = type
      const params = type ? { type } : {}
      const { data } = await mapJson(params)
      deviceList.value = data
    }
    catch (err) {
      console.error('设备数据加载失败:', err)
      deviceList.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function changeType(type: DeviceType | null) {
    await fetchDevices(type)
  }

  async function fetchStats() {
    const { data } = await mapStats()
    stats.value = data
  }

  async function addDevice(payload: Omit<DeviceInfo, 'id'>) {
    const res = await createMapDevice(payload)
    if (res.success) {
      await fetchDevices(currentType.value)
      await fetchStats()
    }
  }

  return {
    deviceList,
    currentType,
    loading,
    stats,
    fetchDevices,
    changeType,
    fetchStats,
    addDevice,
  }
})
