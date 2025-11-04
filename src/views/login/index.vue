<script lang=ts setup>
import type { FormInstance } from 'element-plus'
import { debounce } from '@pureadmin/utils'
import { useEventListener } from '@vueuse/core'
import { computed, reactive, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Check from '~icons/ep/check'
import Info from '~icons/ri/information-line'
import Lock from '~icons/ri/lock-fill'
import Keyhole from '~icons/ri/shield-keyhole-line'
import User from '~icons/ri/user-3-fill'
import illustration from '@/assets/login/illustration.svg?component'
import logo from '@/assets/login/logo.svg?component'
import globalization from '@/assets/svg/globalization.svg?component'
import darkIcon from '@/assets/svg/moon.svg?component'
import lightIcon from '@/assets/svg/sun.svg?component'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { ReImageVerify } from '@/components/ReImageVerify'
import { $t, transformI18n } from '@/plugins/i18n'
import { getTopMenu, initRouter } from '@/router/utils'
import { useUserStoreHook } from '@/store/modules/user'
import { message } from '@/utils/message'
import { operates, thirdParty } from '@/views/login/utils/enums'
import TypeIt from '../../components/ReTypeit/index'
import { useDataThemeChange } from '../../layout/hooks/useDataThemeChange'
import { useLayout } from '../../layout/hooks/useLayout'
import { useNav } from '../../layout/hooks/useNav'
import { useTranslationLang } from '../../layout/hooks/useTranslationLang'
import LoginPhone from './components/LoginPhone.vue'
import LoginQrCode from './components/LoginQrCode.vue'
import LoginRegist from './components/LoginRegist.vue'
import LoginUpdate from './components/LoginUpdate.vue'
import Motion from './utils/motion'
import { loginRules } from './utils/rules'

defineOptions({
  name: 'Login',
})

const imgCode = ref('')
const loginDay = ref(7)
const router = useRouter()
const loading = ref(false)
const checked = ref(false)
const disabled = ref(false)
const ruleFormRef = ref<FormInstance>()
const currentPage = computed(() => {
  return useUserStoreHook().currentPage
})

const { t } = useI18n()
const { initStorage } = useLayout()
initStorage()
const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange()
dataThemeChange(overallStyle.value)
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav()
const { locale, translationCh, translationEn } = useTranslationLang()

const ruleForm = reactive({
  username: 'admin',
  password: 'admin123',
  verifyCode: '',
})

async function onLogin(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password,
        })
        .then((res) => {
          if (res.success) {
            // 获取后端路由
            return initRouter().then(() => {
              disabled.value = true
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message(t('login.loginSuccess'), { type: 'success' })
                })
                .finally(() => (disabled.value = false))
            })
          }
          else {
            message(t('login.loginFailed'), { type: 'error' })
          }
        })
        .finally(() => (loading.value = false))
    }
  })
}

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true,
)

useEventListener(document, 'keydown', ({ code }) => {
  if (
    ['Enter', 'NumpadEnter'].includes(code)
    && !disabled.value
    && !loading.value
  ) {
    immediateDebounce(ruleFormRef.value)
  }
})

watch(imgCode, (value) => {
  useUserStoreHook().SET_VERIFYCODE(value)
})
watch(checked, (bool) => {
  useUserStoreHook().SET_ISREMEMBERED(bool)
})
watch(loginDay, (value) => {
  useUserStoreHook().SET_LOGINDAY(value)
})
</script>

<template>
  <div class="login-container">
    <!-- 左列内容 -->
    <div class="login-box">
      <!-- 顶部 -->
      <div class="login-box-header">
        <!-- 左侧 Logo + 名称 -->
        <div class="login-avatar">
          <!-- 动效标题 -->
          <logo class="logo-icon" />
          <Motion>
            <h2 class="outline-hidden">
              <TypeIt
                :options="{ strings: [title], cursor: false, speed: 100 }"
              />
            </h2>
          </Motion>
        </div>

        <!-- 右侧 国际化 + 主题切换 -->
        <div class="login-adjust">
          <!-- 明暗模式切换 -->
          <el-switch
            v-model="dataTheme"
            inline-prompt
            size="large"
            :active-icon="lightIcon"
            :inactive-icon="darkIcon"
            @change="dataThemeChange"
          />
          <!-- 国际化切换 -->
          <el-dropdown trigger="click">
            <globalization class="hover:text-primary hover:bg-[transparent]! w-[24px] h-[24px] ml-1.5 cursor-pointer outline-hidden duration-300" />
            <template #dropdown>
              <el-dropdown-menu class="translation">
                <el-dropdown-item
                  :style="getDropdownItemStyle(locale, 'zh')"
                  class="dark:text-white!" :class="[getDropdownItemClass(locale, 'zh')]"
                  @click="translationCh"
                >
                  <IconifyIconOffline v-show="locale === 'zh'" :icon="Check" />
                  简体中文
                </el-dropdown-item>
                <el-dropdown-item
                  :style="getDropdownItemStyle(locale, 'en')"
                  class="dark:text-white!" :class="[getDropdownItemClass(locale, 'en')]"
                  @click="translationEn"
                >
                  <span v-show="locale === 'en'"><IconifyIconOffline :icon="Check" /></span>
                  English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 登录表单区 -->
      <div class="login-form-info">
        <!-- 完整表单 -->
        <el-form
          v-if="currentPage === 0"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="loginRules"
          size="large"
        >
          <Motion :delay="100">
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: transformI18n($t('login.usernameReg')),
                  trigger: 'blur',
                },
              ]"
              prop="username"
            >
              <el-input
                v-model="ruleForm.username"
                clearable
                :placeholder="t('login.username')"
                :prefix-icon="useRenderIcon(User)"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="150">
            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                clearable
                show-password
                :placeholder="t('login.password')"
                :prefix-icon="useRenderIcon(Lock)"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="200">
            <el-form-item prop="verifyCode">
              <el-input
                v-model="ruleForm.verifyCode"
                clearable
                :placeholder="t('login.verifyCode')"
                :prefix-icon="useRenderIcon(Keyhole)"
              >
                <template #append>
                  <ReImageVerify v-model:code="imgCode" />
                </template>
              </el-input>
            </el-form-item>
          </Motion>

          <Motion :delay="250">
            <el-form-item>
              <div class="w-full h-[20px] flex justify-between items-center">
                <el-checkbox v-model="checked">
                  <span class="flex">
                    <select
                      v-model="loginDay"
                      :style="{
                        width: loginDay < 10 ? '10px' : '16px',
                        outline: 'none',
                        background: 'none',
                        appearance: 'none',
                        border: 'none',
                        textAlign: 'center',
                      }"
                    >
                      <option value="1">1</option>
                      <option value="7">7</option>
                      <option value="30">30</option>
                    </select>
                    {{ t('login.rememberMe') }}
                    <IconifyIconOffline
                      v-tippy="{
                        content: t('login.rememberInfo'),
                        placement: 'top',
                      }"
                      :icon="Info"
                      class="ml-1"
                    />
                  </span>
                </el-checkbox>
                <el-button
                  link
                  type="primary"
                  @click="useUserStoreHook().SET_CURRENTPAGE(4)"
                >
                  {{ t('login.forgetPassword') }}
                </el-button>
              </div>
              <el-button
                class="w-full mt-4!"
                size="default"
                type="primary"
                :loading="loading"
                :disabled="disabled"
                @click="onLogin(ruleFormRef)"
              >
                {{ t('login.login') }}
              </el-button>
            </el-form-item>
          </Motion>

          <Motion :delay="300">
            <el-form-item>
              <div class="w-full h-[20px] flex justify-between items-center">
                <el-button
                  v-for="(item, index) in operates"
                  :key="index"
                  class="w-full mt-4!"
                  size="default"
                  @click="useUserStoreHook().SET_CURRENTPAGE(index + 1)"
                >
                  {{ t(item.title) }}
                </el-button>
              </div>
            </el-form-item>
          </Motion>
        </el-form>
        <Motion v-if="currentPage === 0" :delay="350">
          <el-form-item>
            <el-divider>
              <p class="text-gray-500 text-xs">
                {{ t("login.thirdPartyLogin") }}
              </p>
            </el-divider>
            <div class="w-full flex justify-evenly">
              <span
                v-for="(item, index) in thirdParty"
                :key="index"
                :title="t(item.title)"
              >
                <IconifyIconOnline
                  :icon="`ri:${item.icon}-fill`"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </span>
            </div>
          </el-form-item>
        </Motion>
        <!-- 其他登录方式 -->
        <LoginPhone v-if="currentPage === 1" />
        <LoginQrCode v-if="currentPage === 2" />
        <LoginRegist v-if="currentPage === 3" />
        <LoginUpdate v-if="currentPage === 4" />
      </div>

      <!-- 页脚版权 -->
      <div class="login-box-footer">
        Copyright © 2025-present
        <a href="" target="_blank">
          &nbsp;{{ title }}
        </a>
      </div>
    </div>

    <!-- 右列插画 -->
    <div class="login-illustration">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '../../styles/layouts/login.scss';
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 20px;
  }

  .check-zh {
    position: absolute;
    left: 10px;
  }

  .check-en {
    position: absolute;
    left: 10px;
  }
}
</style>
