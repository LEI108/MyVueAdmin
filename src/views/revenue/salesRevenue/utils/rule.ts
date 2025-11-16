import type { FormRules } from 'element-plus'
import { reactive } from 'vue'

function nonNegative(label: string) {
  return (_rule: any, value: any, callback: (error?: Error) => void) => {
    if (value === '' || value === null || value === undefined) {
      return callback(new Error(`请输入${label}`))
    }
    const num = Number(value)
    if (Number.isNaN(num)) {
      return callback(new Error(`${label}必须为数字`))
    }
    if (num < 0) {
      return callback(new Error(`${label}不能为负数`))
    }
    callback()
  }
}

export const formRules = reactive<FormRules>({
  date: [
    { required: true, message: '请选择日期', trigger: 'change' },
  ],
  peakPrice: [
    { required: true, message: '请输入峰段电价', trigger: 'blur' },
    { validator: nonNegative('峰段电价'), trigger: ['blur', 'change'] },
  ],
  valleyPrice: [
    { required: true, message: '请输入谷段电价', trigger: 'blur' },
    { validator: nonNegative('谷段电价'), trigger: ['blur', 'change'] },
  ],
  flatPrice: [
    { required: true, message: '请输入平段电价', trigger: 'blur' },
    { validator: nonNegative('平段电价'), trigger: ['blur', 'change'] },
  ],
  averagePrice: [
    { required: true, message: '请输入平均电价', trigger: 'blur' },
    { validator: nonNegative('平均电价'), trigger: ['blur', 'change'] },
  ],
  salesRevenue: [
    { required: true, message: '请输入售电收入', trigger: 'blur' },
    { validator: nonNegative('售电收入'), trigger: ['blur', 'change'] },
  ],
  subsidyRevenue: [
    { required: true, message: '请输入补贴收入', trigger: 'blur' },
    { validator: nonNegative('补贴收入'), trigger: ['blur', 'change'] },
  ],
  totalRevenue: [
    { required: true, message: '请输入总营收', trigger: 'blur' },
    { validator: nonNegative('总营收'), trigger: ['blur', 'change'] },
  ],
  omCost: [
    { required: true, message: '请输入运维成本', trigger: 'blur' },
    { validator: nonNegative('运维成本'), trigger: ['blur', 'change'] },
  ],
  netProfit: [
    { required: true, message: '请输入净利润', trigger: 'blur' },
    { validator: nonNegative('净利润'), trigger: ['blur', 'change'] },
  ],
})
