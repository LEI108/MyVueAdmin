<!-- src/components/Search/Search.vue -->
<script setup lang="ts">
import type { SearchResultItem } from '@/types/app/search'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'

const props = defineProps({
  modelValue: { type: String, default: '' },
  isMobile: { type: Boolean, default: false },
  debounceMs: { type: Number, default: 220 },
})
const emit = defineEmits(['update:modelValue', 'navigate', 'toggleDropdown'])

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()

/**
 * Pinyin-pro 动态加载（提高可选性），并做缓存
 * 安装：npm i pinyin-pro
 */
let pinyinPro: any = null
async function tryLoadPinyinPro() {
  try {
    pinyinPro = await import('pinyin-pro')
  }
  catch (e) {
    // 若未安装，继续使用纯文本匹配
    console.warn('pinyin-pro not available, fallback to plain matching', e)
  }
}

/* ---------- 工具 ---------- */
function normalize(s = '') {
  // 去掉特殊字符，仅保留中文、字母、数字；小写
  return String(s)
    .replace(/[\u2000-\u2FFF\p{P}\p{S}]/gu, '') // 去除标点符号类
    .replace(/[_\-+*=~`!@#$%^&(){}[\]:";'<>?,.\\/]/g, '')
    .trim()
    .toLowerCase()
}

function handleInputBlur() {
  // 显式使用全局 setTimeout，避免 TS 将其视为组件属性
  window.setTimeout(() => {
    appStore.setDesktopSearchDropdownVisible(false)
  }, 150)
}

function safeTranslate(key: unknown) {
  try {
    if (key == null || key === '')
      return ''
    if (typeof key === 'string')
      return t(key)
    return String(key)
  }
  catch {
    return String(key ?? '')
  }
}

/* ---------- 拼音缓存与索引构建 ---------- */
// 缓存： title -> { fullPinyin, acronym }
const pinyinCache = new Map<string, { full: string, acronym: string }>()

async function buildPinyinFor(title: string) {
  if (!title)
    return { full: '', acronym: '' }
  const key = title
  if (pinyinCache.has(key))
    return pinyinCache.get(key)!
  let full = ''
  let acronym = ''
  try {
    if (pinyinPro) {
      // 尝试使用 pinyin-pro API（兼容多种导出形式）
      // 常见调用： pinyinPro.pinyin(text, { toneType: 'none' }) => 'ge ren zhong xin'
      const pinyinFn = pinyinPro.pinyin || pinyinPro.default?.pinyin || pinyinPro.pinyinWithTone || null
      const abbrFn = pinyinPro.pinyinInitials || pinyinPro.abbr || null

      if (pinyinFn) {
        const raw = pinyinFn(title, { toneType: 'none', type: 'array' })
        // raw 可能是字符串或数组，统一处理
        if (Array.isArray(raw))
          full = raw.join(' ')
        else if (typeof raw === 'string')
          full = raw
        else full = String(raw)
      }
      else if (typeof pinyinPro === 'function') {
        // 某些打包方式直接导出函数
        const raw = pinyinPro(title, { toneType: 'none', type: 'array' })
        full = Array.isArray(raw) ? raw.join(' ') : String(raw)
      }

      // acronym：尝试用 abbr / initials；若不可用，取 full 的首字母
      if (abbrFn) {
        const a = abbrFn(title)
        acronym = typeof a === 'string' ? a.replace(/\s+/g, '') : String(a)
      }
      else if (full) {
        acronym = full.split(/\s+/).map(w => w[0] || '').join('')
      }
    }
  }
  catch {
    // 忽略 pinyin 错误，fallback below
  }

  if (!full) {
    // fallback：把中文保留、英文按原样，full = title
    full = title
    acronym = title.split(/\s+/).map(w => w[0] || '').join('')
  }

  full = normalize(full)
  acronym = normalize(acronym)
  const entry = { full, acronym }
  pinyinCache.set(key, entry)
  return entry
}

/* ---------- 路由索引 ---------- */
const routeIndex = ref<Array<{
  route: SearchResultItem
  titleFlat: string // 原文归一（safeTranslate & normalize）
  pinyinFull: string
  pinyinAcronym: string
}>>([])

function buildRouteIndex() {
  const routes = router.getRoutes()
    .filter(r => r.meta?.searchable !== false && r.name)
    .map(r => ({
      name: String(r.name),
      path: r.path,
      title: typeof r.meta?.title === 'string' ? (r.meta!.title as string) : '',
      icon: (r.meta?.icon || '') as string,
    })) as SearchResultItem[]

  // for each route compute titleFlat and pinyin entries (async allowed)
  Promise.all(routes.map(async (rt) => {
    const titleText = safeTranslate(rt.title)
    const titleFlat = normalize(titleText || rt.name || '')
    const py = await buildPinyinFor(titleText || rt.name || '')
    return {
      route: rt,
      titleFlat,
      pinyinFull: py.full,
      pinyinAcronym: py.acronym,
    }
  })).then((list) => {
    routeIndex.value = list
  })
}

/* ---------- 匹配规则与打分（score 越大越相关） ---------- */
function scoreMatch(item: typeof routeIndex.value[number], rawQuery: string) {
  const q = normalize(rawQuery)
  if (!q)
    return 0

  // 优先级策略（示例分值，可调整）
  // 精确/包含匹配 > name匹配 > pinyin prefix > pinyin contains > acronym prefix > acronym contains > 混合匹配
  const title = item.titleFlat
  const name = (item.route.name || '').toLowerCase()
  const pFull = item.pinyinFull
  const pA = item.pinyinAcronym

  // exact contains
  if (title && title.includes(q)) {
    // 更短匹配（短关键词）优先
    return 100 + (100 - title.length)
  }
  // 路由 name 包含
  if (name && name.includes(q))
    return 90
  // pinyin full start (prefix)
  if (pFull && pFull.startsWith(q))
    return 80
  // pinyin full contains
  if (pFull && pFull.includes(q))
    return 70
  // acronym prefix
  if (pA && pA.startsWith(q))
    return 60
  // acronym contains
  if (pA && pA.includes(q))
    return 50

  // 混合匹配（比如用户输入 "grzx" 能匹配 "ge ren zhong xin"）
  // if q is mostly letters and length ~ acronym length, compare as acronym fuzzy
  if (/^[a-z0-9]+$/.test(q)) {
    // levenshtein-like simple check: subsequence match
    let i = 0
    let j = 0
    while (i < q.length && j < pFull.length) {
      if (q[i] === pFull[j])
        i++
      j++
    }
    if (i === q.length)
      return 45
  }

  return 0
}

/* ---------- 输入/防抖/搜索 ---------- */
const localValue = ref(props.modelValue)
watch(() => props.modelValue, v => (localValue.value = v))
watch(() => localValue.value, v => emit('update:modelValue', v))

let debounceTimer: any = null
function debounceDoSearch(q: string) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => doSearch(q), props.debounceMs)
}

async function doSearch(q: string) {
  const raw = String(q || '').trim()
  if (!raw) {
    appStore.setSearchResults([])
    emit('toggleDropdown', false)
    return
  }
  // const qNorm = normalize(raw)

  // ensure index ready
  if (!routeIndex.value.length)
    await buildRouteIndex()

  // score every route
  const scored = routeIndex.value.map(item => ({
    item,
    score: scoreMatch(item, raw),
  })).filter(r => r.score > 0)

  // sort by score desc, tie-breaker: shorter title / shorter path
  scored.sort((a, b) => {
    if (b.score !== a.score)
      return b.score - a.score
    const la = a.item.titleFlat.length || 0
    const lb = b.item.titleFlat.length || 0
    return la - lb
  })

  const results = scored.map(s => s.item.route)
  appStore.setSearchResults(results)
  if (!props.isMobile && results.length)
    emit('toggleDropdown', true)
  else emit('toggleDropdown', false)
}

/* ---------- 键盘与导航 ---------- */
const activeIndex = ref(-1)
watch(() => appStore.searchResults, (list) => {
  activeIndex.value = list.length ? 0 : -1
})

function onKeydown(e: KeyboardEvent) {
  const list = appStore.searchResults
  if (!list || !list.length)
    return
  if (e.key === 'ArrowDown') {
    activeIndex.value = Math.min(activeIndex.value + 1, list.length - 1)
    e.preventDefault()
  }
  else if (e.key === 'ArrowUp') {
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    e.preventDefault()
  }
  else if (e.key === 'Enter') {
    const item = list[activeIndex.value] || list[0]
    if (item)
      navigateTo(item.path)
  }
  else if (e.key === 'Escape') {
    emit('toggleDropdown', false)
  }
}

function navigateTo(path: string) {
  emit('update:modelValue', '')
  appStore.setSearchResults([])
  emit('toggleDropdown', false)
  emit('navigate', path)
  router.push(path).catch(() => {})
}

/* ---------- 生命周期 ---------- */
onMounted(async () => {
  await tryLoadPinyinPro()
  await buildRouteIndex()
  if (props.modelValue)
    debounceDoSearch(props.modelValue)
})
</script>

<template>
  <div class="search-box-wrapper">
    <div class="search-box" @keydown="onKeydown">
      <el-input
        v-model="localValue"
        :placeholder="t('common.search')"
        size="large"
        clearable
        class="search-input"
        @input="debounceDoSearch(localValue)"
        @focus="() => { if (localValue) appStore.setDesktopSearchDropdownVisible(true) }"
        @blur="handleInputBlur"
      />
      <div v-if="!isMobile && appStore.searchResults.length && appStore.desktopSearchDropdownVisible" class="desktop-search-results">
        <div class="results-list">
          <div
            v-for="(item, idx) in appStore.searchResults"
            :key="item.path"
            class="result-item" :class="[{ active: idx === activeIndex }]"
            @mousedown.prevent="navigateTo(item.path)"
          >
            <div class="result-title">
              {{ safeTranslate(item.title) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/base/variables.scss';
.search-box-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .search-box {
    width: 100%;
    margin-right: 8px;
    position: relative;

    :deep(.el-input__wrapper) {
      background-color: var(--el-fill-color-light);
      border-radius: 20px;
      box-shadow: none;
      height: 20px;

      &:hover {
        background-color: var(--el-fill-color);
      }
    }
  }

  .desktop-search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background-color: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    z-index: 2000;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--el-border-color-light);

    .results-list {
      padding: 8px 0;

      .result-item {
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        .result-title {
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }
    }

    .empty-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;

      .empty-image {
        width: 100px;
        height: 100px;
        opacity: 0.6;
      }

      .empty-text {
        margin-top: 12px;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }
  }
}
</style>
