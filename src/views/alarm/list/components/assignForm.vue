<script setup lang="ts">
import type { AssignFormData } from '../utils/types'
import { reactive, ref } from 'vue'
import ReCol from '@/components/ReCol'
import { formRules } from '../utils/rule'

const props = defineProps<{
  onSubmit: (formData: AssignFormData) => void
}>()

const activeStep = ref(1)
defineExpose({ activeStep, nextStep, prevStep, submit })
const step1Ref = ref()
const step2Ref = ref()
const step3Ref = ref()

const formData = reactive<AssignFormData>({
  step1: {
    name: '',
    phone: '',
    jobNo: '',
    urgent: false,
    options: '',
    remark: '',
  },
  step2: {
    approvalDept: '',
    copyDept: '',
  },
  step3: {
    leaderName: '',
    leaderPhone: '',
  },
})

function nextStep() {
  // 分步验证
  if (activeStep.value === 1) {
    step1Ref.value.validate((valid) => {
      if (valid)
        activeStep.value++
    })
  }
  else if (activeStep.value === 2) {
    step2Ref.value.validate((valid) => {
      if (valid)
        activeStep.value++
    })
  }
}

function prevStep() {
  if (activeStep.value > 1)
    activeStep.value--
}

function submit() {
  step3Ref.value.validate((valid) => {
    if (valid)
      props.onSubmit(formData)
  })
}
</script>

<template>
  <div class="p-2.5 m-0 max-w-2xl">
    <el-steps :active="activeStep" finish-status="success" align-center>
      <el-step title="指派人员信息" />
      <el-step title="审批部门信息" />
      <el-step title="管理人员信息" />
    </el-steps>
  </div>

  <div class="assign-step-wrapper">
    <!-- 第一步 -->
    <div v-if="activeStep === 1" class="step-box">
      <el-form ref="step1Ref" :model="formData.step1" :rules="formRules" label-width="100px">
        <el-row :gutter="24" justify="start" class="p-4!">
          <ReCol :value="22">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.step1.name" />
            </el-form-item>
          </ReCol>
          <ReCol :value="22">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="formData.step1.phone" />
            </el-form-item>
          </ReCol>
          <ReCol :value="22">
            <el-form-item label="工号" prop="jobNo">
              <el-input v-model="formData.step1.jobNo" />
            </el-form-item>
          </ReCol>
          <ReCol :value="22">
            <el-form-item label="是否加急">
              <el-switch v-model="formData.step1.urgent" />
            </el-form-item>
          </ReCol>
          <ReCol :value="22">
            <el-form-item label="任务类型" prop="options">
              <el-radio-group v-model="formData.step1.options">
                <el-radio label="安装" />
                <el-radio label="维修" />
                <el-radio label="保养" />
                <el-radio label="巡检" />
                <el-radio label="投诉" />
                <el-radio label="其他" />
              </el-radio-group>
            </el-form-item>
          </ReCol>
          <ReCol :value="22">
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="formData.step1.remark" type="textarea" />
            </el-form-item>
          </ReCol>
        </el-row>
      </el-form>
    </div>

    <!-- 第二步 -->
    <div v-if="activeStep === 2" class="step-box">
      <el-form ref="step2Ref" :model="formData.step2" :rules="formRules" label-width="100px">
        <ReCol>
          <el-form-item label="审批部门" prop="approvalDept">
            <el-select v-model="formData.step2.approvalDept">
              <el-option label="运维部" value="运维部" />
              <el-option label="设备部" value="设备部" />
            </el-select>
          </el-form-item>
        </ReCol>
        <ReCol>
          <el-form-item label="抄送部门" prop="copyDept">
            <el-select v-model="formData.step2.copyDept">
              <el-option label="财务部" value="财务部" />
              <el-option label="行政部" value="行政部" />
            </el-select>
          </el-form-item>
        </ReCol>
      </el-form>
    </div>

    <!-- 第三步 -->
    <div v-if="activeStep === 3" class="step-box">
      <el-form ref="step3Ref" :model="formData.step3" :rules="formRules" label-width="100px">
        <ReCol>
          <el-form-item label="姓名" prop="leaderName">
            <el-input v-model="formData.step3.leaderName" />
          </el-form-item>
        </ReCol>
        <ReCol>
          <el-form-item label="电话" prop="leaderPhone">
            <el-input v-model="formData.step3.leaderPhone" />
          </el-form-item>
        </ReCol>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form) {
//  .el-form-item {
//   margin-bottom: 16px;
//  }
 .el-form-item--label-right .el-form-item__label{
  justify-content: center;
  width: 80px !important;
 }
}

.assign-step-wrapper {
  min-height: 400px;
}
</style>
