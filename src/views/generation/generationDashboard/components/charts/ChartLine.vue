<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
  color: {
    type: String,
    default: '#41b6ff',
  },
})

const { isDark } = useDark()

const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartRef = ref()
const { setOptions } = useECharts(chartRef, {
  theme,
  renderer: 'svg',
})
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

watch(
  () => props,
  async () => {
    await nextTick()
    await sleep(200)
    setOptions({
      container: '.line-card',
      xAxis: {
        type: 'category',
        show: false,
        data: props.data,
      },
      grid: {
        top: '15px',
        bottom: 0,
        left: 0,
        right: 0,
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          data: props.data,
          type: 'line',
          symbol: 'none',
          smooth: true,
          color: props.color,
          lineStyle: {
            shadowOffsetY: 3,
            shadowBlur: 7,
            shadowColor: props.color,
          },
        },
      ],
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 60px" />
</template>
