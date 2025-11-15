import type { AdaptiveConfig, LoadingConfig, PaginationProps } from '@pureadmin/table'
import type { AlarmItem, FormItemProps } from './types'
import { deviceDetection, isAllEmpty } from '@pureadmin/utils'
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { addAlarm, assignAlarm, deleteAlarm, getAlarmList, updateAlarm } from '@/api/alarm'
import { addWorkOrder } from '@/api/workorder' // 新增引入工单接口
import { addDialog, closeDialog } from '@/components/ReDialog'
import { buildExportColumnsFromTable } from '@/utils/excel/buildExportColumns'
import { exportExcel } from '@/utils/excel/exportExcel'
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

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true,
    align: 'right',
    size: 'default',
  })

  // 加载动画配置（可选）
  const loadingConfig = reactive<LoadingConfig>({
    text: '正在加载第一页...',
    viewBox: '-10, -10, 50, 50',
    spinner: `
      <path class="path" d="
        M 30 15
        L 28 17
        M 25.61 25.61
        A 15 15, 0, 0, 1, 15 30
        A 15 15, 0, 1, 1, 27.99 7.5
        L 15 15
      " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
    `,
  })

  // 撑满内容区自适应高度（保持滚动）
  const adaptiveConfig: AdaptiveConfig = {
    offsetBottom: 110, // 可按页面结构微调；你原来是 45，如果空间紧张可以继续用 45
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    fixHeader: true,
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    timeout: 60,
    /** 表头的 `z-index`，默认值为 `100` */
    // zIndex: 100
  }

  // 当前页数据（用于表格 data）
  const pagedData = computed(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return dataList.value.slice(start, end)
  })

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

    pagination.total = newData.length
    pagination.currentPage = 1

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
    const compRef = ref()

    addDialog({
      title: `指派告警（设备：${row.deviceCode}）`,
      width: '40%',
      closeOnClickModal: false,

      contentRenderer: ({ options, index }) =>
        h(assignForm, {
          ref: compRef,
          onSubmit: (formData) => {
          // 提交告警指派
            assignAlarm(row.id, formData).then(() => {
              message('指派成功', { type: 'success' })

              // ====== 工单生成逻辑开始 ======
              const now = dayjs()
              const deadline = now.add(Math.floor(Math.random() * 7) + 1, 'day')

              // 构建描述
              const descParts = []
              // 1. 告警表单中的故障描述
              if (row.faultDesc)
                descParts.push(row.faultDesc)
              // 2. 如果勾选了“安装”类型
              if (formData.step1.options.includes('安装')) {
                descParts.push('需要安装')
              }
              // 3. 备注信息
              if (formData.step1.remark) {
                descParts.push(formData.step1.remark)
              }
              const description = descParts.join('；')

              // 组装工单数据
              const workOrderData = {
                assignee: formData.step1.name,
                assigneePhone: formData.step1.phone,
                assigneeJobNo: formData.step1.jobNo,
                description,
                type: formData.step1.options,
                deviceCode: row.deviceCode,
                deviceAddress: row.deviceAddress,
                createTime: now.format('YYYY-MM-DD HH:mm:ss'),
                deadline: deadline.format('YYYY-MM-DD HH:mm:ss'),
                status: 1, // 待处理
                priority: 2, // 中
                manager: formData.step3.leaderName,
                finishTime: '',
              }

              // 调用工单API
              addWorkOrder(workOrderData).then(() => {
                message('工单已自动生成', { type: 'success' })
              })
              // ====== 工单生成逻辑结束 ======

              // 刷新告警表格
              onSearch()
              closeDialog(options, index)
            })
          },
        }),

      footerRenderer: ({ options, index }) => {
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
          ].filter(Boolean),
        )
      },
    })
  }

  function onExport() {
    const exportColumns = buildExportColumnsFromTable(columns, {
      fieldFormatters: {
        alarmTime: row => dayjs(row.alarmTime).format('YYYY-MM-DD HH:mm:ss'),
        alarmLevel: row => ({ 1: '轻微', 2: '中等', 3: '严重' }[row.alarmLevel] ?? ''),
        status: row => ({ 1: '待指派', 2: '处理中', 3: '已完成' }[row.status] ?? ''),
      },
    })

    exportExcel(
      dataList.value,
      exportColumns,
      `告警报表_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`,
      '告警数据',
    )
    message('导出成功', { type: 'success' })
  }

  function onSizeChange(val) {
    pagination.pageSize = val
    pagination.currentPage = 1
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`
    loading.value = true
    pagination.currentPage = val
    setTimeout(() => {
      loading.value = false
    }, 600)
  }

  onMounted(() => {
    onSearch()
  })

  return {
    form,
    loading,
    columns,
    dataList,
    onExport,
    onSearch,
    resetForm,
    openDialog,
    pagination,
    handleDelete,
    handleSelectionChange,
    openAssignDialog,
    loadingConfig,
    adaptiveConfig,
    pagedData,
    onSizeChange,
    onCurrentChange,
  }
}
