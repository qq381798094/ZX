/** Category 组件相关配置仓库 */
import { defineStore } from 'pinia'

/** 接口引入 */
import { requestFirstCategoryData } from '@/api/product/attr'

/** 类型引入 */
import type { ICategoryState } from './types/categoryType'
import type {
  TCategoryResponseData,
  ICategoryData,
} from '@/api/product/attr/type'

export default defineStore('Category', {
  state: (): ICategoryState => {
    return {
      // 存储一级分类数据列表
      firstCategoryList: [],
      // 存储一类分类获取的 id
      firstCategoryId: undefined,
    }
  },
  actions: {
    /** 获取一级分类数据列表 */
    async getFirstCategoryList() {
      const result: TCategoryResponseData = await requestFirstCategoryData()
      if (result.code === 200) {
        this.firstCategoryList = result.data.map((item: ICategoryData) => {
          return {
            label: item.name,
            value: item.id,
          }
        })
      }
    },
  },
  getters: {},
})
