<script setup lang="ts">
import type { FormItemProps } from '../utils/types'
import { reactive, ref } from 'vue'
import ReCol from '@/components/ReCol'
import { formRules } from '../utils/rule'

const props = defineProps<{
  formInline: Partial<FormItemProps>
}>()

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
    class="station-revenue-form"
  >
    <el-row :gutter="20">
      <ReCol :span="12">
        <el-form-item label="充电站编号" prop="stationCode">
          <el-input v-model="localForm.stationCode" placeholder="请输入充电站编号" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="充电站名称" prop="stationName">
          <el-input v-model="localForm.stationName" placeholder="请输入充电站名称" />
        </el-form-item>
      </ReCol>

      <ReCol :span="24">
        <el-form-item label="充电站地址" prop="stationAddress">
          <el-input v-model="localForm.stationAddress" placeholder="请输入充电站地址" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="运营状态" prop="status">
          <el-select v-model="localForm.status" placeholder="请选择运营状态" class="w-full">
            <el-option label="正常运营" :value="1" />
            <el-option label="维护中" :value="2" />
            <el-option label="暂停服务" :value="3" />
          </el-select>
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="充电桩数量" prop="chargerCount">
          <el-input-number v-model="localForm.chargerCount" :min="0" :step="1" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="单日收入" prop="dailyRevenue">
          <el-input-number v-model="localForm.dailyRevenue" :min="0" :precision="2" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="月度收入" prop="monthlyRevenue">
          <el-input-number v-model="localForm.monthlyRevenue" :min="0" :precision="2" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="电费营收" prop="electricityRevenue">
          <el-input-number v-model="localForm.electricityRevenue" :min="0" :precision="2" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="停车费营收" prop="parkingRevenue">
          <el-input-number v-model="localForm.parkingRevenue" :min="0" :precision="2" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="服务费营收" prop="serviceRevenue">
          <el-input-number v-model="localForm.serviceRevenue" :min="0" :precision="2" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="其他收入" prop="otherRevenue">
          <el-input-number v-model="localForm.otherRevenue" :min="0" :precision="2" class="w-full" />
        </el-form-item>
      </ReCol>
    </el-row>
  </el-form>
</template>

<style scoped>
.station-revenue-form {
  padding: 8px;
}
</style>
