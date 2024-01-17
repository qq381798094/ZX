/** 品牌管理模块相关接口 */
import request from '@/utils/request'

/** 类型约束 */
import { TGetBrandParams, IGetBrandResponseByPageData } from './type'

/** 接口地址枚举 */
enum API {
  // 获取已有品牌接口【需要页码和数据条数】
  GET_HAS_BRAND_BY_PAGE_URL = '/admin/product/baseTrademark/',
}

/** 接口方法 */
// 获取已有品牌数据的接口
export const requestGetHasBrandByPageAPI = (data: TGetBrandParams) =>
  request.get<any, IGetBrandResponseByPageData>(
    API.GET_HAS_BRAND_BY_PAGE_URL + `${data.page}/${data.limit}`,
  )
