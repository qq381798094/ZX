/** SPU 管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type {
  TGetSpuResponseData,
  TAllBrandResponseData,
  TSpuImagesResponseData,
  TSpuSaleAttributesResponseData,
  TAllSaleAttributesResponseData,
  TAddOrUpdateSpuResponseData,
  IAddOrUpdateParams,
} from './type'

/** 接口地址枚举 */
enum API {
  // 根据页码和当前页数据获取 SPU 数据
  GET_SPU_DATA_BY_PAGE__URL = '/admin/product/',
  // 获取全部品牌的数据
  GET_ALL_BRAND_DATA__URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某一个 SPU 下全部的售卖商品图片数据
  GET_SPU_IMAGES_BY_ID__URL = '/admin/product/spuImageList/',
  // 获取某一个 SPU 下全部的销售属性数据
  GET_SPU_SALE_ATTRIBUTES_BY_ID__URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性属性[颜色、版本、尺码]
  GET_ALL_SALE_ATTRIBUTES__URL = '/admin/product/baseSaleAttrList',
  // 添加一个新的 SPU 数据
  POST_ADD_NEW_SPU_DATA__URL = '/admin/product/saveSpuInfo',
  // 更新当前的 SPU 数据
  POST_UPDATE_SPU_DATA__URL = '/admin/product/updateSpuInfo',
}

// 根据页码和当前页数据获取 SPU 数据
export const requestSpuDataByPageAPI = (page: number, limit: number, category3Id?: number) =>
  request.get<any, TGetSpuResponseData>(
    API.GET_SPU_DATA_BY_PAGE__URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部品牌的数据
export const requestAllBrandDataAPI = () =>
  request.get<any, TAllBrandResponseData>(API.GET_ALL_BRAND_DATA__URL)

// 获取某一个 SPU 下全部的售卖商品图片数据
export const requestSpuImgsByIdAPI = (spuId: number) =>
  request.get<any, TSpuImagesResponseData>(API.GET_SPU_IMAGES_BY_ID__URL + spuId)

// 获取某一个 SPU 下全部的销售属性数据
export const requestSpuSaleAttributesByIdAPI = (spuId: number) =>
  request.get<any, TSpuSaleAttributesResponseData>(API.GET_SPU_SALE_ATTRIBUTES_BY_ID__URL + spuId)

// 获取整个项目全部的销售属性属性[颜色、版本、尺码]
export const requestAllSaleAttributeAPI = () =>
  request.get<any, TAllSaleAttributesResponseData>(API.GET_ALL_SALE_ATTRIBUTES__URL)

// 添加（新的） && 更新（一个）SPU 数据
export const requestAddOrUpdateSpuDataAPI = (data: IAddOrUpdateParams) => {
  if (data.id) {
    // 修改/更新 SPU 数据
    return request.post<any, TAddOrUpdateSpuResponseData>(API.POST_UPDATE_SPU_DATA__URL, data)
  } else {
    // 添加 SPU 数据
    return request.post<any, TAddOrUpdateSpuResponseData>(API.POST_ADD_NEW_SPU_DATA__URL, data)
  }
}
