<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  hours: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  power: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  energy: {
    type: Array as PropType<number[]>,
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
  () => props,
  async () => {
    await nextTick()
    await sleep(200)
    setOptions({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
        }
    }
      },
      legend: {
        data: ['发电量(kWh)','发电功率(kW)' ],
        bottom: 0,
      },
      grid: {
        top: '20px',
        left: '40px',
        right: '20px',
        bottom: '40px',
      },
      xAxis: {
        type: 'category',
        data: props.hours,
      },
      yAxis: [
        {
          type: 'value',
          name: '电量(kWh)',
        },
        {
          type: 'value',
          name: '功率(kW)',
        },     
      ],
      series: [
          {
          name: '发电量(kWh)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          areaStyle: {
            color: 'rgba(247, 101, 96, 0.3)',
          },
          emphasis: {
            focus: 'series'
         },
          itemStyle: {
            color: '#e85f33',
          },
          data: props.energy,
        },
        {
          name: '发电功率(kW)',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          areaStyle: {
            color: 'rgba(94, 223, 214, 0.5)',
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#41b6ff',
          },
          data: props.power,
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
