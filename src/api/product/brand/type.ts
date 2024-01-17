/** 品牌管理模块相关接口数据的类型约束 */

/** 品牌模块接口固定返回数据的类型约束 */
export interface IBrandResponseData {
  code: number
  message: string
  ok: boolean
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
export interface IGetBrandResponseByPageData extends IBrandResponseData {
  data: {
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
}
