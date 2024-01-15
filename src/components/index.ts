/** 统一注册全局组件的地方 */
// 引入需要注册的组件
import SvgIcon from '@/components/icons/SvgIcon.vue'
// 注册 Element-Plus 的 Icon 组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 存放全部组件
const allGlobalComponent = { SvgIcon }

export default {
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })
    // icon 注册
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
