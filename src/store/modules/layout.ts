/** Layout 组件相关配置仓库 */
import { defineStore } from 'pinia'

/** 类型约束导入 */
import type { ILayoutState } from './types/layoutType'
import { FOCUS_AFTER_RELEASED } from 'element-plus/lib/components/focus-trap/index.js'

export default defineStore('layout', {
  state: (): ILayoutState => {
    return {
      // 控制 Layout 左侧菜单的展开与隐藏
      foldFlag: false,
      // 通过更改 refresh 数据提醒组件进行 DOM 组件更新【刷新】
      refresh: false,
    }
  },
  actions: {
    // 取反 foldFlag
    foldRetreat() {
      this.foldFlag = !this.foldFlag
    },
    // 取反 refresh
    refreshRetreat() {
      this.refresh = !this.refresh
    },
  },
  getters: {},
})
