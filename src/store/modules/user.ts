import { defineStore } from 'pinia'
/** 导入接口 */
import { requestLoginAPI } from '@/api/user'
/** 导入类型 */
import type { ILoginParams } from '@/api/user/type'

export default defineStore('user', {
  state: () => {
    return {}
  },
  actions: {
    // 登录方法
    async loginStatus(data: ILoginParams) {
      const result = await requestLoginAPI(data)
      //   判断返回结果返回相对应的 Promise 状态
      if (result.code === 200) {
        // 登录成功
        localStorage.setItem('TOKEN', result.data.token)
        return 'ok'
      } else {
        // 登录失败
        return Promise.reject(new Error(result.data.message))
      }
    },
  },
  getters: {},
})
