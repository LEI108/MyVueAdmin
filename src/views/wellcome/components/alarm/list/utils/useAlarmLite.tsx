import type { AdaptiveConfig, LoadingConfig, PaginationProps } from '@pureadmin/table'
import type { AlarmItem } from './types'
import { isAllEmpty } from '@pureadmin/utils'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { getAlarmList } from '@/api/alarm'
import Empty from '@/assets/svg/empty.svg?component'
import { usePublicHooks } from '../../hooks'

export function useAlarmLite() {
  const form = reactive({
    deviceCode: '',
    status: null as number | null,
  })
  const dataList = ref<AlarmItem[]>([])
  const loading = ref(true)
  const { alarmLevelTagStyle, processStatusTagStyle } = usePublicHooks()

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: false,
    align: 'center',
    size: 'small',
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
    offsetBottom: 45, // 可按页面结构微调；你原来是 45，如果空间紧张可以继续用 45
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

  // 只保留数据列，并且给时间列加上排序
  const columns: TableColumnList = [
    { label: '设备编号', prop: 'deviceCode', minWidth: 90 },
    { label: '设备地址', prop: 'deviceAddress', minWidth: 160 },
    { label: '故障描述', prop: 'faultDesc', minWidth: 120 },
    {
      label: '告警时间',
      prop: 'alarmTime',
      minWidth: 160,
      sortable: true, // 开启排序功能
      formatter: ({ alarmTime }) =>
        dayjs(alarmTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '告警级别',
      prop: 'alarmLevel',
      minWidth: 110,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '轻微', 2: '中等', 3: '严重' }
        return (
          <el-tag
            size={props.size}
            style={alarmLevelTagStyle.value(row.alarmLevel)}
          >
            {map[row.alarmLevel]}
          </el-tag>
        )
      },
    },
    {
      label: '处理状态',
      prop: 'status',
      minWidth: 110,
      cellRenderer: ({ row, props }) => {
        const map = { 1: '待指派', 2: '处理中', 3: '已完成' }
        return (
          <el-tag
            size={props.size}
            style={processStatusTagStyle.value(row.status)}
          >
            {map[row.status]}
          </el-tag>
        )
      },
    },
    { label: '操作', fixed: 'right', width: 120, slot: 'operation' },
  ]

  function handleSelectionChange(val) {
    window.console.log('handleSelectionChange', val)
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
    Empty,
    onSearch,
    loadingConfig,
    adaptiveConfig,
    pagedData,
    onSizeChange,
    onCurrentChange,
    pagination,
    handleSelectionChange,
  }
}
