/** 商品管理/属性管理模块相关接口数据的类型约束 */
export interface ICategoryResponseData<T> {
  code: number
  message: string
  data: T
  ok: boolean
}

// 分类
export interface ICategoryData {
  id: number
  createTime: string
  updateTime: string
  name: string
  category1Id?: number
  category2Id?: number
}
export type TCategoryResponseData = ICategoryResponseData<ICategoryData[]>
