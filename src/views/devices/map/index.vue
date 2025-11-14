<script setup lang="ts">
import type { DeviceInfo } from '@/types/map'
import { onMounted, ref } from 'vue'
import batteryIcon from '@/assets/devices/battery.png'
import chargerIcon from '@/assets/devices/charger.png'
import inverterIcon from '@/assets/devices/inverter.png'
import pvIcon from '@/assets/devices/panel.png'
import ReCol from '@/components/ReCol'
import { ReMap } from '@/components/ReMap/index'
import { useMapStore } from '@/store/modules/map'
import { NewDeviceCard, StatsCard } from './components/index'

defineOptions({
  name: 'MapPage',
})
const mapStore = useMapStore()
const selectedType = ref(null) // 当前筛选类型

// 初始化加载全部设备
onMounted(() => {
  mapStore.fetchDevices()
  mapStore.fetchStats()
})

// 切换设备类型
function handleTypeChange(type) {
  mapStore.changeType(type)
}

async function handleAddDevice(payload: Omit<DeviceInfo, 'id'>) {
  await mapStore.addDevice(payload) // 调用 store 中的添加设备方法
}
// 图标映射（传递给地图组件）
const iconMap = { pv: pvIcon, battery: batteryIcon, charger: chargerIcon, inverter: inverterIcon }
</script>

<template>
  <el-row :gutter="24" justify="space-around">
    <!-- 地图 -->
    <ReCol
      v-motion
      class="mb-[18px]"
      :value="18"
      :md="18"
      :sm="18"
      :xs="24"
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
    >
      <el-card class="line-card" shadow="never">
        <ReMap
          :points="mapStore.deviceList"
          :icon-map="iconMap"
          :device-type="mapStore.currentType"
        />
      </el-card>
    </ReCol>

    <!-- 筛选和统计 -->
    <ReCol
      v-motion
      class="mb-[18px]"
      :value="6"
      :md="6"
      :sm="6"
      :xs="24"
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
    >
      <el-row :gutter="28" justify="space-around">
        <ReCol
          v-motion
          class="mb-[18px]"
          :value="24"
          :md="6"
          :sm="6"
          :xs="24"
          :initial="{ opacity: 0, y: 100 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
        >
          <el-card class="line-card" shadow="never">
            <el-select
              v-model="selectedType"
              placeholder="选择设备类型"
              @change="handleTypeChange"
            >
              <el-option label="全部设备" :value="null" />
              <el-option label="光伏板" value="pv" />
              <el-option label="储能电池" value="battery" />
              <el-option label="充电桩" value="charger" />
              <el-option label="逆变器" value="inverter" />
            </el-select>
          </el-card>
        </ReCol>

        <ReCol
          v-motion
          class="mb-[18px]"
          :value="24"
          :md="24"
          :sm="24"
          :xs="24"
          :initial="{ opacity: 0, y: 100 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
        >
          <el-card class="line-card" shadow="never">
            <StatsCard :stats="mapStore.stats" :loading="mapStore.loading" />
          </el-card>
        </ReCol>

        <ReCol
          v-motion
          class="mb-[18px]"
          :value="24"
          :md="24"
          :sm="24"
          :xs="24"
          :initial="{ opacity: 0, y: 100 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
        >
          <el-card class="line-card" shadow="never">
            <NewDeviceCard @submit="handleAddDevice" />
          </el-card>
        </ReCol>
      </el-row>
    </ReCol>
  </el-row>
</template>

<style scoped>
.main-content {
  margin: 20px 20px 0 !important;
}
:deep(.el-card) {
  --el-card-border-color: none;

  .el-progress--line { width: 85%; }
  .el-progress-bar__innerText { font-size: 15px; }
  .el-scrollbar__bar { display: none; }
}
</style>
