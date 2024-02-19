/** 权限管理 / 菜单管理模块相关接口 */
import request from '@/utils/request'

/** 接口类型约束 */
import type { MenuListResponseData } from './type'

/** 接口枚举 */
enum API {
  // 获取菜单
  GET_MENU_LIST__URL = '/admin/acl/permission',
}

// 获取菜单
export const requestGetMenuList = () =>
  request.get<any, MenuListResponseData>(API.GET_MENU_LIST__URL)
