// utils/buildExportColumns.ts
import type { ExportColumn } from "./exportExcel"

/**
 * 将 UI 表格列（TableColumnList）适配为导出列（ExportColumn[]）
 * options 可配置要排除的列类型/插槽，以及字段级的 formatter 映射。
 */
export interface BuildExportOptions {
  excludeTypes?: string[]              // 默认：["selection", "index", "expand"]
  excludeSlots?: string[]              // 默认：["operation", "actions"]
  fieldFormatters?: Record<string, (row: any) => any> // 每个 prop 的自定义格式化
}

/**
 * 注意：TableColumn 类型示意（你项目已有具体定义）
 * 仅用到 label、prop、type、slot，其他 UI 字段不参与导出
 */
type TableColumn = {
  label?: string
  prop?: string | ((index: number) => string)
  type?: string
  slot?: string
}

export function buildExportColumnsFromTable(
  tableColumns: TableColumn[],
  options: BuildExportOptions = {}
): ExportColumn[] {
  const {
    excludeTypes = ["selection", "index", "expand"],
    excludeSlots = ["operation", "actions"],
    fieldFormatters = {}
  } = options

  return tableColumns
    // 过滤非数据列
    .filter(c => {
      const isNonData = excludeTypes.includes(String(c.type))
      const isExcludedSlot = excludeSlots.includes(String(c.slot))
      return !isNonData && !isExcludedSlot
    })
    // 只保留导出需要的字段，并确保类型安全
    .map(c => {
      const label = (c.label ?? "") as string
      const prop = typeof c.prop === "function" ? undefined : (c.prop as string | undefined)

      const ec: ExportColumn = {
        label,
        prop,
        type: c.type ? String(c.type) : undefined,
        slot: c.slot ? String(c.slot) : undefined
      }

      // 注入字段级 formatter（业务可配置）
      if (prop && fieldFormatters[prop]) {
        ec.formatter = fieldFormatters[prop]
      }

      return ec
    })
    // 最终保证 label 和 prop 都存在
    .filter(c => Boolean(c.label) && Boolean(c.prop))
}