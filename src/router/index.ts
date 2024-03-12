/** vue-router 插件配置路由 */
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入路由
import { constantRoutes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 切换时滚动行为
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})

export default router
