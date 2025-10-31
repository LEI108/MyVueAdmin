// my-vue-admin/src/components/ReIcon/src/iconifyIconOffline.ts
import { addIcon, Icon as IconifyIcon } from '@iconify/vue/dist/offline'
import { defineComponent, h } from 'vue'

// Iconify Icon在Vue里本地使用（用于内网环境）
export default defineComponent({
  name: 'IconifyIconOffline',
  components: { IconifyIcon },
  props: {
    icon: {
      type: [String, Object],
      default: null,
    },
  },
  render() {
    if (typeof this.icon === 'object')
      addIcon(this.icon as any, this.icon as any)
    const attrs = this.$attrs
    if (typeof this.icon === 'string') {
      return h(
        IconifyIcon,
        {
          'icon': this.icon,
          'aria-hidden': false,
          'style': attrs?.style
            ? Object.assign(attrs.style, { outline: 'none' })
            : { outline: 'none' },
          ...attrs,
        },
        {
          default: () => [],
        },
      )
    }
    else {
      return h(
        this.icon,
        {
          'aria-hidden': false,
          'style': attrs?.style
            ? Object.assign(attrs.style, { outline: 'none' })
            : { outline: 'none' },
          ...attrs,
        },
        {
          default: () => [],
        },
      )
    }
  },
})
