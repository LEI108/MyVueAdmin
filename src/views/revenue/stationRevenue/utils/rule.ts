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

function integerNonNegative(label: string) {
  return (_rule: any, value: any, callback: (error?: Error) => void) => {
    if (value === '' || value === null || value === undefined) {
      return callback(new Error(`请输入${label}`))
    }
    const num = Number(value)
    if (!Number.isInteger(num)) {
      return callback(new Error(`${label}必须为整数`))
    }
    if (num < 0) {
      return callback(new Error(`${label}不能为负数`))
    }
    callback()
  }
}

export const formRules = reactive<FormRules>({
  stationCode: [
    { required: true, message: '请输入充电站编号', trigger: 'blur' },
  ],
  stationName: [
    { required: true, message: '请输入充电站名称', trigger: 'blur' },
  ],
  stationAddress: [
    { required: true, message: '请输入充电站地址', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择运营状态', trigger: 'change' },
  ],
  chargerCount: [
    { required: true, message: '请输入充电桩数量', trigger: 'blur' },
    { validator: integerNonNegative('充电桩数量'), trigger: ['blur', 'change'] },
  ],
  dailyRevenue: [
    { required: true, message: '请输入单日收入', trigger: 'blur' },
    { validator: nonNegative('单日收入'), trigger: ['blur', 'change'] },
  ],
  monthlyRevenue: [
    { required: true, message: '请输入月度收入', trigger: 'blur' },
    { validator: nonNegative('月度收入'), trigger: ['blur', 'change'] },
  ],
  electricityRevenue: [
    { required: true, message: '请输入电费营收', trigger: 'blur' },
    { validator: nonNegative('电费营收'), trigger: ['blur', 'change'] },
  ],
  parkingRevenue: [
    { required: true, message: '请输入停车费营收', trigger: 'blur' },
    { validator: nonNegative('停车费营收'), trigger: ['blur', 'change'] },
  ],
  serviceRevenue: [
    { required: true, message: '请输入服务费营收', trigger: 'blur' },
    { validator: nonNegative('服务费营收'), trigger: ['blur', 'change'] },
  ],
  otherRevenue: [
    { required: true, message: '请输入其他收入', trigger: 'blur' },
    { validator: nonNegative('其他收入'), trigger: ['blur', 'change'] },
  ],
})
