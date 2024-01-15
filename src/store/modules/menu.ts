/**
 * 存储菜单路由数组的仓库
 */
import { defineStore } from 'pinia'
/** 导入 routes 常量 */
import constantRoute from '@/router/routes'
/** 导入类型 */
import type { IMenuType } from './types/menuType'

export default defineStore('menu', {
  state(): IMenuType {
    return {
      menuRoutes: constantRoute,
    }
  },
  actions: {},
  getters: {},
})
