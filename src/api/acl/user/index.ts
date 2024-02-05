/** 权限管理 / 用户管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type { UserListResponseData } from './type'

/** 接口地址枚举 */
enum API {
  // 获取管理用户分页列表
  GET_USER_LIST_BY_PAGE__URL = '/admin/acl/user/',
}

// 获取管理用户分页列表【根据分页】
export const requestUserListByPageAPI = (page: number, limit: number) =>
  request.get<any, UserListResponseData>(API.GET_USER_LIST_BY_PAGE__URL + `${page}/${limit}`)
