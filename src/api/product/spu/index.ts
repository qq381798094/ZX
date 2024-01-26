/** SPU 管理模块相关接口 */
import request from '@/utils/request'

/** 类型引入 */
import type { TGetSpuResponseData } from './type'

/** 接口地址枚举 */
enum API {
  // 根据页码和当前页数据获取 SPU 数据
  GET_SPU_DATA_BY_PAGE__URL = '/admin/product/',
}

// 根据页码和当前页数据获取 SPU 数据
export const requestSpuDataByPage = (
  page: number,
  limit: number,
  category3Id?: number,
) =>
  request.get<any, TGetSpuResponseData>(
    API.GET_SPU_DATA_BY_PAGE__URL +
      `${page}/${limit}?category3Id=${category3Id}`,
  )
