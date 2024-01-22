/** 品牌管理模块相关接口数据的类型约束 */

/** 品牌模块接口固定返回数据的类型约束 */
export interface IBrandResponseData<T> {
  code: number
  message: string
  ok: boolean
  data: T
}

// 获取已有品牌管理数据：携带参数的类型约束
export type TGetBrandParams = {
  page: number
  limit: number
}

// 获取已有品牌管理数据： 接口返回数据的类型约束
export type TRecordsItem = {
  id?: number
  createTime: string
  updateTime: string
  tmName: string
  logoUrl: string
}

type BrandInfo = {
  pages: number
  searchCount: boolean
  maxLimit: null
  countId: null
  hitCount: boolean
  optimizeCountSql: boolean
  orders: []
  current: number
  size: number
  total: number
  records: TRecordsItem[]
}

export type IGetBrandResponseByPageData = IBrandResponseData<BrandInfo>

// 新增品牌或者修改已有品牌：携带参数的类型约束
export type TAddOrUpdateBrandParams = {
  id?: number
  tmName: string
  logoUrl: string
}
