<script setup lang="ts">
import type { PropType } from 'vue'
import { useDark, useECharts } from '@pureadmin/utils'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  /** 图表数据 */
  data: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
  /** X 轴标签 */
  xLabels: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  /** 主颜色 */
  color: {
    type: String,
    default: '#41b6ff',
  },
  /** 系列标题 */
  seriesName: {
    type: String,
    default: '发电量',
  },
  /** 单位（可选） */
  unit: {
    type: String,
    default: 'kWh',
  },
})

const { isDark } = useDark()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

// echarts DOM
const chartRef = ref()

// 注册 ECharts
const { setOptions } = useECharts(chartRef, { theme })

watch(
  () => [props.data, props.xLabels, props.color, props.seriesName],
  async () => {
    await nextTick()
    setOptions({
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark.value ? 'rgba(40,40,40,0.9)' : 'rgba(255,255,255,0.9)',
        borderWidth: 0,
        textStyle: { color: isDark.value ? '#fff' : '#000' },
        formatter: (params: any) => {
          let html = `${params[0].axisValue}<br/>`
          params.forEach((item: any) => {
            html += `${item.marker}${item.seriesName}: ${item.value} ${props.unit}<br/>`
          })
          return html
        },
      },
      grid: {
        top: 30,
        left: 50,
        right: 30,
        bottom: 30,
      },
      xAxis: {
        type: 'category',
        data: props.xLabels,
        axisLabel: {
          fontSize: '0.875rem',
        },
        axisLine: {
          lineStyle: {
            color: isDark.value ? '#aaa' : '#666',
          },
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: '0.875rem',
          formatter: (val: number) => `${val}`,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? '#444' : '#eee',
          },
        },
      },
      series: [
        {
          name: props.seriesName,
          type: 'line',
          smooth: true,
          data: props.data,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: props.color,
            width: 2,
          },
          itemStyle: {
            color: props.color,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: props.color,
                },
                {
                  offset: 1,
                  color: isDark.value ? 'transparent' : '#fff',
                },
              ],
            },
            opacity: 0.25,
          },
        },
      ],
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 365px" />
</template>
