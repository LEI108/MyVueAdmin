<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Iphone from '~icons/ep/iphone'
import Lock from '~icons/ri/lock-fill'
import Keyhole from '~icons/ri/shield-keyhole-line'
import User from '~icons/ri/user-3-fill'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { $t, transformI18n } from '@/plugins/i18n'
import { useUserStoreHook } from '@/store/modules/user'
import { message } from '@/utils/message'
import Motion from '../utils/motion'
import { updateRules } from '../utils/rules'
import { useVerifyCode } from '../utils/verifyCode'

const { t } = useI18n()
const checked = ref(false)
const loading = ref(false)
const ruleForm = reactive({
  username: '',
  phone: '',
  verifyCode: '',
  password: '',
  repeatPassword: '',
})
const ruleFormRef = ref<FormInstance>()
const { isDisabled, text } = useVerifyCode()
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error(transformI18n($t('login.passWordSureReg'))))
      }
      else if (ruleForm.password !== value) {
        callback(
          new Error(transformI18n($t('login.passWordDifferentReg'))),
        )
      }
      else {
        callback()
      }
    },
    trigger: 'blur',
  },
]

async function onUpdate(formEl: FormInstance | undefined) {
  loading.value = true
  if (!formEl)
    return
  await formEl.validate((valid) => {
    if (valid) {
      if (checked.value) {
        // 模拟请求，需根据实际开发进行修改
        setTimeout(() => {
          message(transformI18n($t('login.registerSuccess')), {
            type: 'success',
          })
          loading.value = false
        }, 2000)
      }
      else {
        loading.value = false
        message(transformI18n($t('login.tickPrivacy')), {
          type: 'warning',
        })
      }
    }
    else {
      loading.value = false
    }
  })
}

function onBack() {
  useVerifyCode().end()
  useUserStoreHook().SET_CURRENTPAGE(0)
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="updateRules"
    size="large"
  >
    <Motion>
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

    <Motion :delay="100">
      <el-form-item prop="phone">
        <el-input
          v-model="ruleForm.phone"
          clearable
          :placeholder="t('login.phone')"
          :prefix-icon="useRenderIcon(Iphone)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="verifyCode">
        <div class="w-full flex justify-between">
          <el-input
            v-model="ruleForm.verifyCode"
            clearable
            :placeholder="t('login.smsVerifyCode')"
            :prefix-icon="useRenderIcon(Keyhole)"
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2!"
            @click="useVerifyCode().start(ruleFormRef, 'phone')"
          >
            {{
              text.length > 0
                ? text + t("login.info")
                : t("login.getVerifyCode")
            }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="200">
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

    <Motion :delay="250">
      <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
        <el-input
          v-model="ruleForm.repeatPassword"
          clearable
          show-password
          :placeholder="t('login.sure')"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="300">
      <el-form-item>
        <el-checkbox v-model="checked">
          {{ t("login.readAccept") }}
        </el-checkbox>
        <el-button link type="primary">
          {{ t("login.privacyPolicy") }}
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="350">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onUpdate(ruleFormRef)"
        >
          {{ t("login.definite") }}
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="400">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          {{ t("login.back") }}
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
