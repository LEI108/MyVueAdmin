import type { WorkOrderFormProps, WorkOrderItem } from './types'
import dayjs from 'dayjs'
import { h, onMounted, reactive, ref } from 'vue'
import { addWorkOrder, deleteWorkOrder, getWorkOrderList, updateAlarmStatus, updateWorkOrder } from '@/api/workorder'
import { addDialog } from '@/components/ReDialog'
import { message } from '@/utils/message'
import editForm from '../components/form.vue'

export function useWorkOrder() {
  const form = reactive({
    workOrderCode: '',
    status: null as number | null,
  })

  const loading = ref(true)
  const dataList = ref<WorkOrderItem[]>([])
  const formRef = ref()

  const columns: TableColumnList = [
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
    { label: '状态', prop: 'status', minWidth: 100 },
    { label: '优先级', prop: 'priority', minWidth: 100 },
    { label: '管理人', prop: 'manager', minWidth: 100 },
    { label: '完成时间', prop: 'finishTime', minWidth: 180 },
    { label: '操作', fixed: 'right', width: 210, slot: 'operation' },
  ]

  async function onSearch() {
    loading.value = true
    const { data } = await getWorkOrderList()
    dataList.value = data
    setTimeout(() => (loading.value = false), 500)
  }

  function openDialog(title = '新增', row?: WorkOrderItem) {
    addDialog({
      title: `${title}工单`,
      props: { formInline: row ?? {} },
      width: '40%',
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: row ?? {} }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef()
        const curData = options.props.formInline as WorkOrderFormProps['formInline']

        FormRef.validate((valid) => {
          if (valid) {
            if (title === '新增') {
              addWorkOrder(curData).then(() => {
                message('工单添加成功', { type: 'success' })
                done()
                onSearch()
              })
            }
            else {
              updateWorkOrder(row!.id, curData).then(() => {
                message('工单更新成功', { type: 'success' })
                done()
                onSearch()
              })
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

  onMounted(onSearch)

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    openDialog,
    handleDelete,
    handleStatusChange,
  }
}
