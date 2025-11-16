// src/views/stationRevenue/utils/hook.tsx
import type { AdaptiveConfig, LoadingConfig, PaginationProps } from '@pureadmin/table'
import type { FormItemProps, StationRevenueItem } from './types'
import { deviceDetection, isAllEmpty } from '@pureadmin/utils'
import dayjs from 'dayjs'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { addStationRevenue, deleteStationRevenue, getStationRevenueList, updateStationRevenue } from '@/api/stationRevenue'
import { addDialog } from '@/components/ReDialog'
import { buildExportColumnsFromTable } from '@/utils/excel/buildExportColumns'
import { exportExcel } from '@/utils/excel/exportExcel'
import { message } from '@/utils/message'
import { usePublicHooks } from '../../hooks'
import detailView from '../components/detailView.vue'
import editForm from '../components/form.vue'

const { statusTagStyle } = usePublicHooks()

export function useStationRevenue() {
  const form = reactive({
    stationCode: '',
    status: null as number | null,
  })

  const formRef = ref()
  const dataList = ref<StationRevenueItem[]>([])
  const loading = ref(true)

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

  const pagedData = computed(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return dataList.value.slice(start, end)
  })

  const columns: TableColumnList = [
    { label: '充电站编号', prop: 'stationCode', minWidth: 120 },
    { label: '充电站名称', prop: 'stationName', minWidth: 150 },
    { label: '充电站地址', prop: 'stationAddress', minWidth: 200 },
    {
      label: '运营状态',
      prop: 'status',
      minWidth: 110,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '正常运营', 2: '维护中', 3: '暂停服务' }
        return <el-tag size={props.size} style={statusTagStyle.value(row.status)}>{map[row.status]}</el-tag>
      },
    },
    { label: '充电桩数量', prop: 'chargerCount', minWidth: 100, sortable: true },
    { label: '单日收入', prop: 'dailyRevenue', minWidth: 120, sortable: true },
    { label: '月度收入', prop: 'monthlyRevenue', minWidth: 120, sortable: true },
    { label: '电费营收', prop: 'electricityRevenue', minWidth: 120, sortable: true },
    { label: '停车费营收', prop: 'parkingRevenue', minWidth: 120, sortable: true },
    { label: '服务费营收', prop: 'serviceRevenue', minWidth: 120, sortable: true },
    { label: '其他收入', prop: 'otherRevenue', minWidth: 120, sortable: true },
    { label: '操作', fixed: 'right', width: 210, slot: 'operation' },
  ]

  function resetForm(formEl) {
    if (formEl) {
      formEl.resetFields()
      onSearch()
    }
  }

  function handleSelectionChange(val) {
    window.console.log('handleSelectionChange', val)
  }

  async function onSearch() {
    loading.value = true
    const { data } = await getStationRevenueList()
    let newData = data
    if (!isAllEmpty(form.stationCode)) {
      newData = newData.filter(item => item.stationCode.includes(form.stationCode))
    }
    if (!isAllEmpty(form.status)) {
      newData = newData.filter(item => item.status === form.status)
    }
    dataList.value = newData
    pagination.total = newData.length
    pagination.currentPage = 1
    setTimeout(() => loading.value = false, 300)
  }

  function openDialog(title = '新增', row?: StationRevenueItem) {
    addDialog({
      title: `${title}电站营收报表`,
      props: { formInline: row || {} },
      width: '40%',
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: row || {} }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef()
        const curData = options.props.formInline as FormItemProps
        FormRef.validate((valid) => {
          if (valid) {
            if (title === '新增') {
              addStationRevenue(curData).then(() => {
                message('新增成功', { type: 'success' })
                done()
                onSearch()
              })
            }
            else {
              updateStationRevenue(row!.id, curData).then(() => {
                message('编辑成功', { type: 'success' })
                done()
                onSearch()
              })
            }
          }
        })
      },
    })
  }

  function openViewDialog(row: StationRevenueItem) {
    addDialog({
      title: `电站营收报表详情 - ${row.stationCode}`,
      width: '50%',
      props: { detail: row },
      contentRenderer: () => h(detailView, { detail: row }),
      footerRenderer: () => null,
    })
  }

  function handleDelete(row: StationRevenueItem) {
    deleteStationRevenue(row.id).then(() => {
      message('删除成功', { type: 'success' })
      onSearch()
    })
  }

  function onExport() {
    const exportColumns = buildExportColumnsFromTable(columns)
    exportExcel(dataList.value, exportColumns, `电站营收报表_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`, '电站营收数据')
    message('导出成功', { type: 'success' })
  }

  function onSizeChange(val: number) {
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

  onMounted(onSearch)

  return {
    form,
    loading,
    columns,
    pagedData,
    onSearch,
    resetForm,
    openDialog,
    openViewDialog,
    handleDelete,
    onExport,
    pagination,
    loadingConfig,
    adaptiveConfig,
    onSizeChange,
    onCurrentChange,
    handleSelectionChange,
  }
}
