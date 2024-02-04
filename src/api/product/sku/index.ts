/** SKU 管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import { SkuListResponseData } from './type'

/** 接口地址枚举 */
enum API {
  // 根据页码获取数据
  GET_SKU_DATA_BY_PAGE__URL = '/admin/product/list/',
}

// 根据页码获取数据
export const requestSkuDataByPageAPI = (page: number, limit: number) =>
  request.get<any, SkuListResponseData>(API.GET_SKU_DATA_BY_PAGE__URL + `${page}/${limit}`)
