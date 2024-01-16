<template>
  <!-- 伸缩菜单栏图标 -->
  <el-icon style="margin-right: 15px" @click="changeIcon">
    <component :is="layoutStore.foldFlag ? 'Expand' : 'Fold'" />
  </el-icon>
  <!-- 面包屑导航 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="item in $route.matched"
      :key="item.path"
      v-show="item.meta.icon"
      :to="item.path"
    >
      <div class="breadcrumb-item">
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span class="title">{{ item.meta.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue'
  /** 引入 API  */
  import { useRoute } from 'vue-router'
  /** 引入仓库 */
  import useLayoutStore from '@/store/modules/layout'

  /** 实例化路由对象 */
  let $route = useRoute()

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

<style scoped lang="scss">
  .breadcrumb-item {
    display: flex;
    align-items: center;

    .title {
      margin-left: 5px;
    }
  }
</style>
