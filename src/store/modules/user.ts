import { defineStore } from 'pinia'
/** 导入路由 */
import router from '@/router'
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
/** 导入接口 */
import { requestLoginAPI, requestUserInfoAPI, requestLoginOutAPI } from '@/api/user'
/** 导入类型 */
import type { IUserState } from '@/store/modules/types/userType.ts'
import {
  ILoginParams,
  ILoginResponseData,
  IUserInfoResponseData,
  ILoginOutResponseData,
} from '@/api/user/type'
/** 导入工具包 */
import { SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { filterAsyncRoute } from '@/utils/filterRoutes'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
/** 导入仓库 */
import useMenuStore from './menu'

export default defineStore('User', {
  state: (): IUserState => {
    return {
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用户登录
    async loginStatus(data: ILoginParams) {
      const result: ILoginResponseData = await requestLoginAPI(data)
      //   判断返回结果返回相对应的 Promise 状态
      if (result.code === 200) {
        // 登录成功
        SET_TOKEN(result.data)
        return 'ok'
      } else {
        // 登录失败
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息
    async getUserInfo() {
      const result: IUserInfoResponseData = await requestUserInfoAPI()
      const { routes } = result.data

      if (result.code === 200) {
        // 在仓库中设置用户名以及用户头像
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 根据返回用户信息去过滤路由数据
        const filteredAsyncRoutes = filterAsyncRoute(cloneDeep(asyncRoutes), routes)
        useMenuStore().setMenuRoutes([...constantRoutes, ...filteredAsyncRoutes, ...anyRoutes])
        filteredAsyncRoutes.concat(...anyRoutes).forEach((route) => {
          router.addRoute(route)
        })

        return result.data
      } else {
        // 用户信息获取失败
        return Promise.reject(new Error(result.message))
      }
    },
    // 清空存储在仓库的用户信息，以及清除 TOKEN【退出登录】
    async loginOut() {
      const result: ILoginOutResponseData = await requestLoginOutAPI()
      if (result.code === 200) {
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        useMenuStore().clearMenuRoutes()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
