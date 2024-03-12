/** 全局路由鉴权设置 */
import router from '@/router'
/** 进度条引入 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })
/** EL 组件包 */
import { ElMessageBox } from 'element-plus'
/** 工具包引入 */
import { GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import setting from './setting'
/** 获取仓库 */
import useUserStore from '@/store/modules/user'
import pinia from '@/store'

const userStore = useUserStore(pinia)

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 判断用户是否登录
  if (GET_TOKEN()) {
    // 用户已登录的情况
    // 登录成功情况下，不能去 /login 界面，重定向为首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 在此处判断一下，若是仓库中有用户信息则直接放行
      // 没有用户信息则需要请求用户信息接口，拿到信息后再放行
      if (!userStore.username) {
        // 没有用户信息，则表示刷新了页面，仓库进行更新，需要重新请求用户信息
        try {
          await userStore.getUserInfo()
          next({ ...to })
        } catch (error) {
          // TOKEN 过期，需要重新登录
          ElMessageBox.alert('用户身份过期，需要重新登录', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              /** 谨慎点的话还得要仓库里的退出登录方法 */
              // 移除本地 TOKEN
              REMOVE_TOKEN()
              // 跳转回登录界面
              next({ path: '/login' })
            },
          })
        }
      } else {
        next()
      }
    }
  } else {
    // 用户未登录的情况
    // 判断用户在未登录情况下跳转的页面
    if (to.path === '/login' || to.path === '/404') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((_to, from, _next) => {
  // eslint-disable-next-line no-constant-condition
  document.title = 'undefined' ? `${setting.title}` : `${setting.title} - ${from.meta.title}`
  // 关闭进度条
  NProgress.done()
})

/** 需要鉴权的地方：
 *      1. 未登录情况：只能访问 /login 页面，其他路径不能访问，统统指向 /login 【除了 404 】
 *      2. 已登录情况：除了 /login 页面其他都能访问，访问 /login 则指向首页路径
 */
