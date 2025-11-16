import type { FormRules } from 'element-plus'
import { reactive } from 'vue'

export const formRules = reactive<FormRules>({
  date: [
    { required: true, message: '请选择日期', trigger: 'change' },
  ],
  stationCode: [
    { required: true, message: '请输入电站编号', trigger: 'blur' },
  ],
  totalGeneration: [
    { required: true, message: '请输入总发电量', trigger: 'blur' },
  ],
  gridGeneration: [
    { required: true, message: '请输入并网发电量', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
})
