import { defineStore } from 'pinia'
/** 导入接口 */
import {
  requestLoginAPI,
  requestUserInfoAPI,
  requestLoginOutAPI,
} from '@/api/user'
/** 导入类型 */
import type { IUserState } from '@/store/modules/types/userType.ts'
/** 导入工具包 */
import { SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'

export default defineStore('User', {
  state: (): IUserState => {
    return {
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用户登录
    async loginStatus(data: any) {
      const result = await requestLoginAPI(data)
      //   判断返回结果返回相对应的 Promise 状态
      if (result.code === 200) {
        // 登录成功
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        // 登录失败
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息
    async getUserInfo() {
      const result: any = await requestUserInfoAPI()

      if (result.code === 200) {
        // 在仓库中设置用户名以及用户头像
        this.username = result.data.name
        this.avatar = result.data.avatar
        return result.data
      } else {
        // 用户信息获取失败
        return Promise.reject(new Error(result.message))
      }
    },
    // 清空存储在仓库的用户信息，以及清除 TOKEN【退出登录】
    async loginOut() {
      const result = await requestLoginOutAPI()
      if (result.code === 200) {
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
