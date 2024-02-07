/** 权限管理 / 用户管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type {
  UserListResponseData,
  UserListItem,
  UserManageResponseData,
  JobListResponseData,
  AssignJobsParams,
} from './type'

/** 接口地址枚举 */
enum API {
  // 获取管理用户分页列表
  GET_USER_LIST_BY_PAGE__URL = '/admin/acl/user/',
  // 新增管理用户
  POST_ADD_USER__URL = '/admin/acl/user/save',
  // 修改管理用户
  PUT_UPDATE_USER__URL = '/admin/acl/user/update',
  // 根据用户获取角色数据
  GET_JOBS_BY_USER__URL = '/admin/acl/user/toAssign/',
  // 根据用户分配角色
  POST_ASSIGN_ROLE_BY_USER__URL = '/admin/acl/user/doAssignRole',
  // 删除管理用户【一个】
  DELETE_USER_BU_ID__URL = '/admin/acl/user/remove/',
  // 根据id列表删除管理用户【多个】
  DELETE_USERS_BY_IDS__URL = '/admin/acl/user/batchRemove',
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

// 根据用户获取角色数据
export const requestJobsByUserAPI = (adminId: number) =>
  request.get<any, JobListResponseData>(API.GET_JOBS_BY_USER__URL + adminId)

// 根据用户分配角色
export const requestAssignJobByUserAPI = (data: AssignJobsParams) =>
  request.post<any, UserManageResponseData<string | null>>(API.POST_ASSIGN_ROLE_BY_USER__URL, data)

// 删除管理用户【一个】
export const requestDelUserByIdAPI = (id: number) =>
  request.delete<any, UserManageResponseData<string | null>>(API.DELETE_USER_BU_ID__URL + id)

// 根据id列表删除管理用户【多个】
export const requestDelUsersByIdListAPI = (idList: number[]) =>
  request.delete<any, UserManageResponseData<string | null>>(API.DELETE_USERS_BY_IDS__URL, {
    data: idList,
  })
