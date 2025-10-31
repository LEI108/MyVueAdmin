import { addIcon } from '@iconify/vue/dist/offline'
// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { getSvgInfo } from '@pureadmin/utils'

import EpEdit from '~icons/ep/edit?raw'
import EpGuide from '~icons/ep/guide?raw'
import EpHistogram from '~icons/ep/histogram?raw'
import EpHomeFilled from '~icons/ep/home-filled?raw'
import EpLollipop from '~icons/ep/lollipop?raw'
// https://icon-sets.iconify.design/ep/?keyword=ep
import EpMenu from '~icons/ep/menu?raw'
import EpMonitor from '~icons/ep/monitor?raw'
import EpSetUp from '~icons/ep/set-up?raw'
// Phosphor Icons
import PhArrowsHorizontal from '~icons/ph/arrows-horizontal?raw'
import PhArrowsInSimple from '~icons/ph/arrows-in-simple?raw'
import PhBag from '~icons/ph/bag?raw'
import PhBellRinging from '~icons/ph/bell-ringing?raw'
import PhBell from '~icons/ph/bell?raw'
import PhCalculator from '~icons/ph/calculator?raw'
import PhCarBattery from '~icons/ph/car-battery?raw'
import PhCaretDown from '~icons/ph/caret-down?raw'
import PhChartBar from '~icons/ph/chart-bar?raw'
import PhClipboardText from '~icons/ph/clipboard-text?raw'
import PhCornersOut from '~icons/ph/corners-out?raw'
import PhCreditCard from '~icons/ph/credit-card?raw'
import PhCurrencyDollar from '~icons/ph/currency-dollar?raw'
import PhFileText from '~icons/ph/file-text?raw'
import PhFolder from '~icons/ph/folder?raw'
import PhGauge from '~icons/ph/gauge?raw'
import PhGearSix from '~icons/ph/gear-six?raw'
import PhHandshake from '~icons/ph/handshake?raw'
import PhLink from '~icons/ph/link?raw'
import PhListBullets from '~icons/ph/list-bullets?raw'
import PhLockKey from '~icons/ph/lock-key?raw'
import PhMagnifyingGlass from '~icons/ph/magnifying-glass?raw'
import PhMapPinLine from '~icons/ph/map-pin-line?raw'
import PhMapPin from '~icons/ph/map-pin?raw'
import PhMonitor from '~icons/ph/monitor?raw'
import PhMoon from '~icons/ph/moon?raw'
import PhNotification from '~icons/ph/notification?raw'
import PhPhosphorLogo from '~icons/ph/phosphor-logo?raw'
import PhSidebarSimple from '~icons/ph/sidebar-simple?raw'
import PhSignOut from '~icons/ph/sign-out?raw'
import PhSquareHalf from '~icons/ph/square-half?raw'
import PhSun from '~icons/ph/sun?raw'
import PhTicket from '~icons/ph/ticket?raw'
import PhTranslate from '~icons/ph/translate?raw'
import PhUserCircle from '~icons/ph/user-circle?raw'
import PhUserSquare from '~icons/ph/user-square?raw'
import PhUser from '~icons/ph/user?raw'
import PhWarning from '~icons/ph/warning?raw'
import PhX from '~icons/ph/x?raw'

import RiAdminFill from '~icons/ri/admin-fill?raw'
import RiAdminLine from '~icons/ri/admin-line?raw'
import RiArtboardLine from '~icons/ri/artboard-line?raw'
import RiBankCardLine from '~icons/ri/bank-card-line?raw'
import RiBarChartHorizontalLine from '~icons/ri/bar-chart-horizontal-line?raw'
import RiBookmark2Line from '~icons/ri/bookmark-2-line?raw'
import RiChatSearchLine from '~icons/ri/chat-search-line?raw'
import RiCheckboxCircleLine from '~icons/ri/checkbox-circle-line?raw'
import RiCodeBoxLine from '~icons/ri/code-box-line?raw'
import RiEditBoxLine from '~icons/ri/edit-box-line?raw'
import RiFileInfoLine from '~icons/ri/file-info-line?raw'
import RiFilePpt2Line from '~icons/ri/file-ppt-2-line?raw'
import RiFileSearchLine from '~icons/ri/file-search-line?raw'
import RiGitBranchLine from '~icons/ri/git-branch-line?raw'
import RiHistoryFill from '~icons/ri/history-fill?raw'
import RiInformationLine from '~icons/ri/information-line?raw'
import RiLinksFill from '~icons/ri/links-fill?raw'
import RiListCheck from '~icons/ri/list-check?raw'
import RiMarkdownLine from '~icons/ri/markdown-line?raw'
// https://icon-sets.iconify.design/ri/?keyword=ri
import RiMindMap from '~icons/ri/mind-map?raw'
import RiSearchLine from '~icons/ri/search-line?raw'
import RiSettings3Line from '~icons/ri/settings-3-line?raw'
import RiTableLine from '~icons/ri/table-line?raw'
import RiTerminalWindowLine from '~icons/ri/terminal-window-line?raw'
import RiUbuntuFill from '~icons/ri/ubuntu-fill?raw'
import RiUserVoiceLine from '~icons/ri/user-voice-line?raw'
import RiWindowLine from '~icons/ri/window-line?raw'

/** 离线已注册图标集合 */
export const offlineIconRegistry = new Set<string>()

/** 工具方法：注册离线图标 */
export function registerOfflineIcon(name: string, svgRaw: string) {
  addIcon(name, getSvgInfo(svgRaw))
  offlineIconRegistry.add(name)
}

const icons = [
  // Phosphor Icons: https://phosphoricons.com/
  ['ph/arrows-horizontal', PhArrowsHorizontal],
  ['ph/arrows-in-simple', PhArrowsInSimple],
  ['ph/bag', PhBag],
  ['ph/bell', PhBell],
  ['ph/bell-ringing', PhBellRinging],
  ['ph/calculator', PhCalculator],
  ['ph/car-battery', PhCarBattery],
  ['ph/caret-down', PhCaretDown],
  ['ph/chart-bar', PhChartBar],
  ['ph/clipboard-text', PhClipboardText],
  ['ph/corners-out', PhCornersOut],
  ['ph/credit-card', PhCreditCard],
  ['ph/currency-dollar', PhCurrencyDollar],
  ['ph/file-text', PhFileText],
  ['ph/folder', PhFolder],
  ['ph/gauge', PhGauge],
  ['ph/gear-six', PhGearSix],
  ['ph/handshake', PhHandshake],
  ['ph/link', PhLink],
  ['ph/list-bullets', PhListBullets],
  ['ph/lock-key', PhLockKey],
  ['ph/magnifying-glass', PhMagnifyingGlass],
  ['ph/map-pin', PhMapPin],
  ['ph/map-pin-line', PhMapPinLine],
  ['ph/monitor', PhMonitor],
  ['ph/moon', PhMoon],
  ['ph/notification', PhNotification],
  ['ph/phosphor-logo', PhPhosphorLogo],
  ['ph/sidebar-simple', PhSidebarSimple],
  ['ph/sign-out', PhSignOut],
  ['ph/square-half', PhSquareHalf],
  ['ph/sun', PhSun],
  ['ph/ticket', PhTicket],
  ['ph/translate', PhTranslate],
  ['ph/user', PhUser],
  ['ph/user-circle', PhUserCircle],
  ['ph/user-square', PhUserSquare],
  ['ph/warning', PhWarning],
  ['ph/x', PhX],
  // Element Plus Icon: https://github.com/element-plus/element-plus-icons
  ['ep/menu', EpMenu],
  ['ep/edit', EpEdit],
  ['ep/guide', EpGuide],
  ['ep/set-up', EpSetUp],
  ['ep/monitor', EpMonitor],
  ['ep/lollipop', EpLollipop],
  ['ep/histogram', EpHistogram],
  ['ep/home-filled', EpHomeFilled],
  // Remix Icon: https://github.com/Remix-Design/RemixIcon
  ['ri/mind-map', RiMindMap],
  ['ri/admin-fill', RiAdminFill],
  ['ri/table-line', RiTableLine],
  ['ri/links-fill', RiLinksFill],
  ['ri/admin-line', RiAdminLine],
  ['ri/list-check', RiListCheck],
  ['ri/search-line', RiSearchLine],
  ['ri/window-line', RiWindowLine],
  ['ri/ubuntu-fill', RiUbuntuFill],
  ['ri/history-fill', RiHistoryFill],
  ['ri/edit-box-line', RiEditBoxLine],
  ['ri/code-box-line', RiCodeBoxLine],
  ['ri/artboard-line', RiArtboardLine],
  ['ri/markdown-line', RiMarkdownLine],
  ['ri/file-info-line', RiFileInfoLine],
  ['ri/bank-card-line', RiBankCardLine],
  ['ri/file-ppt-2-line', RiFilePpt2Line],
  ['ri/git-branch-line', RiGitBranchLine],
  ['ri/settings-3-line', RiSettings3Line],
  ['ri/user-voice-line', RiUserVoiceLine],
  ['ri/bookmark-2-line', RiBookmark2Line],
  ['ri/file-search-line', RiFileSearchLine],
  ['ri/chat-search-line', RiChatSearchLine],
  ['ri/information-line', RiInformationLine],
  ['ri/terminal-window-line', RiTerminalWindowLine],
  ['ri/checkbox-circle-line', RiCheckboxCircleLine],
  ['ri/bar-chart-horizontal-line', RiBarChartHorizontalLine],
]

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
icons.forEach(([name, icon]) => {
  addIcon(name as string, getSvgInfo(icon as string))
})
