import { $t } from '@/plugins/i18n'
import { RouteRank } from '../enums'

const { VITE_HIDE_HOME } = import.meta.env
const Layout = () => import('@/layout/index.vue')

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/welcome',
  meta: {
    icon: 'ep/home-filled',
    title: $t('menus.home'),
    rank: RouteRank.HOME,
  },
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/wellcome/index.vue'),
      meta: {
        title: $t('menus.home'),
        showLink: VITE_HIDE_HOME !== 'true',
      },
    },
  ],
} satisfies RouteConfigsTable
