/** 用户相关接口  */
import request from '@/utils/request'

/** 类型导入 */
import type {
  ILoginParams,
  ILoginResponseData,
  IUserInfoResponseData,
} from './type'

// 接口管理
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}

// 登录接口方法
export const requestLoginAPI = (data: ILoginParams) =>
  request.post<any, ILoginResponseData>(API.LOGIN_URL, data)

// 获取用户信息接口方法
export const requestUserInfoAPI = () =>
  request.get<any, IUserInfoResponseData>(API.USERINFO_URL)
