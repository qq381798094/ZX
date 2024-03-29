import { createApp } from 'vue'
// 引入 pinia 仓库
import pinia from './store'
// 引入路由
import router from '@/router'
// 引入路由鉴权
import './permission'
// 引入 Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入国际化
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入 SVG 配置
import 'virtual:svg-icons-register'
// 引入全局样式
import '@/styles/index.scss'
// // 引入需要注册的全局组件
import GlobalComponent from '@/components'
// 引入自定义指令
import { isHasButton } from '@/directives/has'

import App from './App.vue'

const app = createApp(App)

// 挂载 pinia
app.use(pinia)

// 挂载注册全局组件的插件
app.use(GlobalComponent)

// 挂载 router
app.use(router)

// 挂载 element-plus
app.use(ElementPlus, {
  locale: zhCn,
})

// 挂载指令
isHasButton(app)

app.mount('#app')
