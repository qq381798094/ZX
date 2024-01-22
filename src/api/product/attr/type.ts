/** 商品管理/属性管理模块相关接口数据的类型约束 */
export interface IResponseData<T> {
  code: number
  message: string
  data: T
  ok: boolean
}

// 分类管理类型约束
export interface ICategoryData {
  id: number
  createTime: string
  updateTime: string
  name: string
  category1Id?: number
  category2Id?: number
}
export type TCategoryResponseData = IResponseData<ICategoryData[]>

// 属性与属性值类型约束
export interface IAttrValueItem {
  id: number
  createTime: string | null
  updateTime: string | null
  valueName: string
  attrId: number
}
export interface IAttrResponseDataItem {
  id: number
  createTime: string | null
  updateTime: string | null
  attrName: string
  categoryId: number
  categoryLevel: number
  attrValueList: IAttrValueItem[]
}

export type TAttrResponseData = IResponseData<IAttrResponseDataItem[]>
