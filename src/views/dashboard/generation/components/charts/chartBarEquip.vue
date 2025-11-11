<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array as PropType<Array<{ name: string, value: number }>>,
    default: () => [],
  },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))
const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })

setOptions({
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.name),
  },
  yAxis: { type: 'value', max: 100 },
  series: [{
    type: 'bar',
    data: props.data.map(d => d.value),
    barWidth: 20,
    itemStyle: { color: '#41b6ff', borderRadius: [6, 6, 0, 0] },
  }],
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>
