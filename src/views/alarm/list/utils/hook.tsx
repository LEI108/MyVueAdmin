import type { AlarmItem, FormItemProps } from './types'
import { deviceDetection, isAllEmpty } from '@pureadmin/utils'
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'
import { h, onMounted, reactive, ref } from 'vue'
import { addAlarm, assignAlarm, deleteAlarm, getAlarmList, updateAlarm } from '@/api/alarm'
import { addDialog, closeDialog } from '@/components/ReDialog'
import { message } from '@/utils/message'
import { usePublicHooks } from '../../hooks'
import assignForm from '../components/assignForm.vue'
import editForm from '../components/form.vue'

export function useAlarm() {
  const form = reactive({
    deviceCode: '',
    status: null as number | null,
  })

  const formRef = ref()
  const dataList = ref<AlarmItem[]>([])
  const loading = ref(true)
  const { alarmLevelTagStyle, processStatusTagStyle } = usePublicHooks()

  const columns: TableColumnList = [
    { label: '勾选列', type: 'selection', fixed: 'left', reserveSelection: true },
    { label: '设备编号', prop: 'deviceCode', minWidth: 120 },
    { label: '设备地址', prop: 'deviceAddress', minWidth: 200 },
    { label: '故障描述', prop: 'faultDesc', minWidth: 200 },
    {
      label: '告警时间',
      prop: 'alarmTime',
      minWidth: 180,
      formatter: ({ alarmTime }) => dayjs(alarmTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '告警级别',
      prop: 'alarmLevel',
      minWidth: 120,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '轻微', 2: '中等', 3: '严重' }
        return <el-tag size={props.size} style={alarmLevelTagStyle.value(row.alarmLevel)}>{map[row.alarmLevel]}</el-tag>
      },
    },
    {
      label: '处理状态',
      prop: 'status',
      minWidth: 120,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '待指派', 2: '处理中', 3: '已完成' }

        return <el-tag size={props.size} style={processStatusTagStyle.value(row.status)}>{map[row.status]}</el-tag>
      },
    },
    { label: '操作', fixed: 'right', width: 210, slot: 'operation' },
  ]

  function handleSelectionChange(val) {
    window.console.log('handleSelectionChange', val)
  }

  function resetForm(formEl) {
    if (!formEl)
      return
    formEl.resetFields()
    onSearch()
  }

  async function onSearch() {
    loading.value = true
    const { data } = await getAlarmList()
    let newData = data
    if (!isAllEmpty(form.deviceCode)) {
      newData = newData.filter(item => item.deviceCode.includes(form.deviceCode))
    }
    if (!isAllEmpty(form.status)) {
      newData = newData.filter(item => item.status === form.status)
    }
    dataList.value = newData
    setTimeout(() => {
      loading.value = false
    }, 500)
  }

  function openDialog(title = '新增', row?: AlarmItem) {
    addDialog({
      title: `${title}故障`,
      props: {
        formInline: {
          deviceCode: row?.deviceCode ?? '',
          deviceAddress: row?.deviceAddress ?? '',
          faultDesc: row?.faultDesc ?? '',
          alarmTime: row?.alarmTime ?? dayjs().format('YYYY-MM-DD HH:mm:ss'),
          alarmLevel: row?.alarmLevel ?? 1,
          status: row?.status ?? 1,
        },
      },
      width: '40%',
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef()
        const curData = options.props.formInline as FormItemProps
        function chores() {
          message(`您${title}了设备编号为${curData.deviceCode}的告警`, { type: 'success' })
          done() // 关闭弹框
          onSearch() // 刷新表格数据
        }
        FormRef.validate((valid) => {
          if (valid) {
            window.console.log('curData', curData)
            // 表单规则校验通过
            if (title === '新增') {
              addAlarm(curData).then(() => chores())
            }
            else {
              updateAlarm(row!.id, curData).then(() => chores())
            }
          }
        })
      },
    })
  }

  function handleDelete(row: AlarmItem) {
    deleteAlarm(row.id).then(() => {
      message(`您删除了设备编号为${row.deviceCode}的告警`, { type: 'success' })
      onSearch()
    })
  }

  function openAssignDialog(row) {
  // 让 contentRenderer 和 footerRenderer 共享同一个表单组件引用
    const compRef = ref()

    addDialog({
      title: `指派告警（设备：${row.deviceCode}）`,
      width: '40%',
      closeOnClickModal: false,

      // 内容区渲染 assignForm
      contentRenderer: ({ options, index }) =>
        h(assignForm, {
          ref: compRef,
          onSubmit: (formData) => {
          // 提交成功后自动关闭弹窗
            assignAlarm(row.id, formData).then(() => {
              message('指派成功', { type: 'success' })
              // 刷新数据
              onSearch()
              // 关闭弹窗
              closeDialog(options, index)
            })
          },
        }),

      // 底部统一按钮（footerRenderer）
      footerRenderer: ({ options, index }) => {
      /**
       * 由于 footerRenderer 会在弹窗创建时执行一次，因此
       *  点击按钮时去访问 compRef.value 是可以的，
       *  因为在渲染阶段它已经绑定到 assignForm 组件实例
       */
        return h(
          'div',
          { style: 'display:flex;justify-content:flex-end;gap:8px' },
          [
            h(ElButton, { onClick: () => closeDialog(options, index) }, '取消'),
            compRef.value?.activeStep > 1
            && h(ElButton, { onClick: () => compRef.value?.prevStep() }, '上一步'),
            compRef.value?.activeStep < 3
              ? h(ElButton, { type: 'primary', onClick: () => compRef.value?.nextStep() }, '下一步')
              : h(ElButton, { type: 'success', onClick: () => compRef.value?.submit() }, '提交'),
          ].filter(Boolean), // 过滤掉 undefined 按钮
        )
      },
    })
  }

  onMounted(() => {
    onSearch()
  })

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange,
    openAssignDialog,
  }
}
