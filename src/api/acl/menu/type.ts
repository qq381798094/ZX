/** 权限管理 / 菜单管理模块相关接口数据的类型约束 */
export type MenuManageResponseData<T> = {
  code: number
  message: string
  data: T
  ok: boolean
}

// 获取菜单【类型约束】
export type MenuListDataItem = {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null | string
  toCode: null | string
  type: number
  status: null
  level: number
  children: MenuListDataItem[] | []
  select: boolean
}
export type MenuListResponseData = MenuManageResponseData<MenuListDataItem[]>

// 添加|修改 菜单 --> 携带的参数
export type MenuOptionParams = {
  id?: number
  code: string
  level: number | undefined
  name: string
  pid: number | undefined
}
