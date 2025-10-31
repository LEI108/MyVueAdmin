// src/store/app.ts
import type { AppState } from '@/types/app/index'
import type { SearchResultItem } from '@/types/app/search'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getLocale, setLocale } from '@/plugins/i18n'
import { useUserStore } from './auth'

export const useAppStore = defineStore('app', () => {
  const state = ref<AppState>({
    sidebar: {
      isCollapsed: false,
      withoutAnimation: false,
      isMobile: false,
      isMobileOpen: false,
    },
    theme: {
      isDarkMode: false,
      primaryColor: '#0ea5e9',
    },
    ui: {
      breadcrumbs: [],
      showBreadcrumb: true,
      showFooter: true,
      showSettings: false,
      tagsView: true,
    },
    device: 'desktop',
    pageLoading: false,
    search: {
      value: '',
      results: [],
      dialogVisible: false,
      desktopDropdownVisible: false,
    },
  })

  /** ========= 计算属性 ========= */
  const isCollapsed = computed(() => {
    if (state.value.device === 'mobile' && state.value.sidebar.isMobileOpen) {
      return false
    }
    return state.value.sidebar.isCollapsed
  })

  const isDarkMode = computed(() => state.value.theme.isDarkMode)
  const isMobile = computed(() => state.value.device === 'mobile')
  const breadcrumbs = computed(() => state.value.ui.breadcrumbs)
  const primaryColor = computed(() => state.value.theme.primaryColor)
  const language = computed({
    get: () => getLocale(),
    set: (lang: 'zh-CN' | 'en') => setLocale(lang),
  })
  const device = computed(() => state.value.device)
  const pageLoading = computed(() => state.value.pageLoading)
  const sidebarMobileOpen = computed(() => state.value.sidebar.isMobileOpen)

  /** 从 userStore 获取菜单（统一来源） */
  const menu = computed(() => {
    const userStore = useUserStore()
    return userStore.menu
  })

  /** ========= 状态持久化 ========= */
  const saveStateToLocalStorage = () => {
    const stateToSave = {
      ...state.value,
      ui: {
        ...state.value.ui,
        breadcrumbs: [],
      },
      pageLoading: false,
      search: {
        ...state.value.search,
        results: [],
      },
    }
    localStorage.setItem('appState', JSON.stringify(stateToSave))
  }

  /** ========= 搜索相关 ========= */
  const searchValue = computed({
    get: () => state.value.search.value,
    set: (value) => {
      state.value.search.value = value
      saveStateToLocalStorage()
    },
  })

  const searchResults = computed(() => state.value.search.results)

  const searchDialogVisible = computed({
    get: () => state.value.search.dialogVisible,
    set: (value) => {
      state.value.search.dialogVisible = value
      saveStateToLocalStorage()
    },
  })

  const desktopSearchDropdownVisible = computed({
    get: () => state.value.search.desktopDropdownVisible,
    set: (value) => {
      state.value.search.desktopDropdownVisible = value
      saveStateToLocalStorage()
    },
  })

  const setSearchResults = (results: SearchResultItem[]) => {
    state.value.search.results = results
  }

  const setDesktopSearchDropdownVisible = (visible: boolean) => {
    state.value.search.desktopDropdownVisible = visible
  }

  const setSearchValue = (value: string) => {
    state.value.search.value = value
    saveStateToLocalStorage()
  }

  const clearSearch = () => {
    state.value.search.value = ''
    state.value.search.results = []
    state.value.search.desktopDropdownVisible = false
    saveStateToLocalStorage()
  }

  const resetSearch = () => {
    state.value.search.value = ''
    state.value.search.results = []
    state.value.search.dialogVisible = false
    state.value.search.desktopDropdownVisible = false
    saveStateToLocalStorage()
  }

  /** ========= 主题 / 设备检测 ========= */
  const applyThemeSettings = () => {
    document.documentElement.classList.toggle('dark', state.value.theme.isDarkMode)
    document.documentElement.style.setProperty(
      '--el-color-primary',
      state.value.theme.primaryColor,
    )
  }

  const detectDevice = () => {
    const width = window.innerWidth
    if (width < 768) {
      state.value.device = 'mobile'
      state.value.sidebar.isMobile = true
    }
    else if (width < 992) {
      state.value.device = 'tablet'
      state.value.sidebar.isMobile = false
    }
    else {
      state.value.device = 'desktop'
      state.value.sidebar.isMobile = false
      state.value.sidebar.isMobileOpen = false
    }
  }

  const setPageLoading = (loading: boolean) => {
    state.value.pageLoading = loading
  }

  const setPrimaryColor = (color: string) => {
    state.value.theme.primaryColor = color
    document.documentElement.style.setProperty('--el-color-primary', color)
    saveStateToLocalStorage()
  }

  /** ========= 初始化 ========= */
  const initFromStorage = () => {
    const storedAppState = localStorage.getItem('appState')
    if (storedAppState) {
      try {
        const parsedState = JSON.parse(storedAppState)
        state.value = {
          ...state.value,
          ...parsedState,
          ui: {
            ...state.value.ui,
            ...parsedState.ui,
            breadcrumbs: [],
          },
          search: {
            ...state.value.search,
            ...parsedState.search,
            results: [],
          },
        }
        applyThemeSettings()
      }
      catch (e) {
        console.error('Failed to parse app state from localStorage', e)
      }
    }
    detectDevice()
  }

  initFromStorage()

  /** ========= 侧边栏 & 夜间模式 ========= */
  const toggleSidebar = (collapsed?: boolean) => {
    if (isMobile.value) {
      if (typeof collapsed === 'boolean') {
        state.value.sidebar.isMobileOpen = collapsed
      }
      else {
        state.value.sidebar.isMobileOpen = !state.value.sidebar.isMobileOpen
      }
    }
    else {
      if (typeof collapsed === 'boolean') {
        state.value.sidebar.isCollapsed = collapsed
      }
      else {
        state.value.sidebar.isCollapsed = !state.value.sidebar.isCollapsed
      }
    }
    saveStateToLocalStorage()
  }

  const toggleDarkMode = (darkMode?: boolean) => {
    if (typeof darkMode === 'boolean') {
      state.value.theme.isDarkMode = darkMode
    }
    else {
      state.value.theme.isDarkMode = !state.value.theme.isDarkMode
    }
    document.documentElement.classList.toggle('dark', state.value.theme.isDarkMode)
    saveStateToLocalStorage()
  }

  window.addEventListener('resize', detectDevice)

  return {
    state,
    isCollapsed,
    isDarkMode,
    isMobile,
    breadcrumbs,
    primaryColor,
    language,
    device,
    pageLoading,
    sidebarMobileOpen,
    menu,
    searchValue,
    searchResults,
    searchDialogVisible,
    desktopSearchDropdownVisible,
    setSearchResults,
    setDesktopSearchDropdownVisible,
    toggleSidebar,
    toggleDarkMode,
    setPrimaryColor,
    setPageLoading,
    setSearchValue,
    clearSearch,
    resetSearch,
  }
})
