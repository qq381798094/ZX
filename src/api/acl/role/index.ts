/** 权限管理 / 角色管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type {
  RoleListResponseData,
  RoleListItem,
  RoleManageResponseData,
  RoleMenuListResponseData,
} from './type'

/** 接口地址枚举 */
enum API {
  // 获取角色分页列表
  GET_ROLE_LIST_BY_PAGE__URL = '/admin/acl/role/',
  // 新增角色
  POST_ADD_ROLE__URL = '/admin/acl/role/save',
  // 修改角色
  PUT_UPDATE_ROLE__URL = '/admin/acl/role/update',
  // 根据角色获取菜单
  GET_MENU_LIST_BY_ID__URL = '/admin/acl/permission/toAssign/',
  // 给角色分配权限
  POST_PERMISSION_ASSIGN___URL = '/admin/acl/permission/doAssign/?',
}

// 获取角色分页列表
export const requestRoleListByPageAPI = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleListResponseData>(
    API.GET_ROLE_LIST_BY_PAGE__URL + `${page}/${limit}/?roleName=${roleName}`,
  )

// 新增或者修改角色信息
export const requestAddOrUpdateRoleInfoAPI = (data: RoleListItem) => {
  const { id } = data
  if (id) {
    return request.put<any, RoleManageResponseData<string | null>>(API.PUT_UPDATE_ROLE__URL, data)
  } else {
    return request.post<any, RoleManageResponseData<string | null>>(API.POST_ADD_ROLE__URL, data)
  }
}

// 根据角色获取菜单
export const requestMenuListByIdAPI = (roleId: number) =>
  request.get<any, RoleMenuListResponseData>(API.GET_MENU_LIST_BY_ID__URL + roleId)

// 给角色分配权限
export const requestDistributePermissionAPI = (roleId: number, permissionId: number[]) =>
  request.post<any, RoleManageResponseData<string | null>>(
    API.POST_PERMISSION_ASSIGN___URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )
