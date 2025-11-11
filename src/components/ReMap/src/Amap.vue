<script setup lang="ts">
import type {
  DeviceInfo,
  DeviceType,
} from '@/types/device'
import AMapLoader from '@amap/amap-jsapi-loader'
import { deviceDetection } from '@pureadmin/utils'
import { getCurrentInstance, onBeforeMount, onUnmounted, reactive } from 'vue'
import { mapJson } from '@/api/device'
import batteryIcon from '@/assets/devices/battery.png'
import chargerIcon from '@/assets/devices/charger.png'
import inverterIcon from '@/assets/devices/inverter.png'
import pvIcon from '@/assets/devices/panel.png'
import {
  boundNE,
  boundSW,
  typeNameMap,
} from '@/types/device'

defineOptions({
  name: 'AMap',
})
// 保留组件内的 iconMap
const iconMap: Record<DeviceType, string> = {
  pv: pvIcon,
  battery: batteryIcon,
  charger: chargerIcon,
  inverter: inverterIcon,
}

export interface MapConfigureInter {
  on: Fn
  destroy?: Fn
  clearEvents?: Fn
  addControl?: Fn
  setCenter?: Fn
  setZoom?: Fn
  plugin?: Fn
}

let MarkerCluster: any
let map: any

const instance = getCurrentInstance()

const mapSet = reactive({
  loading: !deviceDetection(),
})

// 地图完成事件关闭加载动画
function complete(): void {
  if (map) {
    map.on('complete', () => {
      mapSet.loading = false
    })
  }
}

onBeforeMount(() => {
  if (!instance)
    return
  const { MapConfigure } = instance.appContext.config.globalProperties.$config
  const { options } = MapConfigure

  // 加载地图 SDK
  AMapLoader.load({
    key: MapConfigure.amapKey,
    version: '2.0',
    plugins: ['AMap.MarkerCluster', 'AMap.DistrictSearch'],
  })
    .then((AMap) => {
      // 创建地图
      map = new AMap.Map(instance.refs.mapview, options)

      // 限制滑动范围
      map.setLimitBounds(new AMap.Bounds(boundSW, boundNE))

      // 绘制温州市行政边界
      map.plugin(['AMap.DistrictSearch'], () => {
        const district = new AMap.DistrictSearch({
          level: 'city',
          extensions: 'all',
          showbiz: false,
        })
        district.search('温州市', (status, result) => {
          const boundaries = result.districtList[0].boundaries
          boundaries.forEach((b) => {
            const polygon = new AMap.Polygon({
              path: b,
              strokeWeight: 2,
              strokeColor: '#0066ff',
              fillColor: '#ffffff',
              fillOpacity: 0.05,
            })
            map.add(polygon)
          })
        })
      })

      // 添加地图插件
      map.plugin(['AMap.ToolBar', 'AMap.MapType'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.MapType({ defaultType: 0 }))
      })

      // 创建聚合对象
      MarkerCluster = new AMap.MarkerCluster(map, [], {
        gridSize: 80,
        maxZoom: 14,
        renderMarker(ctx) {
          const { marker, data } = ctx
          if (Array.isArray(data) && data[0]) {
            const dev = data[0] as DeviceInfo
            marker.setContent(
              `<img src="${iconMap[dev.type]}" style="width:32px;height:32px"/>`,
            )
            marker.setOffset(new AMap.Pixel(-16, -16)) // 图标居中
            marker.on('click', () => {
              const infoWindow = new AMap.InfoWindow({
                content: `
                  <div style="font-size:14px;line-height:1.5;">
                    <strong>${dev.name}</strong><br/>
                    类型：${typeNameMap[dev.type]}</p>
                    状态：${
                      dev.status === 'normal'
                        ? '正常'
                        : dev.status === 'abnormal'
                          ? '异常'
                          : '空闲'
                    }<br/>
                    温度：${dev.weather.temperature}℃<br/>
                    湿度：${dev.weather.humidity}%
                  </div>
                `,
              })
              infoWindow.open(map, [dev.lng, dev.lat])
            })
          }
        },
      })

      // 获取设备数据
      mapJson()
        .then(({ data }) => {
          const points = data.map((d: DeviceInfo) => ({
            lnglat: [d.lng, d.lat],
            ...d,
          }))
          if (MarkerCluster)
            MarkerCluster.setData(points)
        })
        .catch((err) => {
          console.error('设备数据加载失败:', err)
        })

      complete()
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
</script>

<template>
  <div id="mapview" ref="mapview" v-loading="mapSet.loading" />
</template>

<style lang="scss" scoped>
#mapview {
  height: calc(100vh - 86px);
}

:deep(.amap-marker-label) {
  border: none !important;
  background: transparent !important;
}
</style>
