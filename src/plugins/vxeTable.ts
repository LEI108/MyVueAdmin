// import XEUtils from "xe-utils";
import type { App } from 'vue'
import {
  VxeAlert,

  //   VxeAnchor,
  //   VxeAnchorLink,
  //   VxeAvatar,
  //   VxeBadge,
  //   VxeBreadcrumb,
  //   VxeBreadcrumbItem,
  //   VxeButton,
  //   VxeButtonGroup,
  //   VxeCalendar,
  //   VxeCard,
  //   VxeCarousel,
  //   VxeCarouselItem,
  //   VxeCheckbox,
  //   VxeCheckboxButton,
  //   VxeCheckboxGroup,
  VxeCol,
  //   VxeCollapse,
  //   VxeCollapsePane,
  //   VxeColorPicker,
  //   VxeCountdown,
  //   VxeDatePanel,
  //   VxeDatePicker,
  //   VxeDateRangePicker,
  //   VxeDrawer,
  //   VxeEmpty,
  //   VxeForm,
  //   VxeFormGather,
  //   VxeFormGroup,
  //   VxeFormItem,
  VxeIcon,
  //   VxeIconPicker,
  //   VxeImage,
  //   VxeImageGroup,
  //   VxeImagePreview,
  //   VxeInput,
  //   VxeLayoutAside,
  //   VxeLayoutBody,
  //   VxeLayoutContainer,
  //   VxeLayoutFooter,
  //   VxeLayoutHeader,
  //   VxeLink,
  //   VxeList,
  //   VxeLoading,
  //   VxeMenu,
  //   VxeModal,
  //   VxeNoticeBar,
  //   VxeNumberInput,
  //   VxeOptgroup,
  //   VxeOption,
  VxePager,
  //   VxePasswordInput,
  //   VxePrint,
  //   VxePrintPageBreak,
  //   VxePulldown,
  //   VxeRadio,
  //   VxeRadioButton,
  //   VxeRadioGroup,
  //   VxeRate,
  //   VxeResult,
  //   VxeRow,
  VxeSelect,
  //   VxeSlider,
  //   VxeSplit,
  //   VxeSplitPane,
  //   VxeSteps,
  //   VxeSwitch,
  //   VxeTableSelect,
  //   VxeTabPane,
  //   VxeTabs,
  //   VxeTag,
  //   VxeText,
  //   VxeTextarea,
  //   VxeTextEllipsis,
  //   VxeTip,
  //   VxeTooltip,
  //   VxeTree,
  //   VxeTreeSelect,
//   VxeUI,
//   VxeUpload,
//   VxeWatermark,
} from 'vxe-pc-ui'

import {
//   VxeColgroup,
  VxeColumn,
  VxeGrid,
  VxeTable,
//   VxeToolbar,
} from 'vxe-table'

// import { i18n } from "@/plugins/i18n";
// 导入默认的语言
// import zhCN from 'vxe-pc-ui/lib/language/zh-CN'
// import enUS from 'vxe-table/lib/locale/lang/en-US'

// 导入主题变量，也可以重写主题变量
import 'vxe-pc-ui/styles/cssvar.scss'
import 'vxe-table/styles/cssvar.scss'

// // 全局默认参数
// VXETable.setConfig({
//   i18n: (key, args) => {
//     return unref(i18n.global.locale) === "zh"
//       ? XEUtils.toFormatString(XEUtils.get(zh, key), args)
//       : XEUtils.toFormatString(XEUtils.get(en, key), args);
//   },
//   translate(key) {
//     const NAMESPACED = ["el.", "buttons."];
//     if (key && NAMESPACED.findIndex(v => key.includes(v)) !== -1) {
//       return i18n.global.t.call(i18n.global.locale, key);
//     }
//     return key;
//   }
// })

export function useVxeTable(app: App) {
  // 表格功能
  app
    .use(VxeAlert)
    // .use(VxeAnchor)
    // .use(VxeAnchorLink)
    // .use(VxeAvatar)
    // .use(VxeBadge)
    // .use(VxeBreadcrumb)
    // .use(VxeBreadcrumbItem)
    // .use(VxeButton)
    // .use(VxeButtonGroup)
    // .use(VxeCalendar)
    // .use(VxeCard)
    // .use(VxeCarousel)
    // .use(VxeCarouselItem)
    // .use(VxeCheckbox)
    // .use(VxeCheckboxButton)
    // .use(VxeCheckboxGroup)
    .use(VxeCol)
    // .use(VxeCollapse)
    // .use(VxeCollapsePane)
    // .use(VxeColorPicker)
    // .use(VxeCountdown)
    // .use(VxeDatePanel)
    // .use(VxeDatePicker)
    // .use(VxeDateRangePicker)
    // .use(VxeDrawer)
    // .use(VxeEmpty)
    // .use(VxeForm)
    // .use(VxeFormGather)
    // .use(VxeFormGroup)
    // .use(VxeFormItem)
    .use(VxeIcon)
    // .use(VxeIconPicker)
    // .use(VxeImage)
    // .use(VxeImageGroup)
    // .use(VxeImagePreview)
    // .use(VxeInput)
    // .use(VxeLayoutAside)
    // .use(VxeLayoutBody)
    // .use(VxeLayoutContainer)
    // .use(VxeLayoutFooter)
    // .use(VxeLayoutHeader)
    // .use(VxeLink)
    // .use(VxeList)
    // .use(VxeLoading)
    // .use(VxeMenu)
    // .use(VxeModal)
    // .use(VxeNoticeBar)
    // .use(VxeNumberInput)
    // .use(VxeOptgroup)
    // .use(VxeOption)
    .use(VxePager)
    // .use(VxePasswordInput)
    // .use(VxePrintPageBreak)
    // .use(VxePrint)
    // .use(VxePulldown)
    // .use(VxeRadio)
    // .use(VxeRadioButton)
    // .use(VxeRadioGroup)
    // .use(VxeRate)
    // .use(VxeResult)
    // .use(VxeRow)
    .use(VxeSelect)
    // .use(VxeSplit)
    // .use(VxeSplitPane)
    // .use(VxeSlider)
    // .use(VxeSteps)
    // .use(VxeSwitch)
    // .use(VxeTabPane)
    // .use(VxeTableSelect)
    // .use(VxeTabs)
    // .use(VxeTag)
    // .use(VxeTextEllipsis)
    // .use(VxeText)
    // .use(VxeTextarea)
    // .use(VxeTip)
    // .use(VxeTooltip)
    // .use(VxeTree)
    // .use(VxeTreeSelect)
    // .use(VxeUpload)
    // .use(VxeWatermark)
    .use(VxeTable)
    .use(VxeColumn)
    // .use(VxeColgroup)
    .use(VxeGrid)
    // .use(VxeToolbar)
}
