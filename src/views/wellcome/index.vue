<script setup lang="ts">
import { markRaw, ref } from 'vue'
import ReCol from '@/components/ReCol'
import { ReNormalCountTo } from '@/components/ReCountTo'
import { useRenderFlicker } from '@/components/ReFlicker'
import AlarmTableLite from './components/alarm/list/AlarmTableLite.vue'
import ChartDeviceDist from './components/charts/ChartDeviceDist.vue'
import ChartGenOverview from './components/charts/ChartGenOverview.vue'
import { ChartLine, ChartRound } from './components/charts/index' // 已有简单线图/圆图
import { chartData, deviceDistData, genOverviewData, latestOpsData } from './data'
import { randomGradient, useDark } from './utils'

defineOptions({ name: 'Home' })
const { isDark } = useDark()
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <!-- 顶部4个指标卡 -->
      <ReCol
        v-for="(item, index) in chartData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="6"
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
            <span class="text-md font-medium">{{ item.name }}</span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{ backgroundColor: isDark ? 'transparent' : item.bgColor }"
            >
              <IconifyIconOffline :icon="item.icon" :color="item.color" width="18" height="18" />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                font-size="1.6em"
                :start-val="0"
                :end-val="item.value"
              />
              <p class="font-medium text-green-500">
                {{ item.percent }}
              </p>
            </div>
            <ChartLine v-if="item.data.length > 1" class="w-1/2!" :color="item.color" :data="item.data" />
            <ChartRound v-else class="w-1/2!" />
          </div>
        </el-card>
      </ReCol>

      <!-- 发电概览 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400,
          },
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between mb-3">
            <span class="text-md font-medium">发电概览</span>
          </div>
          <ChartGenOverview :hours="genOverviewData.hours" :power="genOverviewData.power" :energy="genOverviewData.energy" />
        </el-card>
      </ReCol>

      <!-- 设备分布 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 480,
          },
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between mb-3">
            <span class="text-md font-medium">设备分布</span>
          </div>
          <ChartDeviceDist :data="deviceDistData" />
        </el-card>
      </ReCol>

      <!-- 预警信息表 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560,
          },
        }"
      >
        <el-card shadow="never" class="h-[575px]">
          <div class="flex justify-between">
            <span class="text-md font-medium">预警信息</span>
          </div>
          <AlarmTableLite class="mt-3" />
        </el-card>
      </ReCol>

      <!-- 最近操作动态 -->
      <ReCol
        v-motion
        class="mb-[18px]"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 640,
          },
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between mb-3">
            <span class="text-md font-medium">最近操作动态</span>
          </div>
          <el-scrollbar max-height="504">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in latestOpsData"
                :key="index"
                center
                placement="top"
                :icon="markRaw(useRenderFlicker({ background: randomGradient({ randomizeHue: true }) }))"
                :timestamp="item.date"
              >
                <p class="text-text_color_regular text-sm">
                  {{ item.content }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </ReCol>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  .el-scrollbar__bar {
    display: none;
  }
  .el-timeline-item {
    margin: 0 6px;
  }
}
</style>
