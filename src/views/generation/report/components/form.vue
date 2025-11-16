<script setup lang="ts">
import type { FormItemProps } from '../utils/types'
import { reactive, ref } from 'vue'
import ReCol from '@/components/ReCol'
import { formRules } from '../utils/rule'

const props = defineProps<{
  formInline: Partial<FormItemProps>
}>()

// 本地可修改副本
const localForm = reactive({ ...props.formInline })

const formRef = ref()

function getRef() {
  return formRef.value
}

defineExpose({ getRef, localForm })
</script>

<template>
  <el-form
    ref="formRef"
    :model="localForm"
    :rules="formRules"
    label-width="120px"
    class="power-form"
  >
    <el-row :gutter="20">
      <ReCol :span="12">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="localForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="电站编号" prop="stationCode">
          <el-input v-model="localForm.stationCode" placeholder="请输入电站编号" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="总发电量(kWh)" prop="totalGeneration">
          <el-input-number v-model="localForm.totalGeneration" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="并网发电量(kWh)" prop="gridGeneration">
          <el-input-number v-model="localForm.gridGeneration" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="自用电量(kWh)" prop="selfUseGeneration">
          <el-input-number v-model="localForm.selfUseGeneration" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="电量损耗(kWh)" prop="powerLoss">
          <el-input-number v-model="localForm.powerLoss" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="峰段电量(kWh)" prop="peakGeneration">
          <el-input-number v-model="localForm.peakGeneration" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="谷段电量(kWh)" prop="valleyGeneration">
          <el-input-number v-model="localForm.valleyGeneration" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="平段电量(kWh)" prop="flatGeneration">
          <el-input-number v-model="localForm.flatGeneration" :min="0" :precision="2" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="设备运行效率(%)" prop="efficiency">
          <el-input-number v-model="localForm.efficiency" :min="0" :max="100" :precision="2" :step="0.1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="设备利用率(小时)" prop="utilizationHours">
          <el-input-number v-model="localForm.utilizationHours" :min="0" :precision="2" :step="0.5" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="状态" prop="status">
          <el-select v-model="localForm.status" placeholder="请选择状态" class="w-full">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="2" />
          </el-select>
        </el-form-item>
      </ReCol>
    </el-row>
  </el-form>
</template>

<style scoped>
.power-form {
  padding: 8px;
}
</style>
