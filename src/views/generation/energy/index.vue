<script setup lang="ts">
import { computed, ref } from 'vue'
import PhChartBar from '~icons/ph/chart-bar'
import PhChartLine from '~icons/ph/chart-line'
import PhChartPieSlice from '~icons/ph/chart-pie-slice'
import Users from '~icons/ph/users'
import ReCol from '@/components/ReCol'
// import { ReNormalCountTo } from '@/components/ReCountTo/index'
import Segmented from '@/components/ReSegmented'

import { ChartAreaStacked, ChartBarHorizontal, ChartPieStructure, ChartStackedBar } from './components/charts/index'
import {
  barHorizontalData,
  energyTypes,
  generationDataQuarter,
  pieData,
  stackedBarData,
  xLabelsQuarter,
  years,
} from './data'

import { useDark } from './utils'

defineOptions({
  name: 'EnergyAnalysis',
})
// 当前年份索引
const curYearIndex = ref(0)
const periodOptions = years.map(y => ({ label: y }))

const { isDark } = useDark()
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <!-- 温州市各区总产能 -->
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
            <span class="text-md font-medium">温州市各区总产能</span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : '#ffffff',
              }"
            >
              <IconifyIconOffline :icon="PhChartBar" color="#41b6ff" width="24" height="24" />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartBarHorizontal :data="barHorizontalData" unit="MWh" />
          </div>
        </el-card>
      </ReCol>

      <!-- 温州市产能结构（光伏 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="12"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 240 } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">温州市产能结构</span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : '#ffffff',
              }"
            >
              <IconifyIconOffline :icon="PhChartPieSlice" color="#FF9A2E" width="24" height="24" />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartPieStructure :data="pieData" unit="MWh" />
          </div>
        </el-card>
      </ReCol>

      <!-- 各区产能构成 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="12"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 320 } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">各区产能构成</span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : '#ffffff',
              }"
            >
              <IconifyIconOffline :icon="PhChartBar" color="#41b6ff" width="24" height="24" />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartStackedBar :data="stackedBarData" :types="energyTypes" unit="MWh" />
          </div>
        </el-card>
      </ReCol>

      <!-- 季度产能趋势 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="12"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">季度产能趋势</span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : '#ffffff',
              }"
            >
              <IconifyIconOffline :icon="PhChartLine" color="#37D4CF" width="24" height="24" />
            </div>
            <Segmented v-model="curYearIndex" :options="periodOptions" />
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartAreaStacked
              :color="isDark ? '#66ccff' : '#41b6ff'"
              :x-labels="curYearIndex === 0 ? xLabelsQuarter.y2023 : curYearIndex === 1 ? xLabelsQuarter.y2024 : xLabelsQuarter.y2025"
              :data="curYearIndex === 0 ? generationDataQuarter.y2023 : curYearIndex === 1 ? generationDataQuarter.y2024 : generationDataQuarter.y2025"
              series-name="温州市总产能"
              unit="MWh"
            />
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
