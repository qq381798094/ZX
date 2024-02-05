/** 权限管理 / 用户管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type { UserListResponseData, UserListItem, UserManageResponseData } from './type'

/** 接口地址枚举 */
enum API {
  // 获取管理用户分页列表
  GET_USER_LIST_BY_PAGE__URL = '/admin/acl/user/',
  // 新增管理用户
  POST_ADD_USER__URL = '/admin/acl/user/save',
  // 修改管理用户
  PUT_UPDATE_USER__URL = '/admin/acl/user/update',
}

// 获取管理用户分页列表【根据分页】
export const requestUserListByPageAPI = (page: number, limit: number) =>
  request.get<any, UserListResponseData>(API.GET_USER_LIST_BY_PAGE__URL + `${page}/${limit}`)

// 添加 or 修改用户信息
export const requestAddOrUpdateUserAPI = (data: UserListItem) => {
  if (data.id) {
    return request.put<any, UserManageResponseData<string | null>>(API.PUT_UPDATE_USER__URL, data)
  } else {
    return request.post<any, UserManageResponseData<string | null>>(API.POST_ADD_USER__URL, data)
  }
}
