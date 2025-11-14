<script setup lang="ts">
import { useDark } from '@pureadmin/utils'
import { ref } from 'vue'
import ReCol from '@/components/ReCol'
import { ReNormalCountTo } from '@/components/ReCountTo/index'
import Segmented from '@/components/ReSegmented'
import { ChartArea, ChartLine, ChartRound, ChartWaveBall } from './components/charts/index'

import {
  carbonAnalysisData,
  generationData,
  generationPercent,
  realTimePowerData,
  totalGenerationData,
  xLabels,
} from './data'

defineOptions({
  name: 'EnergyAnalysis',
})

const { isDark } = useDark()

// 切换 日/周/月
const curPeriod = ref(0)
const periodOptions = [
  { label: '日' },
  { label: '周' },
  { label: '月' },
]
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <!-- 累计发电量与进度 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="8"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex flex-col justify-center items-center">
            <span class="text-md font-medium">累计发电量与进度</span>
            <!-- 波浪进度球颜色适配 -->
            <ChartWaveBall :percent="Number(generationPercent)" :color="isDark ? '#66ccff' : '#41b6ff'" />
          </div>
        </el-card>
      </ReCol>
      <!-- 两个信息小卡片 -->
      <ReCol
        v-for="(item, index) in totalGenerationData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="8"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1),
          },
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor,
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
                height="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                font-size="1.6em"
                :start-val="100"
                :end-val="item.value"
              />
              <p class="font-medium text-green-500">
                {{ item.percent }}
              </p>
            </div>
          </div>
        </el-card>
      </ReCol>

      <!-- 日周月发电量 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="12"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 80 } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">日周月发电量</span>
            <!-- 图标背景适配 -->
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{ backgroundColor: isDark ? 'transparent' : '#effaff' }"
            >
              <IconifyIconOffline icon="solar:energy-bold" color="#41b6ff" width="18" height="18" />
            </div>
            <Segmented v-model="curPeriod" :options="periodOptions" />
          </div>
          <ChartArea
            class="mt-3"
            :color="isDark ? '#66ccff' : '#41b6ff'"
            :x-labels="curPeriod === 0 ? xLabels.day : curPeriod === 1 ? xLabels.week : xLabels.month"
            :data="curPeriod === 0 ? generationData.day : curPeriod === 1 ? generationData.week : generationData.month"
            series-name="发电量"
          />
        </el-card>
      </ReCol>

      <!-- 24小时实时功率 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="12"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 160 } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">24小时实时功率</span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{ backgroundColor: isDark ? 'transparent' : '#e6fff5' }"
            >
              <IconifyIconOffline icon="mdi:chart-line" color="#26ce83" width="18" height="18" />
            </div>
          </div>
          <ChartArea
            class="mt-3"
            :color="isDark ? '#66e0a8' : '#26ce83'"
            :x-labels="xLabels.day"
            :data="realTimePowerData"
            series-name="功率"
          />
        </el-card>
      </ReCol>

      <!-- 设备负荷 -->
      <!-- <ReCol
        v-motion
        class="mb-[18px]"
        :value="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 320 } }"
      >
        <el-card shadow="never" :style="{ backgroundColor: isDark ? 'transparent' : '#ffffff' }">
          <div class="flex justify-between">
            <span class="text-md font-medium">设备负荷</span>
          </div>
          <ChartBarEquip class="mt-3" :data="equipmentLoadData" />
        </el-card>
      </ReCol> -->

      <!-- 碳排分析 -->
      <ReCol
        v-for="(item, index) in carbonAnalysisData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="8"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1),
          },
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor,
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
                height="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                font-size="1.6em"
                :start-val="100"
                :end-val="item.value"
              />
              <p class="font-medium text-green-500">
                {{ item.percent }}
              </p>
            </div>
            <ChartLine
              v-if="item.data.length > 1"
              class="w-1/2!"
              :color="item.color"
              :data="item.data"
            />
            <ChartRound v-else class="w-1/2!" />
          </div>
        </el-card>
      </ReCol>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  .el-progress--line { width: 85%; }
  .el-progress-bar__innerText { font-size: 15px; }
  .el-scrollbar__bar { display: none; }
}
</style>
