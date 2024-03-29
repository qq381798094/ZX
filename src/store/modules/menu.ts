/**
 * 存储菜单路由数组的仓库
 */
import { defineStore } from 'pinia'
/** 导入 routes 常量 */
import { constantRoutes } from '@/router/routes'
/** 导入类型 */
import type { IMenuType } from './types/menuType'

export default defineStore('menu', {
  state(): IMenuType {
    return {
      menuRoutes: constantRoutes,
    }
  },
  actions: {
    // 设置路由对象数组
    setMenuRoutes(newMenu: any[]) {
      this.menuRoutes = newMenu
    },
    // 将对象恢复成初始状态
    clearMenuRoutes() {
      this.menuRoutes = constantRoutes
    },
  },
  getters: {},
})
