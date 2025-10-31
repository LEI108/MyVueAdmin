<script lang=ts setup>
import type { FormInstance, FormRules } from 'element-plus'
import { PhLockKey, PhUserSquare } from '@phosphor-icons/vue'
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/auth'

const { t } = useI18n()
const isDarkMode = ref(false)
const ruleformRef = ref<FormInstance>()
const appStore = useAppStore()
const userStore = useUserStore()
const ruleForm: RuleForm = reactive({
  username: '',
  password: '',
  remember: true,
})
const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: t('login.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 8, message: t('login.usernameRules'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('login.passwordRequired'), trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*\d)[a-z\d]{8}$/i, message: t('login.passwordRules'), trigger: 'blur' },
  ],
})

// 使用国际化后的语言选项
const languages = [
  { value: 'zh-CN', label: t('common.zh') },
  { value: 'en', label: t('common.en') },
]

watch(isDarkMode, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal)
})

// 切换语言 - 使用新的语言设置方式
function changeLanguage(lang: string) {
  appStore.language = lang as 'zh-CN' | 'en'
}

interface RuleForm {
  username: string
  password: string
  remember: boolean
}

function handleLogin() {
  ruleformRef.value?.validate(async (valid: boolean) => { // ?.可选链操作符
    if (valid) {
      await userStore.login(ruleForm)
      router.push('/')
    }
  })
}
</script>

<template>
  <div class="login-container" :class="{ dark: isDarkMode }">
    <div class="login-content">
      <div class="login-card-container">
        <div class="login-card-header">
          <div class="login-avatar">
            <PhPhosphorLogo class="custom-logo-icon" />
            <h1 class="site-title">
              phosphor
            </h1>
          </div>
          <div class="login-adjust">
            <div class="theme-switch-container">
              <el-switch
                v-model="isDarkMode"
                size="large"
                inline-prompt
              >
                <template #active-action>
                  <span class="custom-active-action"><PhSun /></span>
                </template>
                <template #inactive-action>
                  <span class="custom-inactive-action"><PhMoon /></span>
                </template>
              </el-switch>
            </div>
            <el-dropdown @command="changeLanguage">
              <div class="lang-dropdown">
                <PhTranslate class="custom-translate-icon" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="lang in languages"
                    :key="lang.value"
                    :command="lang.value"
                  >
                    {{ lang.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="login-card-main">
        <div class="login-form">
          <el-form
            ref="ruleformRef"
            :model="ruleForm"
            :rules="rules"
          >
            <el-form-item>
              <div>
                <h1>{{ t('login.welcomeBack') }}</h1>
                <p>{{ t('login.subtitle') }}</p>
              </div>
            </el-form-item>
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                class="custom-form-icon"
                clearable
                :placeholder="t('login.usernamePlaceholder')"
                :prefix-icon="PhUserSquare"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                class="custom-form-icon"
                clearable
                show-password
                :placeholder="t('login.passwordPlaceholder')"
                :prefix-icon="PhLockKey"
              />
            </el-form-item>
            <el-form-item>
              <div class="remember-forgot">
                <div>
                  <el-checkbox v-model="ruleForm.remember" :label="t('login.rememberMe')" size="large" />
                </div>
                <div>
                  <a href="#">{{ t('login.forgotPassword') }}</a>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                size="large"
                type="primary"
                @click="handleLogin"
              >
                {{ t('login.loginButton') }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <div class="divider">
                <span class="divider-text">
                  {{ t('login.otherLogin') }}
                </span>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="social-login">
                <el-button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span class="sr-only">{{ t('login.appleLogin') }}</span>
                </el-button>
                <el-button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span class="sr-only">{{ t('login.googleLogin') }}</span>
                </el-button>
                <el-button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.320l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span class="sr-only">{{ t('login.metaLogin') }}</span>
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="signup-link">
                {{ t('login.noAccount') }} <a href="#">{{ t('login.register') }}</a>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="login-card-footer">
        <div>
          {{ t('login.copyright') }}
        </div>
      </div>
    </div>
    <div class="login-illustration-container">
      <div class="login-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" viewBox="0 0 256 256" style="margin:0 auto 1.5rem;opacity:0.9;">
          <path d="M152,32H72a8,8,0,0,0-8,8V168a80.09,80.09,0,0,0,80,80,8,8,0,0,0,8-8V176a72,72,0,0,0,0-144ZM136,231.5A64.14,64.14,0,0,1,80.51,176H136Zm0-94L85.68,48H136ZM152,160V48a56,56,0,0,1,0,112Z" />
        </svg>
        <h2>
          {{ t('login.illustrationTitle') }}
        </h2>
        <p>
          {{ t('login.illustrationSubtitle') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '../../styles/layouts/login.scss';
</style>
