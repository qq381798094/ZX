/** 用户接口类型约束 */

// 数据接口大体类型
export interface IResponseData {
  code: number
}

// 登录接口参数类型
export interface ILoginParams {
  username: string
  password: string
}

// 登录接口返回参数类型
export interface IDataType {
  token: string
}
export interface ILoginResponseData extends IResponseData {
  data: IDataType
}

// 用户信息接口返回参数类型
export interface IUserInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
interface ICheckUser {
  checkUser: IUserInfo
}
export interface IUserInfoResponseData extends IResponseData {
  data: ICheckUser
}
