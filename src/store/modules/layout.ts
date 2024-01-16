/** Layout 组件相关配置仓库 */
import { defineStore } from 'pinia'

/** 类型约束导入 */
import type { ILayoutState } from './types/layoutType'

export default defineStore('layout', {
  state: (): ILayoutState => {
    return {
      // 控制 Layout 左侧菜单的展开与隐藏
      foldFlag: false,
    }
  },
  actions: {
    // 取反 foldFlag
    foldRetreat() {
      this.foldFlag = !this.foldFlag
    },
  },
  getters: {},
})
