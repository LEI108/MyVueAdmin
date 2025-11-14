import type { WorkOrderFormProps, WorkOrderItem } from './types'
import { deviceDetection, isAllEmpty } from '@pureadmin/utils'
import { h, onMounted, reactive, ref } from 'vue'
import { addWorkOrder, deleteWorkOrder, getWorkOrderList, updateAlarmStatus, updateWorkOrder } from '@/api/workorder'
import { addDialog } from '@/components/ReDialog'
import { message } from '@/utils/message'
import { usePublicHooks } from '../../hooks'
import detailView from '../components/detailView.vue'
import editForm from '../components/form.vue'

export function useWorkOrder() {
  const form = reactive({
    workOrderCode: '',
    status: null as number | null,
  })

  const formRef = ref()
  const dataList = ref<WorkOrderItem[]>([])
  const loading = ref(true)
  const { priorityTagStyle, processStatusTagStyle } = usePublicHooks()

  const columns: TableColumnList = [
    { label: '勾选列', type: 'selection', fixed: 'left', reserveSelection: true },
    { label: '设备编号', prop: 'deviceCode', minWidth: 120 },
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
        return <el-tag size={props.size} style={priorityTagStyle.value(row.alarmLevel)}>{map[row.alarmLevel]}</el-tag>
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
          message(`您${title}了设备编号为${curData.deviceCode}的告警`, { type: 'success' })
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

  onMounted(onSearch)

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    openDialog,
    openViewDialog,
    handleDelete,
    handleStatusChange,
    resetForm,
    handleSelectionChange,
  }
}
