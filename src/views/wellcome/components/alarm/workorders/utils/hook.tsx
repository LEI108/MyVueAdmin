import type { WorkOrderFormProps, WorkOrderItem } from './types'
import type { ExportColumn } from '@/utils/excel/exportExcel'
import { deviceDetection, isAllEmpty } from '@pureadmin/utils'
import dayjs from 'dayjs'
import { h, onMounted, reactive, ref } from 'vue'
import { addWorkOrder, deleteWorkOrder, getWorkOrderList, updateAlarmStatus, updateWorkOrder } from '@/api/workorder'
import { addDialog } from '@/components/ReDialog'
import { exportExcel } from '@/utils/excel/exportExcel'
import { message } from '@/utils/message'
import { usePublicHooks } from '../../hooks'
import detailView from '../components/detailView.vue'
import editForm from '../components/form.vue'
import { buildExportColumnsFromTable } from "@/utils/excel/buildExportColumns"

export function useWorkOrder() {
  const form = reactive({
    workOrderCode: '',
    status: null as number | null,
    timeRange: [] as string[], // 日期时间段，两个值：开始时间 & 结束时间
  })

  const formRef = ref()
  const dataList = ref<WorkOrderItem[]>([])
  const loading = ref(true)
  const { priorityTagStyle, processStatusTagStyle } = usePublicHooks()

  const columns: TableColumnList = [
    { label: '勾选列', type: 'selection', fixed: 'left', reserveSelection: true },
    { label: '工单编号', prop: 'workOrderCode', minWidth: 140 },
    { label: '指派人员', prop: 'assignee', minWidth: 100 },
    { label: '电话', prop: 'assigneePhone', minWidth: 120 },
    { label: '工号', prop: 'assigneeJobNo', minWidth: 100 },
    { label: '工单描述', prop: 'description', minWidth: 250 },
    { label: '类型', prop: 'type', minWidth: 100 },
    { label: '设备编号', prop: 'deviceCode', minWidth: 120 },
    { label: '设备地点', prop: 'deviceAddress', minWidth: 150 },
    { label: '创建时间', prop: 'createTime', minWidth: 180 },
    { label: '截止时间', prop: 'deadline', minWidth: 180 },
    {
      label: '状态',
      prop: 'status',
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '待处理', 2: '处理中', 3: '已完成' }

        return <el-tag size={props.size} style={processStatusTagStyle.value(row.status)}>{map[row.status]}</el-tag>
      },
    },
    {
      label: '优先级',
      prop: 'priority',
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '低', 2: '中', 3: '高' }
        return <el-tag size={props.size} style={priorityTagStyle.value(row.priority)}>{map[row.priority]}</el-tag>
      },
    },
    { label: '管理人', prop: 'manager', minWidth: 100 },
    { label: '完成时间', prop: 'finishTime', minWidth: 180 },
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
    const { data } = await getWorkOrderList()
    let newData = data

    // 按工单编号过滤
    if (!isAllEmpty(form.workOrderCode)) {
      newData = newData.filter(item => item.workOrderCode.includes(form.workOrderCode))
    }

    // 按状态过滤
    if (!isAllEmpty(form.status)) {
      newData = newData.filter(item => item.status === form.status)
    }

    if (form.timeRange && form.timeRange.length === 2) {
      const [start, end] = form.timeRange
      const startTs = dayjs(start).valueOf()
      const endTs = dayjs(end).valueOf()

      newData = newData.filter((item) => {
        const createTs = dayjs(item.createTime).valueOf()
        return createTs >= startTs && createTs <= endTs
      })
    }

    dataList.value = newData
    setTimeout(() => (loading.value = false), 500)
  }

  function openDialog(title = '新增', row?: WorkOrderItem) {
    addDialog({
      title: `${title}工单`,
      props: { formInline: row ?? {} },
      width: '40%',
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: row ?? {} }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef()
        const curData = formRef.value.localForm as WorkOrderFormProps['formInline']
        function chores() {
          message(`您${title}了编号为${curData.workOrderCode}的工单`, { type: 'success' })
          done() // 关闭弹框
          onSearch() // 刷新表格数据
        }
        FormRef.validate((valid) => {
          if (valid) {
            if (title === '新增') {
              addWorkOrder(curData).then(() => chores())
            }
            else {
              updateWorkOrder(row!.id, curData).then(() => chores())
            }
          }
        })
      },
    })
  }

  function handleDelete(row: WorkOrderItem) {
    deleteWorkOrder(row.id).then(() => {
      message(`工单 ${row.workOrderCode} 删除成功`, { type: 'success' })
      onSearch()
    })
  }

  function handleStatusChange(row: WorkOrderItem, newStatus: number) {
    row.status = newStatus
    updateWorkOrder(row.id, { status: newStatus })
    updateAlarmStatus(row.deviceCode, newStatus)
  }

  // 查看详情弹窗
  function openViewDialog(row: WorkOrderItem) {
    addDialog({
      title: `工单详情 - ${row.workOrderCode}`,
      width: '40%',
      props: { detail: row },
      contentRenderer: () => h(detailView, { detail: row }),
      footerRenderer: () => null,
    })
  }

function onExport() {
  const exportColumns = buildExportColumnsFromTable(columns, {
    fieldFormatters: {
      status: row => ({ 1: "待处理", 2: "处理中", 3: "已完成" }[row.status] ?? ""),
      priority: row => ({ 1: "低", 2: "中", 3: "高" }[row.priority] ?? "")
      // 时间类字段可交由 exportExcel 自动处理；也可以在此覆盖
      // createTime: row => dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
    }
  })

  exportExcel(
    dataList.value,
    exportColumns,
    `工单报表_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    "工单数据"
  )
  message("导出成功", { type: "success" })
}
  onMounted(onSearch)

  return {
    form,
    loading,
    columns,
    dataList,
    onExport,
    onSearch,
    openDialog,
    openViewDialog,
    handleDelete,
    handleStatusChange,
    resetForm,
    handleSelectionChange,
  }
}
