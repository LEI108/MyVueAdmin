import type { FormRules } from 'element-plus'
import { isPhone } from '@pureadmin/utils'
import { reactive } from 'vue'

export const workOrderRules = reactive<FormRules>({
  workOrderCode: [{ required: true, message: '工单编号为必填项', trigger: 'blur' }],
  assignee: [{ required: true, message: '指派人员为必填项', trigger: 'blur' }],
  assigneePhone: [
    { required: true, message: '电话为必填项', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value && !isPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  description: [{ required: true, message: '工单描述为必填项', trigger: 'blur' }],
  type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
  deviceCode: [{ required: true, message: '设备编号为必填项', trigger: 'blur' }],
  deviceAddress: [{ required: true, message: '设备地点为必填项', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
})
