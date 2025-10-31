<!-- my-vue-admin/src/views/settings/components/ProfileSettings.vue -->
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/auth'

// i18n
const { t } = useI18n()
// Store
const userStore = useUserStore()
const appStore = useAppStore()

// 表单数据（初始化时取 store.user）
const form = reactive({
  avatar: userStore.user?.avatar || '',
  nickname: userStore.user?.nickname || '',
  email: userStore.user?.email || '',
})

// 表单引用
const formRef = ref()

// 表单校验规则
const rules = {
  nickname: [
    { required: true, message: t('settings.profile.nicknameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: t('settings.profile.nicknameLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('settings.profile.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('settings.profile.emailInvalid'), trigger: 'blur' },
  ],
}

// 头像上传（后端地址换成你的 upload API）
const uploadUrl = '/api/upload-avatar'
const uploading = ref(false)

// 上传成功
function handleAvatarSuccess(response: any) {
  form.avatar = response.url // 假设返回 { url: 'xxx' }
  ElMessage.success(t('settings.profile.avatarUploadSuccess'))
}

// 上传失败
function handleAvatarError() {
  ElMessage.error(t('settings.profile.avatarUploadFail'))
}

function handleBeforeUpload() {
  uploading.value = true
}

function handleUploadFinish() {
  uploading.value = false
}

// 保存提交 ——— 直接走 store 方法
function handleSave() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid)
      return
    // 调用 store 中的 updateUserInfo
    userStore.updateUserInfo(form)
    ElMessage.success(t('settings.profile.saveSuccess'))
  })
}
</script>

<template>
  <div class="profile-settings">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="profile-form"
    >
      <!-- 头像上传 -->
      <el-form-item :label="t('settings.profile.avatar')">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="handleBeforeUpload"
          :on-progress="handleUploadFinish"
        >
          <el-avatar
            :size="100"
            :src="form.avatar"
            class="avatar-preview"
            :style="{ border: `2px solid ${appStore.primaryColor}` }"
          >
            <template #icon>
              <el-icon><PhCamera /></el-icon>
            </template>
          </el-avatar>
          <div class="upload-hint">
            {{ t('settings.profile.changeAvatar') }}
          </div>
        </el-upload>
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item :label="t('settings.profile.nickname')" prop="nickname">
        <el-input v-model="form.nickname" :placeholder="t('settings.profile.nicknamePlaceholder')" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item :label="t('settings.profile.email')" prop="email">
        <el-input v-model="form.email" :placeholder="t('settings.profile.emailPlaceholder')" />
      </el-form-item>

      <!-- 保存按钮 -->
      <el-form-item>
        <el-button type="primary" :style="{ backgroundColor: appStore.primaryColor }" @click="handleSave">
          {{ t('settings.profile.saveBtn') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.profile-settings {
  padding: 20px;

  .profile-form {
    max-width: 500px;
  }

  .avatar-uploader {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    .avatar-preview {
      transition: all 0.3s;
      &:hover {
        transform: scale(1.05);
      }
    }

    .upload-hint {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

// 暗黑模式适配
:deep(.dark-mode) {
  .profile-settings {
    background-color: var(--el-bg-color-dark);
    color: var(--el-text-color-primary);
    .upload-hint {
      color: var(--el-text-color-secondary-dark);
    }
    .avatar-preview {
      border-color: var(--el-border-color-dark);
    }
  }
}
</style>
