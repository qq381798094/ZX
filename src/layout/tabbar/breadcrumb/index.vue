<template>
  <!-- 伸缩菜单栏图标 -->
  <el-icon style="margin-right: 15px" @click="changeIcon">
    <component :is="layoutStore.foldFlag ? 'Expand' : 'Fold'" />
  </el-icon>
  <!-- 面包屑导航 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue'
  /** 引入 API  */
  // import { ref } from 'vue'
  /** 引入仓库 */
  import useLayoutStore from '@/store/modules/layout'

  /** 实例化仓库对象 */
  let layoutStore = useLayoutStore()

  /** 图标点击事件 */
  //   控制图标折叠与展开切换
  const changeIcon = () => {
    // 触发取反函数
    layoutStore.foldRetreat()
  }
</script>
<script lang="ts">
  export default {
    name: 'Breadcrumb',
  }
</script>

<style scoped></style>
