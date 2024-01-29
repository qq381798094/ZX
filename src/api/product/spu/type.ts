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
  tmId: number
  category3Id?: number
  spuName: string
  description: string
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

/* 获取全部品牌的数据部分 */
export interface IAllBrandItem {
  id: number
  createTime: string
  updateTime: string
  tmName: string
  logoUrl: string
}

// 获取全部品牌的数据部分 返回类型约束
export type TAllBrandResponseData = ISpuResponseData<IAllBrandItem[]>

/** 获取某个 SPU 下的所有图片数组数据部分 */

export interface ISpuImageItem {
  id?: number
  imgName: string
  imgUrl: string
  createTime?: string
  updateTime?: string
  spuId?: number
}

// 获取某个 SPU 下的所有图片数组数据部分 返回数据的类型约束
export type TSpuImagesResponseData = ISpuResponseData<ISpuImageItem[]>

/** 获取某一个 SPU 下全部的销售属性数据部分 */
export interface ISpuSaleAttributeValueItem {
  id?: number
  saleAttrValueName: string
  baseSaleAttrId: number
  spuId?: number
  createTime?: string | null
  updateTime?: string | null
  saleAttrName?: string
  isChecked?: null
}
export interface ISpuSaleAttributeItem {
  id?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: ISpuSaleAttributeValueItem[]
  spuId?: number
  createTime?: string | null
  updateTime?: string | null
}

// 获取某一个 SPU 下全部的销售属性数据部分 返回数据的类型约束
export type TSpuSaleAttributesResponseData = ISpuResponseData<
  ISpuSaleAttributeItem[]
>

/** 获取整个项目全部的销售属性属性[颜色、版本、尺码] */
export interface IAllSaleAttributeItem {
  id: number
  name: string
  createTime: string
  updateTime: string
}

// 获取整个项目全部的销售属性属性[颜色、版本、尺码] 返回数据的类型约束
export type TAllSaleAttributesResponseData = ISpuResponseData<
  IAllSaleAttributeItem[]
>

/** 添加 && 修改 SPU 数据 ： 所需参数的类型约束 */
// 图片数组
export interface IAddOrUpdateParams {
  id?: number
  tmId: number | undefined
  category3Id: number | undefined
  spuName: string
  description: string
  spuImageList: null | ISpuImageItem[]
  spuSaleAttrList: null | ISpuSaleAttributeItem[]
}

// 添加 || 修改 SPU 数据的返回类型约束
export type TAddOrUpdateSpuResponseData = ISpuResponseData<string | null>
