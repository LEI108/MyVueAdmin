<script setup lang="ts">
import type { MapStatsResponse } from '@/types/map'

import { useDark } from '@pureadmin/utils'

const _props = defineProps<{
  loading?: boolean
  stats: MapStatsResponse
}>()
const { isDark } = useDark()
/** 设备类型数组直接取 props.stats.countByType */
</script>

<template>
  <el-card shadow="never" class="stats-card">
    <template #header>
      <div class="flex items-center justify-between">
        <span>温州市设备统计</span>
        <el-tag size="small" type="info">
          实时数据
        </el-tag>
      </div>
    </template>

    <el-skeleton v-if="loading" :rows="5" animated />

    <template v-else>
      <el-row :gutter="12" class="">
        <!-- 设备类型数量卡片 -->
        <el-col :span="24">
          <el-card shadow="hover">
            <div class="text-base font-semibold mb-2.5">
              设备类型数量
            </div>
            <el-row :gutter="12" justify="space-around">
              <el-col
                v-for="item in stats.countByType"
                :key="item.type"
                :span="12"
                class="flex"
              >
                <el-card shadow="hover">
                  <div class="flex justify-start">
                    <div
                      class="w-8 h-8 flex justify-center items-center mr-2.5 rounded-md"
                      :style="{
                        backgroundColor: isDark ? 'transparent' : item.bgColor,
                      }"
                    >
                      <IconifyIconOffline :icon="item.icon" :color="item.color" width="18" height="18" />
                    </div>
                    <div class="flex flex-col">
                      <div class="text-sm font-semibold">
                        {{ item.name }}
                      </div>
                      <div class="text-sm">
                        {{ item.count }} 台
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <!-- 故障率最高区域 -->
        <el-col :span="24">
          <el-card shadow="hover">
            <div class="text-base font-semibold mb-2.5">
              故障率最高区域
            </div>
            <div class="flex justify-start items-center">
              <div
                class="w-8 h-8 flex justify-center items-center mr-2.5 rounded-md"
                :style="{
                  backgroundColor: isDark ? 'transparent' : '#effaff',
                }"
              >
                <IconifyIconOffline icon="mdi:alert" color="#F56C6C" width="18" height="18" />
              </div>
              <span class="text-sm">{{ stats.highestFaultArea || '暂无数据' }}</span>
            </div>
          </el-card>
        </el-col>

        <!-- 营收最高区域 -->
        <el-col :span="24">
          <el-card shadow="hover" class="section-card">
            <div class="text-base font-semibold mb-2.5">
              营收最高区域
            </div>
            <div class="flex justify-start items-center">
              <div
                class="w-8 h-8 flex justify-center items-center  mr-2.5 rounded-md"
                :style="{
                  backgroundColor: isDark ? 'transparent' : '#effaff',
                }"
              >
                <IconifyIconOffline icon="mdi:medal" color="#67C23A" width="18" height="18" />
              </div>
              <span class="text-sm">{{ stats.highestRevenueArea || '暂无数据' }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.stats-card {
  --el-card-padding: 12px !important;
}

:deep(.el-card) {
  --el-card-border-color: none;
  --el-card-padding: 10px;

  .el-progress--line { width: 85%; }
  .el-progress-bar__innerText { font-size: 15px; }
  .el-scrollbar__bar { display: none; }
}
</style>
