import type { AdaptiveConfig, LoadingConfig, PaginationProps } from '@pureadmin/table'
import type { FormItemProps, PowerReportItem } from './types'
import { deviceDetection, isAllEmpty } from '@pureadmin/utils'
import dayjs from 'dayjs'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { addPowerReport, deletePowerReport, getPowerReportList, updatePowerReport } from '@/api/powerReport'
import { addDialog } from '@/components/ReDialog'
import { buildExportColumnsFromTable } from '@/utils/excel/buildExportColumns'
import { exportExcel } from '@/utils/excel/exportExcel'
import { message } from '@/utils/message'
import detailView from '../components/detailView.vue' // 新增导入详情组件
import editForm from '../components/form.vue'

export function usePowerReport() {
  const form = reactive({
    stationCode: '',
    status: null as number | null,
    timeRange: [] as string[],
  })

  const formRef = ref()
  const dataList = ref<PowerReportItem[]>([])
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
    { label: '勾选列', type: 'selection', fixed: 'left', reserveSelection: true },
    { label: '日期', prop: 'date', minWidth: 130, sortable: true },
    { label: '电站编号', prop: 'stationCode', minWidth: 120 },
    { label: '总发电量(kWh)', prop: 'totalGeneration', minWidth: 120, sortable: true },
    { label: '并网发电量(kWh)', prop: 'gridGeneration', minWidth: 120, sortable: true },
    { label: '自用电量(kWh)', prop: 'selfUseGeneration', minWidth: 120, sortable: true },
    { label: '电量损耗(kWh)', prop: 'powerLoss', minWidth: 120, sortable: true },
    { label: '峰段电量(kWh)', prop: 'peakGeneration', minWidth: 120, sortable: true },
    { label: '谷段电量(kWh)', prop: 'valleyGeneration', minWidth: 120, sortable: true },
    { label: '平段电量(kWh)', prop: 'flatGeneration', minWidth: 120, sortable: true },
    { label: '效率(%)', prop: 'efficiency', minWidth: 100, sortable: true },
    { label: '利用率(小时)', prop: 'utilizationHours', minWidth: 120, sortable: true },
    { label: '状态', prop: 'status', minWidth: 100 },
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
    const { data } = await getPowerReportList()
    let newData = data

    if (!isAllEmpty(form.stationCode)) {
      newData = newData.filter(item => item.stationCode.includes(form.stationCode))
    }
    if (!isAllEmpty(form.status)) {
      newData = newData.filter(item => item.status === form.status)
    }
    // 按日期过滤
    if (form.timeRange && form.timeRange.length === 2) {
      const [start, end] = form.timeRange
      const startTs = dayjs(start).valueOf()
      const endTs = dayjs(end).valueOf()

      newData = newData.filter((item) => {
        const createTs = dayjs(item.date).valueOf()
        return createTs >= startTs && createTs <= endTs
      })
    }

    dataList.value = newData
    pagination.total = newData.length
    pagination.currentPage = 1
    setTimeout(() => loading.value = false, 300)
  }

  function openDialog(title = '新增', row?: PowerReportItem) {
    addDialog({
      title: `${title}发电报表`,
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
              addPowerReport(curData).then(() => {
                message('新增成功', { type: 'success' })
                done()
                onSearch()
              })
            }
            else {
              updatePowerReport(row!.id, curData).then(() => {
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

  // 新增的查看详情方法
  function openViewDialog(row: PowerReportItem) {
    addDialog({
      title: `发电报表详情 - ${row.stationCode}`,
      width: '50%',
      props: { detail: row },
      contentRenderer: () => h(detailView, { detail: row }),
      footerRenderer: () => null,
    })
  }

  function handleDelete(row: PowerReportItem) {
    deletePowerReport(row.id).then(() => {
      message('删除成功', { type: 'success' })
      onSearch()
    })
  }

  function onExport() {
    const exportColumns = buildExportColumnsFromTable(columns)
    exportExcel(dataList.value, exportColumns, `发电报表_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`, '发电数据')
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
