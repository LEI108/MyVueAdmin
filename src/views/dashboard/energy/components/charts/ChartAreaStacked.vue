<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  data: { type: Array as PropType<number[]>, default: () => [] },
  xLabels: { type: Array as PropType<string[]>, default: () => [] },
  color: { type: String, default: '#41b6ff' },
  seriesName: { type: String, default: '总产能' },
  unit: { type: String, default: 'MWh' },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })

watch(
  () => [props.data, props.xLabels, props.color, props.seriesName],
  async () => {
    await nextTick()
    setOptions({
      color: [props.color],
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark.value
          ? 'rgba(40,40,40,0.9)'
          : 'rgba(255,255,255,0.95)',
        borderWidth: 0,
        textStyle: { color: isDark.value ? '#fff' : '#333' },
        axisPointer: { type: 'cross' },
        formatter: (params: any[]) => {
          const lines = params.map(
            p => `${p.marker}${p.seriesName}: ${p.value} ${props.unit}`,
          )
          return `${params[0].axisValue}<br/>${lines.join('<br/>')}`
        },
      },
      legend: {
        type: 'scroll',
        top: 0,
        textStyle: { color: isDark.value ? '#ddd' : '#606266', fontSize: 14 },
      },
      grid: { top: 50, left: 50, right: 20, bottom: 50 },
      xAxis: {
        type: 'category',
        data: props.xLabels,
        axisLabel: { fontSize: 14 },
        axisLine: { lineStyle: { color: isDark.value ? '#aaa' : '#666' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 14 },
        splitLine: {
          show: true,
          lineStyle: { color: isDark.value ? '#444' : '#eee' },
        },
      },
      series: [
        {
          name: props.seriesName,
          type: 'line',
          smooth: true,
          data: props.data,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: props.color },
          itemStyle: { color: props.color },
          emphasis: { focus: 'series' },
          areaStyle: {
            opacity: 0.25,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: props.color },
                { offset: 1, color: isDark.value ? 'transparent' : '#fff' },
              ],
            },
          },
        },
      ],
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 390px" />
</template>
