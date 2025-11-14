<script setup lang="ts">
import type { FormProps } from '../utils/types'
import { ref } from 'vue'
import ReCol from '@/components/ReCol'
import { formRules } from '../utils/rule'

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    deviceCode: '',
    deviceAddress: '',
    faultDesc: '',
    alarmTime: '',
    alarmLevel: 1,
    status: 1,
  }),
})

const ruleFormRef = ref()
const newFormInline = ref(props.formInline)

function getRef() {
  return ruleFormRef.value
}

defineExpose({ getRef })
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="100px">
    <el-row :gutter="20">
      <ReCol :value="12">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="newFormInline.deviceCode" clearable />
        </el-form-item>
      </ReCol>
      <ReCol :value="12">
        <el-form-item label="设备地址" prop="deviceAddress">
          <el-input v-model="newFormInline.deviceAddress" clearable />
        </el-form-item>
      </ReCol>
      <ReCol>
        <el-form-item label="故障描述" prop="faultDesc">
          <el-input v-model="newFormInline.faultDesc" type="textarea" />
        </el-form-item>
      </ReCol>
      <ReCol :value="12">
        <el-form-item label="告警时间" prop="alarmTime">
          <el-date-picker v-model="newFormInline.alarmTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </ReCol>
      <ReCol :value="12">
        <el-form-item label="告警级别" prop="alarmLevel">
          <el-select v-model="newFormInline.alarmLevel">
            <el-option label="轻微" :value="1" />
            <el-option label="中等" :value="2" />
            <el-option label="严重" :value="3" />
          </el-select>
        </el-form-item>
      </ReCol>
      <ReCol :value="12">
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="newFormInline.status">
            <el-option label="待指派" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="已完成" :value="3" />
          </el-select>
        </el-form-item>
      </ReCol>
    </el-row>
  </el-form>
</template>
