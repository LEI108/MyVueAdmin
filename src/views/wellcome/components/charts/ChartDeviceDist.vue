<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array as PropType<{ name: string, value: number }[]>,
    default: () => [],
  },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

watch(
  () => props.data,
  async () => {
    await nextTick()
    await sleep(200) // 延时渲染
    setOptions({
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        bottom: 0,
        left: 'center',
      },
      series: [
        {
          name: '设备分布',
          type: 'pie',
          radius: ['40%', '70%'],
          padAngle: 5, // 扇区间隙
          itemStyle: {
            borderRadius: 8,
          },
          label: {
            show: false,
            formatter: '{b}\n{c}台',
          },
          data: props.data,
        },
      ],
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 320px" />
</template>
