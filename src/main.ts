import { createApp } from 'vue'
// 引入 Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入国际化
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入 SVG 配置
import 'virtual:svg-icons-register'
// 引入全局样式
import '@/styles'
// // 引入需要注册的全局组件
import GlobalComponent from '@/components'

import App from './App.vue'

const app = createApp(App)

app.use(GlobalComponent)

// 挂载 element-plus
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
