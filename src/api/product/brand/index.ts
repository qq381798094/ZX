/** 品牌管理模块相关接口 */
import request from '@/utils/request'

/** 类型约束 */
import {
  TGetBrandParams,
  IGetBrandResponseByPageData,
  TAddOrUpdateBrandParams,
} from './type'

/** 接口地址枚举 */
enum API {
  // 获取已有品牌接口【需要页码和数据条数】
  GET_HAS_BRAND_BY_PAGE_URL = '/admin/product/baseTrademark/',
  // 添加品牌数据接口
  POST_ADD_BRAND_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌数据接口
  PUT_UPDATE_BRAND_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌数据接口
  DELETE_BRAND_URL = '/admin/product/baseTrademark/remove/',
}

/** 接口方法 */

// 获取已有品牌数据的接口
export const requestGetHasBrandByPageAPI = (data: TGetBrandParams) =>
  request.get<any, IGetBrandResponseByPageData>(
    API.GET_HAS_BRAND_BY_PAGE_URL + `${data.page}/${data.limit}`,
  )

// 添加与修改品牌数据接口
export const requestAddOrUpdateBrandAPI = (data: TAddOrUpdateBrandParams) => {
  if (data.id) {
    // 调用修改品牌接口
    return request.put<any, any>(API.PUT_UPDATE_BRAND_URL, data)
  } else {
    // 调用新增品牌接口
    return request.post<any, any>(API.POST_ADD_BRAND_URL, data)
  }
}

// 删除已有品牌数据接口
export const requestDeleteBrandByIdAPI = (id: number) =>
  request.delete<any, any>(API.DELETE_BRAND_URL + id)
