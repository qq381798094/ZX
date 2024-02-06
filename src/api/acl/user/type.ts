/** 权限管理 / 用户管理模块相关接口数据的类型约束 */
export type UserManageResponseData<T> = {
  code: number
  message: string
  data: T
  ok: boolean
}

// 获取管理用户分页列表
export type UserListItem = {
  // 新增需要
  id?: number
  name: string
  username: string
  password: string
  createTime?: string
  updateTime?: string
  phone?: null
  roleName?: string
}
export type UserListObject = {
  records: UserListItem[]
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
export type UserListResponseData = UserManageResponseData<UserListObject>