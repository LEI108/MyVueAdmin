<script setup lang="ts">
import type { FormItemProps } from '../utils/types'
import { reactive, ref } from 'vue'
import ReCol from '@/components/ReCol'
import { formRules } from '../utils/rule'

const props = defineProps<{
  formInline: Partial<FormItemProps>
}>()

// 保持与弹窗内 options.props.formInline 同引用，确保提交读取到最新值
const localForm = reactive(props.formInline)
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
    class="sales-revenue-form"
  >
    <el-row :gutter="20">
      <ReCol :span="12">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="localForm.date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            class="w-full"
          />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="峰段电价" prop="peakPrice">
          <el-input-number v-model="localForm.peakPrice" :min="0" :precision="3" :step="0.001" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="谷段电价" prop="valleyPrice">
          <el-input-number v-model="localForm.valleyPrice" :min="0" :precision="3" :step="0.001" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="平段电价" prop="flatPrice">
          <el-input-number v-model="localForm.flatPrice" :min="0" :precision="3" :step="0.001" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="平均电价" prop="averagePrice">
          <el-input-number v-model="localForm.averagePrice" :min="0" :precision="3" :step="0.001" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="售电收入" prop="salesRevenue">
          <el-input-number v-model="localForm.salesRevenue" :min="0" :precision="2" :step="0.01" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="补贴收入" prop="subsidyRevenue">
          <el-input-number v-model="localForm.subsidyRevenue" :min="0" :precision="2" :step="0.01" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="总营收" prop="totalRevenue">
          <el-input-number v-model="localForm.totalRevenue" :min="0" :precision="2" :step="0.01" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="运维成本" prop="omCost">
          <el-input-number v-model="localForm.omCost" :min="0" :precision="2" :step="0.01" class="w-full" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="净利润" prop="netProfit">
          <el-input-number v-model="localForm.netProfit" :min="0" :precision="2" :step="0.01" class="w-full" />
        </el-form-item>
      </ReCol>
    </el-row>
  </el-form>
</template>

<style scoped>
.sales-revenue-form {
  padding: 8px;
}
</style>
