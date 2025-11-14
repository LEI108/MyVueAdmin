// exportExcel.ts
import dayjs from 'dayjs'
import { utils, writeFile } from 'xlsx'

// 列配置类型，可根据项目调整
export interface ExportColumn {
  label: string // 表头名称
  prop?: string // 数据字段，如果是嵌套字段用点路径
  type?: string // 列类型：selection/index/expand等
  slot?: string // 操作列等自定义插槽标识
  formatter?: (row: any) => any // 格式化方法
}

// 安全获取对象的嵌套字段值
function getValueByPath(obj: any, path?: string) {
  if (!path)
    return undefined
  return path.split('.').reduce((o, p) => (o == null ? o : o[p]), obj)
}

// 自动格式化单元格值
function formatCell(column: ExportColumn, value: any) {
  if (value == null)
    return ''

  const key = column.prop || ''

  // 时间字段
  if (/time|date/i.test(key)) {
    const d = dayjs(value)
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(value)
  }

  // 长数字，防止科学计数法（如工单编号、手机号）
  const str = String(value)
  if (/^\d{12,}$/.test(str))
    return str

  return value
}

/**
 * 导出 Excel
 * @param rows 数据源（数组）
 * @param columns 列配置
 * @param fileName 文件名（可选，默认带时间戳）
 * @param sheetName 工作表名（默认：数据报表）
 */
export function exportExcel(
  rows: any[],
  columns: ExportColumn[],
  fileName?: string,
  sheetName: string = '数据报表',
) {
  if (!rows?.length)
    throw new Error('没有可导出的数据')

  // 过滤非数据列
  const exportColumns = columns.filter((c) => {
    const isNonData = ['selection', 'index', 'expand'].includes(String(c.type))
    const isOpCol = ['operation', 'actions'].includes(String(c.slot))
    return !isNonData && !isOpCol && c.label && c.prop
  })
  if (!exportColumns.length)
    throw new Error('没有可导出的有效列')

  // 表头
  const header = exportColumns.map(c => c.label)

  // 表体
  const body = rows.map(row =>
    exportColumns.map((col) => {
      const rawValue = col.formatter
        ? col.formatter(row)
        : getValueByPath(row, col.prop)
      return formatCell(col, rawValue)
    }),
  )

  // 生成工作表
  const ws = utils.aoa_to_sheet([header, ...body])

  // 自动列宽
  ws['!cols'] = header.map((_, i) => {
    const maxLen = Math.max(
      String(header[i]).length,
      ...body.map(r => String(r[i] ?? '').length),
    )
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) }
  })

  // 工作簿
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, sheetName)

  // 保存
  const finalName
    = fileName || `数据报表_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`
  writeFile(wb, finalName)
}
