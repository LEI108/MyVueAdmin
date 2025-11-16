<script setup lang="ts">
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, ref } from 'vue'
import 'echarts-liquidfill'

const props = defineProps({
  percent: { type: Number, default: 50 },
  color: { type: String, default: '#41b6ff' },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartRef = ref()
const { setOptions } = useECharts(chartRef, { theme })

setOptions({
  series: [{
    type: 'liquidFill',
    radius: '75%',
    data: [props.percent / 100],
    color: [props.color],
    outline: { show: false },
    label: {
      fontSize: 24,
      color: props.color,
      formatter: `${props.percent}%`,
    },
  }],
})
</script>

<template>
  <div ref="chartRef" style="width: 200px; height: 200px" />
</template>
