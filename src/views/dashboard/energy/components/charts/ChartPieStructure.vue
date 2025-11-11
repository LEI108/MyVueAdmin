<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

interface PieItem { name: string, value: number }

const props = defineProps({
  data: { type: Array as PropType<Array<PieItem>>, default: () => [] },
  unit: { type: String, default: 'MWh' },
  colors: {
    type: Array as PropType<string[]>,
    default: () => ['#41b6ff', '#26ce83', '#7846e5', '#e85f33', '#ffb020', '#7bd3ea', '#8bc48a'],
  },
  donut: { type: Boolean, default: true },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })

watch(
  () => [props.data, props.colors, props.unit, props.donut],
  async () => {
    await nextTick()
    setOptions({
      color: props.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark.value ? 'rgba(40,40,40,0.9)' : 'rgba(255,255,255,0.95)',
        borderWidth: 0,
        textStyle: { color: isDark.value ? '#fff' : '#333' },
        formatter: (p: any) => `${p.marker}${p.name}<br/>${p.value} ${props.unit}（${p.percent}%）`,
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 10,
        bottom: 10,
        textStyle: {
          color: isDark.value ? '#ddd' : '#606266',
          fontSize: 14,
        },
      },
      series: [
        {
          name: '产能结构',
          type: 'pie',
          radius: props.donut ? ['40%', '65%'] : '65%',
          center: ['40%', '50%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            formatter: ({ name, percent }: any) => `${name}\n${percent}%`,
            fontSize: 12,
            color: isDark.value ? '#eee' : '#333',
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 8,
          },
          itemStyle: {
            borderColor: isDark.value ? 'rgba(0,0,0,0.2)' : '#fff',
            borderWidth: 1,
          },
          emphasis: {
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.2)',
            },
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
  <div ref="chartRef" style="width: 100%; height: 390px" />
</template>
