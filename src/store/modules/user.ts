import { defineStore } from 'pinia'
/** 导入接口 */
import { requestLoginAPI, requestUserInfoAPI } from '@/api/user'
/** 导入类型 */
import type { ILoginParams, IUserInfoResponseData } from '@/api/user/type'
import type { IUserState } from '@/store/modules/types/userType.ts'
/** 导入工具包 */
import { SET_TOKEN } from '@/utils/token'

export default defineStore('user', {
  state: (): IUserState => {
    return {
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用户登录
    async loginStatus(data: ILoginParams) {
      const result = await requestLoginAPI(data)
      //   判断返回结果返回相对应的 Promise 状态
      if (result.code === 200) {
        // 登录成功
        SET_TOKEN(result.data.token as string)
        return 'ok'
      } else {
        // 登录失败
        return Promise.reject(new Error(result.data.message))
      }
    },
    // 获取用户信息
    async getUserInfo() {
      const result: IUserInfoResponseData = await requestUserInfoAPI()
      if (result.code === 200) {
        this.username = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
        return result.data.checkUser
      } else {
        // 用户信息获取失败
        return Promise.reject(new Error('用户信息获取失败！'))
      }
    },
    // 清空存储在仓库的用户信息【退出登录】
    loginOut() {
      this.username = ''
      this.avatar = ''
    },
  },
  getters: {},
})
