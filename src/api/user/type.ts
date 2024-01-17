/** 用户接口类型约束 */

/** 用户模块接口固定返回数据的类型约束 */
export interface IUserResponseData {
  code: number
  message: string
  ok: boolean
}

// 用户登录接口携带相关参数的类型约束
export interface ILoginParams {
  username: string
  password: string
}

// 用户登录接口返回数据的类型约束
export interface ILoginResponseData extends IUserResponseData {
  data: string
}

// 获取用户信息接口返回数据的类型约束
export interface IUserInfoResponseData extends IUserResponseData {
  data: {
    name: string
    avatar: string
    roles: string[]
    buttons: string[]
    routes: string[]
  }
}

// 用户退出登录接口返回的数据类型
export interface ILoginOutResponseData extends IUserResponseData {
  data: null
}
