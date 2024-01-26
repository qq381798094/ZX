/** 商品管理/ SPU 管理模块相关接口数据的类型约束 */
export interface ISpuResponseData<T> {
  code: number
  message: string
  data: T
  ok: boolean
}

/** 获取 SPU 数据部分 */
// 数据记录类型约束
export interface IRecordsItem {
  id?: number
  category3Id?: number
  spuName: string
  description: string
  tmId: number
  spuSaleAttrList: null
  spuImageList: null
  spuPosterList: null
  createTime: string
  updateTime: string
}
export interface ISpuData {
  records: IRecordsItem[]
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
// 获取 SPU 数据接口返回类型约束
export type TGetSpuResponseData = ISpuResponseData<ISpuData>
