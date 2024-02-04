/** SKU 管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import { SkuListResponseData, SkuResponseData } from './type'

/** 接口地址枚举 */
enum API {
  // 根据页码获取数据
  GET_SKU_DATA_BY_PAGE__URL = '/admin/product/list/',
  // SKU 下架请求
  GET_SKU_CANCEL_SALE_BY_ID__URL = '/admin/product/cancelSale/',
  // SKU 上架请求
  GET_SKU_ON_SALE_BY_ID__URL = '/admin/product/onSale/',
}

// 根据页码获取数据
export const requestSkuDataByPageAPI = (page: number, limit: number) =>
  request.get<any, SkuListResponseData>(API.GET_SKU_DATA_BY_PAGE__URL + `${page}/${limit}`)

// SKU 上架请求
export const requestOnSaleSkuByIdAPI = (skuId: number) =>
  request.get<any, SkuResponseData<string | null>>(API.GET_SKU_ON_SALE_BY_ID__URL + skuId)

// SKU 下架请求
export const requestCancelSaleSkuByIdAPI = (skuId: number) =>
  request.get<any, SkuResponseData<string | null>>(API.GET_SKU_CANCEL_SALE_BY_ID__URL + skuId)
