/** 权限管理 / 角色管理模块相关接口数据的类型约束 */
export type RoleManageResponseData<T> = {
  code: number
  message: string
  data: T
  ok: boolean
}

// 获取角色分页列表
export type RoleListItem = {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}
export type RoleListDataObject = {
  records: RoleListItem[]
  total: number
  size: number
  current: number
  orders: []
  optimizeCountSql: boolean
  hitCount: boolean
  countId: null
  maxLimit: null
  searchCount: boolean
  pages: number
}
export type RoleListResponseData = RoleManageResponseData<RoleListDataObject>

// 根据角色获取菜单
export type RoleMenuListDataItem = {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null | string
  toCode: null | string
  type: number
  status: null
  level: number
  children: RoleMenuListDataItem[] | []
  select: boolean
}
export type RoleMenuListResponseData = RoleManageResponseData<RoleMenuListDataItem[]>
