/** 权限管理 / 菜单管理模块相关接口 */
import request from '@/utils/request'

/** 接口类型约束 */
import type { MenuListResponseData, MenuOptionParams, MenuManageResponseData } from './type'

/** 接口枚举 */
enum API {
  // 获取菜单
  GET_MENU_LIST__URL = '/admin/acl/permission',
  // 新增菜单
  POST_NEW_MENU__URL = '/admin/acl/permission/save',
  // 修改菜单
  PUT_UPDATE_MENU__URL = '/admin/acl/permission/update',
  // 递归删除菜单
  DELETE_MENU_ITEM_BY_ID__URL = '/admin/acl/permission/remove/',
}

// 获取菜单
export const requestGetMenuListAPI = () =>
  request.get<any, MenuListResponseData>(API.GET_MENU_LIST__URL)

// 新增 | 修改  -> 菜单
export const requestAddOrUpdateMenuAPI = (data: MenuOptionParams) => {
  const { id } = data
  if (id) {
    return request.put<any, MenuManageResponseData<string | null>>(API.PUT_UPDATE_MENU__URL, data)
  } else {
    return request.post<any, MenuManageResponseData<string | null>>(API.POST_NEW_MENU__URL, data)
  }
}

// 递归删除菜单
export const requestDeleteMenuItemByIdAPI = (id: number) =>
  request.delete<any, MenuManageResponseData<string | null>>(API.DELETE_MENU_ITEM_BY_ID__URL + id)
