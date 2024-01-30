/** 属性管理模块相关接口 */
import request from '@/utils/request'

/** 类型约束 */
import {
  TCategoryResponseData,
  TAttrResponseData,
  IAttributeParams,
  TAddOrUpdateAttributeResponseData,
  TDeleteAttributeResponseData,
} from './type'

/** 接口地址枚举 */
enum API {
  // 获取一级分类数据接口
  GET_FIRST_CATEGORY_URL = '/admin/product/getCategory1',
  // 获取二级分类数据接口
  GET_SECOND_CATEGORY_BY_ID_URL = '/admin/product/getCategory2/',
  // 获取三级分类数据接口
  GET_THIRD_CATEGORY_BY_ID_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性与属性值
  GET_ATTR_INFO_BY_CATEGORY_ID_URL = '/admin/product/attrInfoList/',
  // 添加 or 修改已有的属性值
  ADD_UPDATE_ATTRIBUTE_INFO_URL = '/admin/product/saveAttrInfo',
  // 删除已有属性
  DELETE_ATTRIBUTE_BY_ID_URL = '/admin/product/deleteAttr/',
}

// 获取一级分类数据接口
export const requestFirstCategoryData = () =>
  request.get<any, TCategoryResponseData>(API.GET_FIRST_CATEGORY_URL)

// 获取二级分类数据接口
export const requestSecondCategoryByFirstIdData = (category1Id: number) =>
  request.get<any, TCategoryResponseData>(API.GET_SECOND_CATEGORY_BY_ID_URL + category1Id)

// 获取三级分类数据接口
export const requestThirdCategoryBySecondIdData = (category2Id: number) =>
  request.get<any, TCategoryResponseData>(API.GET_THIRD_CATEGORY_BY_ID_URL + category2Id)

// 获取分类下已有的属性与属性值
export const requestGetAttrInfoByCategoryIdData = (
  category1Id: number,
  category2Id: number,
  category3Id: number,
) =>
  request.get<any, TAttrResponseData>(
    API.GET_ATTR_INFO_BY_CATEGORY_ID_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

// 添加 or 修改已有的属性值
export const requestPostAddOrUpdateAttrData = (data: IAttributeParams) =>
  request.post<any, TAddOrUpdateAttributeResponseData>(API.ADD_UPDATE_ATTRIBUTE_INFO_URL, data)

// 删除已有属性
export const requestDeleteAttributeByIdData = (attrId: number) =>
  request.delete<any, TDeleteAttributeResponseData>(API.DELETE_ATTRIBUTE_BY_ID_URL + attrId)
