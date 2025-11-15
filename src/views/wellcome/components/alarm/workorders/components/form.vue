<script setup lang="ts">
import type { WorkOrderFormProps } from '../utils/types'
import { reactive, ref } from 'vue'
import ReCol from '@/components/ReCol'
import { workOrderRules } from '../utils/rule'

const props = defineProps<{
  formInline: Partial<WorkOrderFormProps['formInline']>
}>()

// 本地可修改副本
const localForm = reactive({ ...props.formInline })

const formRef = ref()
const types = ['安装', '维修', '保养', '巡检', '投诉', '其他']

function getRef() {
  return formRef.value
}

defineExpose({ getRef, localForm })
</script>

<template>
  <el-form
    ref="formRef"
    :model="localForm"
    :rules="workOrderRules"
    label-width="100px"
    class="workorder-form"
  >
    <el-row :gutter="20">
      <ReCol :span="12">
        <el-form-item label="工单编号" prop="workOrderCode">
          <el-input v-model="localForm.workOrderCode" placeholder="自动生成或手动输入" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="指派人员" prop="assignee">
          <el-input v-model="localForm.assignee" placeholder="输入姓名" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="电话" prop="assigneePhone">
          <el-input v-model="localForm.assigneePhone" placeholder="输入电话" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="工号" prop="assigneeJobNo">
          <el-input v-model="localForm.assigneeJobNo" placeholder="输入工号" />
        </el-form-item>
      </ReCol>

      <ReCol :span="24">
        <el-form-item label="工单描述" prop="description">
          <el-input v-model="localForm.description" type="textarea" placeholder="输入工单描述" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="类型" prop="type">
          <el-select v-model="localForm.type" placeholder="请选择类型">
            <el-option v-for="item in types" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="localForm.deviceCode" placeholder="设备编号" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="设备地点" prop="deviceAddress">
          <el-input v-model="localForm.deviceAddress" placeholder="设备地点" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="localForm.deadline"
            type="datetime"
            placeholder="选择截止时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="状态" prop="status">
          <el-select v-model="localForm.status" placeholder="请选择状态">
            <el-option label="待处理" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="已完成" :value="3" />
          </el-select>
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="localForm.priority" placeholder="请选择优先级">
            <el-option label="高" :value="1" />
            <el-option label="中" :value="2" />
            <el-option label="低" :value="3" />
          </el-select>
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="管理人" prop="manager">
          <el-input v-model="localForm.manager" placeholder="管理人姓名" />
        </el-form-item>
      </ReCol>

      <ReCol :span="12">
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker
            v-model="localForm.finishTime"
            type="datetime"
            placeholder="选择完成时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </ReCol>
    </el-row>
  </el-form>
</template>

<style scoped>
.workorder-form {
  padding: 8px;
}
</style>
