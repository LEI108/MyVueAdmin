<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DeviceInfo, DeviceStatus, DeviceType } from '@/types/map'
import { reactive, ref } from 'vue'
import { bounds } from '../data' // 引入温州市坐标范围限制

// 父组件传入提交事件（直接接收 Omit<DeviceInfo, 'id'> 类型）
const emit = defineEmits<{
  (e: 'submit', payload: Omit<DeviceInfo, 'id'>): void
}>()

// 表单数据（严格匹配 Omit<DeviceInfo, 'id'> 结构）
const newDevice = reactive<Omit<DeviceInfo, 'id'>>({
  name: '',
  type: 'pv' as DeviceType, // 默认值设为 'pv'，避免空值
  lng: null as number | null,
  lat: null as number | null,
  status: 'normal' as DeviceStatus, // 状态默认值
  weather: {
    temperature: null as number | null,
    humidity: null as number | null,
  },
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单规则（与 DeviceInfo 类型强关联）
const rules: FormRules<Omit<DeviceInfo, 'id'>> = {
  'name': [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 5, max: 30, message: '名称长度 5-30 字符', trigger: 'blur' },
  ],
  'type': [
    { required: true, message: '请选择设备类型', trigger: 'change' },
  ],
  'lng': [
    { required: true, message: '请输入经度', trigger: 'blur' },
    {
      type: 'number',
      min: bounds.lngMin, // 关联 types/map.ts 的经度最小值
      max: bounds.lngMax, // 关联 types/map.ts 的经度最大值
      message: `经度范围 ${bounds.lngMin} - ${bounds.lngMax}`,
      trigger: 'blur',
    },
  ],
  'lat': [
    { required: true, message: '请输入纬度', trigger: 'blur' },
    {
      type: 'number',
      min: bounds.latMin, // 关联 latitude 最小值
      max: bounds.latMax, // 关联 latitude 最大值
      message: `纬度范围 ${bounds.latMin} - ${bounds.latMax}`,
      trigger: 'blur',
    },
  ],
  'weather.temperature': [
    {
      type: 'number',
      min: -20,
      max: 50,
      message: '温度范围 -20°C - 50°C',
      trigger: 'blur',
    },
  ],
  'weather.humidity': [
    {
      type: 'number',
      min: 0,
      max: 100,
      message: '湿度范围 0% - 100%',
      trigger: 'blur',
    },
  ],
}

// 提交处理（严格校验必填项和类型）
async function submitForm() {
  if (!formRef.value)
    return

  try {
    await formRef.value.validate()
    // 提交前确保 lng/lat 不为 null（表单规则已限制必填，所以非空断言安全）
    emit('submit', {
      ...newDevice,
      lng: newDevice.lng!,
      lat: newDevice.lat!,
      weather: {
        temperature: newDevice.weather.temperature ?? undefined, // 可选字段，空则传 undefined
        humidity: newDevice.weather.humidity ?? undefined,
      },
    })
    // 提交成功后重置表单
    formRef.value.resetFields()
  }
  catch (err) {
    console.error('表单验证失败:', err)
  }
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="text-base">
        <span>添加新设备</span>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="newDevice"
      :rules="rules"
      label-width="90px"
      class="flex flex-col justify-between items-start"
    >
      <!-- 设备名称 -->
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="newDevice.name"
          placeholder="例如:温州市鹿城区光伏板01"
          maxlength="30"
        />
      </el-form-item>

      <!-- 设备类型（下拉选项与 DeviceType 完全匹配） -->
      <el-form-item label="设备类型" prop="type">
        <el-select v-model="newDevice.type" placeholder="请选择设备类型">
          <el-option label="光伏板" value="pv" />
          <el-option label="储能电池" value="battery" />
          <el-option label="充电桩" value="charger" />
          <el-option label="逆变器" value="inverter" />
        </el-select>
      </el-form-item>

      <!-- 经度（范围限制为温州市实际坐标） -->
      <el-form-item label="经度" prop="lng">
        <el-input-number
          v-model="newDevice.lng"
          :min="bounds.lngMin"
          :max="bounds.lngMax"
          :step="0.0001"
          placeholder=""
          :precision="4"
        />
        <div class="text-xs text-gray-500 mt-1">
          温州市范围：{{ bounds.lngMin }} - {{ bounds.lngMax }}
        </div>
      </el-form-item>

      <!-- 纬度（范围限制为温州市实际坐标） -->
      <el-form-item label="纬度" prop="lat">
        <el-input-number
          v-model="newDevice.lat"
          :min="bounds.latMin"
          :max="bounds.latMax"
          :step="0.0001"
          placeholder=""
          :precision="4"
        />
        <div class="text-xs text-gray-500 mt-1">
          温州市范围：{{ bounds.latMin }} - {{ bounds.latMax }}
        </div>
      </el-form-item>

      <!-- 设备状态（下拉选项与 DeviceStatus 完全匹配） -->
      <el-form-item label="状态">
        <el-select v-model="newDevice.status">
          <el-option label="正常" value="normal" />
          <el-option label="异常" value="abnormal" />
          <el-option label="空闲" value="idle" />
        </el-select>
      </el-form-item>

      <!-- 可选天气信息 -->
      <el-form-item label="温度">
        <el-input-number
          v-model="newDevice.weather.temperature"
          :min="-20"
          :max="50"
          :step="0.1"
          placeholder="°C (选填)"
          :precision="1"
        />
      </el-form-item>
      <el-form-item label="湿度">
        <el-input-number
          v-model="newDevice.weather.humidity"
          :min="0"
          :max="100"
          :step="1"
          placeholder="% (选填)"
        />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交
        </el-button>
        <el-button @click="formRef?.resetFields()">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-form) {
 .el-form-item {
  margin-bottom: 16px;
 }
 .el-form-item--label-right .el-form-item__label{
  justify-content: start;
 }
}

:deep(.el-card) {
  --el-card-border-color: none;
  --el-card-padding: 10px;

  .el-progress--line { width: 85%; }
  .el-progress-bar__innerText { font-size: 15px; }
  .el-scrollbar__bar { display: none; }
}
</style>
