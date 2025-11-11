<script setup lang="ts">
import type { BarSeriesOption } from 'echarts'
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

interface RegionStack {
  region: string
  values: number[]
}

const props = defineProps({
  data: { type: Array as PropType<RegionStack[]>, default: () => [] },
  types: { type: Array as PropType<string[]>, default: () => [] },
  unit: { type: String, default: 'MWh' },
  colors: {
    type: Array as PropType<string[]>,
    default: () => ['#41b6ff', '#26ce83', '#7846e5', '#e85f33', '#ffb020', '#7bd3ea', '#8bc48a'],
  },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })

watch(
  () => [props.data, props.types, props.colors, props.unit],
  async () => {
    await nextTick()

    const regions = props.data.map(d => d.region)

    const series: BarSeriesOption[] = props.types.map((t, ti) => ({
      name: t,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      barWidth: 16,
      itemStyle: {
        color: props.colors[ti % props.colors.length],
        borderRadius: [4, 4, 0, 0],
      },
      data: props.data.map(d => d.values[ti]),
    }))

    setOptions({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          let total = 0
          params.forEach(p => (total += Number(p.value)))
          const lines = params
            .filter(p => Number(p.value) > 0)
            .map(p => `${p.marker}${p.seriesName}: ${p.value} ${props.unit}`)
          return `${params[0].axisValue}<br/>${lines.join('<br/>')}<br/>合计：${total} ${props.unit}`
        },
      },
      legend: { type: 'scroll', top: 0 },
      grid: { top: 50, left: 50, right: 20, bottom: 50 },
      xAxis: { type: 'category', data: regions },
      yAxis: { type: 'value' },
      series,
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 390px" />
</template>
