/** 权限管理 / 角色管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type { RoleListResponseData } from './type'

/** 接口地址枚举 */
enum API {
  // 获取角色分页列表
  GET_ROLE_LIST_BY_PAGE__URL = '/admin/acl/role/',
}

// 获取角色分页列表
export const requestRoleListByPageAPI = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleListResponseData>(
    API.GET_ROLE_LIST_BY_PAGE__URL + `${page}/${limit}/?roleName=${roleName}`,
  )
