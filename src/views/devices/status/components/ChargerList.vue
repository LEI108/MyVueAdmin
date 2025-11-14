<script setup lang="ts">
import type { Charger } from '@/types/charging-station'
import ChargerCard from './ChargerCard.vue'

const _props = defineProps<{
  chargers: Charger[]
  loading?: boolean
}>()
</script>

<template>
  <el-card shadow="never">
    <el-skeleton v-if="loading" :rows="8" animated />

    <el-row v-else :gutter="20">
      <el-col
        v-for="charger in chargers"
        :key="charger.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="charger-col"
      >
        <ChargerCard :charger="charger" />
      </el-col>
    </el-row>

    <div v-if="!loading && chargers.length === 0" class="empty-state">
      <el-empty description="暂无充电桩数据" />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.charger-col {
  margin-bottom: 24px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
