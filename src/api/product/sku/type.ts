/** 商品管理/ SPU 管理模块相关接口数据的类型约束 */
export type SkuResponseData<T> = {
  code: number
  message: string
  data: T
  ok: boolean
}

// 关于获取 SKU 列表数据类型约束
export type SkuListDataRecordsItem = {
  id: number
  createTime: string
  updateTime: string
  spuId: number
  price: number
  skuName: string
  skuDesc: string
  weight: string
  tmId: number
  category3Id: number
  skuDefaultImg: string
  isSale: number
  skuImageList: null
  skuAttrValueList: null
  skuSaleAttrValueList: null
}
export type SkuListDataObject = {
  records: SkuListDataRecordsItem[]
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
export type SkuListResponseData = SkuResponseData<SkuListDataObject>
