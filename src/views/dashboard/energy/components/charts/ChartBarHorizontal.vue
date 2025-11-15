<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  data: { type: Array as PropType<Array<{ name: string, value: number }>>, default: () => [] },
  color: { type: String, default: '#41b6ff' },
})

const { isDark } = useDark()
const theme = computed(() => isDark.value ? 'dark' : 'light')

const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

watch(() => props.data, async () => {
  await nextTick()
  await sleep(200) // 延时渲染
  const sorted = [...props.data].sort((a, b) => b.value - a.value)
  setOptions({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => `${params[0].name}：${params[0].value} MWh`,
    },
    grid: { left: '3%', right: '5%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { fontSize: 14 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: sorted.map(d => d.name),
      axisLabel: { fontSize: 14 },
    },
    series: [{
      type: 'bar',
      data: sorted.map(d => d.value),
      barWidth: 16,
      itemStyle: {
        color: props.color,
        borderRadius: [4, 4, 0, 0],
      },
    }],
  })
}, { deep: true, immediate: true })
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 390px" />
</template>
