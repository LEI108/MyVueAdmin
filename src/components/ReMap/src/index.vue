<script setup lang="ts">
import type { PropType } from 'vue'
import type { DeviceInfo, DeviceType } from '@/types/map'
import AMapLoader from '@amap/amap-jsapi-loader'
import { deviceDetection } from '@pureadmin/utils'
import { getCurrentInstance, onBeforeMount, onUnmounted, reactive, watch } from 'vue'
import { boundNE, boundSW } from '@/views/devices/map/data' // 保留温州市边界常量

defineOptions({ name: 'ReMap' })

// ------------------------------
// 通用地图组件 Props（核心扩展点）
// ------------------------------
const props = defineProps({
  /** 设备数据列表（必传，由父组件通过 Pinia/API 提供） */
  points: {
    type: Array as PropType<DeviceInfo[]>,
    required: true,
  },
  /** 设备类型图标映射（必传，由父组件注入不同类型图标） */
  iconMap: {
    type: Object as PropType<Record<DeviceType, string>>,
    required: true,
  },
  /** 当前筛选的设备类型（可选，null 表示显示全部类型） */
  deviceType: {
    type: String as PropType<DeviceType | null>,
    required: false,
    default: null,
  },
  /** 聚合网格大小（可配置） */
  gridSize: {
    type: Number,
    default: 80,
  },
  /** 最大聚合层级（可配置） */
  maxZoom: {
    type: Number,
    default: 14,
  },
})

// ------------------------------
// 内部状态与实例（保留原始模板变量命名）
// ------------------------------
const instance = getCurrentInstance()
const mapSet = reactive({ loading: !deviceDetection() })
let MarkerCluster: any = null
let map: any = null

// 地图完成事件关闭加载动画（保留原始函数）
function complete(): void {
  if (map) {
    map.on('complete', () => {
      mapSet.loading = false
    })
  }
}

// ------------------------------
// 核心：聚合点渲染逻辑（内联到 MarkerCluster 配置中）
// ------------------------------
function updateMarkerData() {
  if (!MarkerCluster)
    return
  const points = props.points.map((d: DeviceInfo) => ({
    lnglat: [d.lng, d.lat],
    ...d,
  }))
  MarkerCluster.setData(points)
}

// ------------------------------
// 生命周期钩子（完全还原原始模板结构）
// ------------------------------
onBeforeMount(() => {
  if (!instance)
    return

  // 获取全局配置（保留原始逻辑）
  const { MapConfigure } = instance.appContext.config.globalProperties.$config
  const { options } = MapConfigure

  // 加载地图 SDK（保留原始 AMapLoader 调用顺序）
  AMapLoader.load({
    key: MapConfigure.amapKey,
    version: '2.0',
    plugins: ['AMap.MarkerCluster', 'AMap.DistrictSearch', 'AMap.ToolBar', 'AMap.MapType'], // 合并插件列表
  })
    .then((AMap) => {
      // 创建地图实例（保留原始挂载逻辑）
      map = new AMap.Map(instance.refs.mapview, options)

      // 限制滑动范围（保留原始边界逻辑）
      map.setLimitBounds(new AMap.Bounds(boundSW, boundNE))

      // 添加地图插件（保留原始 ToolBar 和 MapType）
      map.plugin(['AMap.ToolBar', 'AMap.MapType'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.MapType({ defaultType: 0 }))
      })

      // 创建聚合对象（内联 renderMarker，解决 AMap 作用域问题）
      MarkerCluster = new AMap.MarkerCluster(map, [], {
        gridSize: props.gridSize,
        maxZoom: props.maxZoom,
        renderMarker(ctx) {
          const { marker, data } = ctx
          if (!Array.isArray(data) || data.length === 0)
            return

          // 1. 根据 props.deviceType 筛选设备类型
          const filteredData = props.deviceType
            ? data.filter((d: DeviceInfo) => d.type === props.deviceType)
            : data

          if (filteredData.length === 0)
            return

          // 2. 计算主要设备类型（出现次数最多）
          const typeCount: Record<DeviceType, number> = { pv: 0, battery: 0, charger: 0, inverter: 0 }
          filteredData.forEach((d: DeviceInfo) => typeCount[d.type]++)
          const mainType = (Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0]) as DeviceType

          // 3. 设置图标内容（使用 props.iconMap 动态图标）
          marker.setContent(`<img src="${props.iconMap[mainType]}" style="width:32px;height:32px"/>`)
          marker.setOffset(new AMap.Pixel(-16, -16)) // 图标居中偏移（AMap 作用域安全）

          // 4. 点击弹窗逻辑（保留原始样式）
          marker.on('click', () => {
            const dev = filteredData[0]
            const infoWindow = new AMap.InfoWindow({
              content: `
                <div style="font-size:14px;line-height:1.5;">
                  <strong>${dev.name}</strong><br/>
                  类型：${dev.type === 'pv'
                    ? '光伏板'
                    : dev.type === 'battery'
                      ? '储能电池'
                      : dev.type === 'charger' ? '充电桩' : '逆变器'}<br/>
                  状态：${dev.status === 'normal'
                    ? '正常'
                    : dev.status === 'abnormal' ? '异常' : '空闲'}<br/>
                  温度：${dev.weather.temperature}℃<br/>
                  湿度：${dev.weather.humidity}%
                </div>
              `,
            })
            infoWindow.open(map, [dev.lng, dev.lat])
          })
        },
      })

      // 首次加载数据（从 props.points 获取，而非直接调用 mapJson）
      updateMarkerData()
      complete() // 完成加载动画
    })
    .catch((err) => {
      console.error(err)
      mapSet.loading = false
      throw new Error('地图加载失败，请重新加载')
    })
})

onUnmounted(() => {
  if (map) {
    map.destroy()
    map.clearEvents('click')
  }
})

// ------------------------------
// 数据监听（保持响应式逻辑）
// ------------------------------
watch(
  () => [props.points, props.deviceType],
  () => {
    if (map)
      updateMarkerData()
  },
  { deep: true },
)
</script>

<template>
  <!-- 保留原始地图容器结构 -->
  <div id="mapview" ref="mapview" v-loading="mapSet.loading" />
</template>

<style lang="scss" scoped>
#mapview {
  height: calc(100vh - 86px); /* 维持原始高度 */
}

/* 高德地图样式覆盖（保留原始逻辑） */
:deep(.amap-marker-label) {
  border: none !important;
  background: transparent !important;
}
</style>
