/** 用户相关接口  */
import request from '@/utils/request'

/** 类型导入 */
import {
  ILoginParams,
  ILoginResponseData,
  IUserInfoResponseData,
  ILoginOutResponseData,
} from './type'

// 接口管理
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGIN_OUT_URL = '/admin/acl/index/logout',
}

// 登录接口方法
export const requestLoginAPI = (data: ILoginParams) =>
  request.post<any, ILoginResponseData>(API.LOGIN_URL, data)

// 获取用户信息接口方法
export const requestUserInfoAPI = () => request.get<any, IUserInfoResponseData>(API.USERINFO_URL)

// 用户退出登录接口方法
export const requestLoginOutAPI = () => request.post<any, ILoginOutResponseData>(API.LOGIN_OUT_URL)
