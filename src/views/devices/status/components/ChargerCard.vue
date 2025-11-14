<script setup lang="ts">
import type { Charger, ChargerStatus } from '@/types/charging-station'
import { computed } from 'vue'

const props = defineProps<{
  charger: Charger
}>()

// 状态样式映射（集中管理）
const statusConfig = computed(() => {
  const { status } = props.charger
  switch (status) {
    case 1: return { text: '空闲中', icon: 'mdi:battery-outline', color: '#41b6ff', bgColor: '#e8f4ff' }
    case 2: return { text: '充电中', icon: 'mdi:battery-charging', color: '#26ce83', bgColor: '#e6fff5' }
    case 3: return { text: '连接中', icon: 'mdi:usb-plug', color: '#ff9f40', bgColor: '#fff7e8' }
    case 4: return { text: '排队中', icon: 'mdi:queue', color: '#ffb400', bgColor: '#fff8e1' }
    case 5: return { text: '已预约', icon: 'mdi:calendar-check', color: '#722ed1', bgColor: '#f9f0ff' }
    case 6: return { text: '故障/离线', icon: 'mdi:alert-circle', color: '#f56c6c', bgColor: '#fef0f0' }
    default: return { text: '未知状态', icon: 'mdi:help-circle', color: '#909399', bgColor: '#f5f5f5' }
  }
})

// 格式化百分比显示
function formatPercent(percent?: string) {
  if (!percent)
    return '0%'
  // 确保百分比格式正确（如"70" -> "70%"）
  return percent.endsWith('%') ? percent : `${percent}%`
}
</script>

<template>
  <div class="charger-card">
    <!-- 基本信息区域 -->
    <div class="info-section" :style="{ backgroundColor: statusConfig.bgColor }">
      <div class="status-icon">
        <IconifyIconOffline
          :icon="statusConfig.icon"
          :color="statusConfig.color"
          width="32"
          height="32"
        />
      </div>

      <div
        class="status-info"
        :class="{ 'status--charging': charger.status === 2 }"
      >
        <h3 class="charger-id">
          {{ charger.id }}
        </h3>

        <div
          class="status-row"
          :class="{ 'status-row--charging': charger.status === 2 }"
        >
          <div class="status-text" :style="{ color: statusConfig.color }">
            {{ statusConfig.text }}
          </div>
          <div v-if="charger.status === 2" class="percent">
            {{ formatPercent(charger.percent) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 技术参数区域 -->
    <div class="detail-section">
      <p>电压：{{ charger.voltage }}</p>
      <p>电流：{{ charger.current }}</p>
      <p>功率：{{ charger.power }}</p>
      <p>温度：{{ charger.tem }}</p>
    </div>

    <!-- 操作区 -->
    <div class="action-section">
      <el-divider class="my-2.5!" />
      <div class="actions">
        <span class="status-tip">暂无预警</span>
        <div>
          <el-button size="small">
            维保记录
          </el-button>

          <el-popover placement="right" width="320" trigger="click">
            <template #reference>
              <el-button size="small" type="primary">
                使用记录
              </el-button>
            </template>

            <h4 class="title">
              使用记录
            </h4>
            <el-timeline>
              <el-timeline-item
                v-for="(record, index) in charger.record"
                :key="index"
                :timestamp="record.time"
                type="primary"
              >
                {{ record.msg }}
              </el-timeline-item>
              <el-empty v-if="!charger.record?.length" description="暂无使用记录" />
            </el-timeline>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.charger-card {
  display: flex;
  flex-direction: column;
  background-color: #f7fbfe;
  border-radius: 10px;
  overflow: hidden;

  .info-section {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 10px 10px 0 0;

    .status-icon {
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

.status-info {
  display: flex;
  flex-direction: column;

  .charger-id {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 4px 0;
  }

  /* 新增：单独控制状态部分 */
  .status-row {
    display: flex;
    flex-direction: column;

    /* 当状态为充电中时，让状态文字与百分比横排 */
    &.status-row--charging {
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }
  }

  .status-text {
    font-size: 14px;
  }

  .percent {
    font-weight: 500;
    color: #26ce83;
  }
}
  }

  .detail-section {
    background-color: #ffffff;
    padding: 12px 16px;
    color: #606266;
    font-size: 13px;
    line-height: 1.7;
    p {
      margin: 0;
    }
  }

  .action-section {
    background: #f8fafd;
    padding: 6px 12px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .status-tip {
        font-size: 12px;
        color: #999;
      }

      .title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
