import { $t } from '@/plugins/i18n'

const operates = [
  {
    title: $t('login.phoneLogin'),
  },
  {
    title: $t('login.qrCodeLogin'),
  },
  {
    title: $t('login.register'),
  },
]

const thirdParty = [
  {
    title: $t('login.wechatLogin'),
    icon: 'wechat',
  },
  {
    title: $t('login.qqLogin'),
    icon: 'qq',
  },
  {
    title: $t('login.githubLogin'),
    icon: 'github',
  },
]

export { operates, thirdParty }
