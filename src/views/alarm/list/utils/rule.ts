import type { FormRules } from 'element-plus'
import { isPhone } from '@pureadmin/utils'
import { reactive } from 'vue'

/** 告警表单+指派表单规则 */
export const formRules = reactive<FormRules>({
  // --------------- 告警表单规则 ---------------
  deviceCode: [
    { required: true, message: '设备编号为必填项', trigger: 'blur' },
  ],
  deviceAddress: [
    { required: true, message: '设备地址为必填项', trigger: 'blur' },
  ],
  faultDesc: [
    { required: true, message: '故障描述为必填项', trigger: 'blur' },
  ],
  alarmTime: [
    { required: true, message: '请选择告警时间', trigger: 'change' },
  ],
  alarmLevel: [
    { required: true, message: '请选择告警级别', trigger: 'change' },
  ],
  status: [
    { required: true, message: '请选择处理状态', trigger: 'change' },
  ],

  // --------------- 指派表单规则 ----------------
  /** 第一步 - 被指派人员信息 */
  name: [
    { required: true, message: '姓名为必填项', trigger: 'blur' },
  ],
  phone: [
    {
      required: true,
      message: '电话为必填项',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback()
        }
        else if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号码格式'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  jobNo: [
    { required: true, message: '工号为必填项', trigger: 'blur' },
  ],
  options: [
    {
      type: 'array',
      required: true,
      message: '请选择任务类型',
      trigger: 'change',
    },
  ],
  remark: [
    { required: false, message: '备注信息', trigger: 'blur' },
  ],

  /** 第二步 - 审批部门信息 */
  approvalDept: [
    { required: true, message: '请选择审批部门', trigger: 'change' },
  ],
  copyDept: [
    { required: true, message: '请选择抄送部门', trigger: 'change' },
  ],

  /** 第三步 - 管理人员信息 */
  leaderName: [
    { required: true, message: '管理人员姓名为必填项', trigger: 'blur' },
  ],
  leaderPhone: [
    {
      required: true,
      message: '电话为必填项',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback()
        }
        else if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号码格式'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
