/** Category 组件相关配置仓库 */
import { defineStore } from 'pinia'

/** 接口引入 */
import {
  requestFirstCategoryData,
  requestSecondCategoryByFirstIdData,
  requestThirdCategoryBySecondIdData,
} from '@/api/product/attr'

/** 类型引入 */
import type { ICategoryState } from './types/categoryType'
import type { TCategoryResponseData, ICategoryData } from '@/api/product/attr/type'

export default defineStore('Category', {
  state: (): ICategoryState => {
    return {
      // 存储一级分类数据列表 && 获取的 id
      firstCategoryList: [],
      firstCategoryId: undefined,
      // 存储二级分类数据列表 && 获取的 id
      secondCategoryList: [],
      secondCategoryId: undefined,
      // 存储三级分类数据列表 && 获取的 id
      thirdCategoryList: [],
      thirdCategoryId: undefined,
    }
  },
  actions: {
    /** 清空二级分类的 id */
    clearSecondCategoryId() {
      this.secondCategoryId = undefined
    },
    /** 清空三级分类的数据列表 */
    clearThirdCategoryList() {
      this.thirdCategoryList = []
    },
    /** 清空三级分类的 id */
    clearThirdCategoryId() {
      this.thirdCategoryId = undefined
    },
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
    /** 获取二级分类数据列表 */
    async getSecondCategoryList() {
      const result: TCategoryResponseData = await requestSecondCategoryByFirstIdData(
        this.firstCategoryId as number,
      )
      if (result.code === 200) {
        this.secondCategoryList = result.data.map((item: ICategoryData) => {
          return {
            label: item.name,
            value: item.id,
            category1Id: item.category1Id,
          }
        })
      }
    },
    /** 获取三级分类数据列表 */
    async getThirdCategoryList() {
      const result: TCategoryResponseData = await requestThirdCategoryBySecondIdData(
        this.secondCategoryId as number,
      )
      if (result.code === 200) {
        this.thirdCategoryList = result.data.map((item: ICategoryData) => {
          return {
            label: item.name,
            value: item.id,
            category2Id: item.category2Id,
          }
        })
      }
    },
  },
  getters: {},
})
