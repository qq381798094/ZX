<template>
  <div>
    <!-- 三级分类全局组件 -->
    <CategoryCard />
    <!-- 搜索结果展示平台卡片 -->
    <el-card class="result-card">
      <!-- 添加平台属性按钮 -->
      <el-button
        :icon="Plus"
        type="primary"
        :disabled="categoryStore.thirdCategoryId ? false : true"
      >
        添加平台属性
      </el-button>
      <!-- 表格 -->
      <el-table class="result-table" border stripe>
        <el-table-colum label="序号" type="index" align="center" width="80px" />
        <el-table-colum label="属性名称" width="120px" />
        <el-table-colum label="属性值名称" />
        <el-table-colum label="操作" width="120px" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  /** EL 组件引入 */
  import { Plus } from '@element-plus/icons-vue'
  /** 仓库引入 */
  import useCategoryStore from '@/store/modules/category'

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()
</script>
<script lang="ts">
  export default {
    name: 'Attribute',
  }
</script>

<style scoped lang="scss">
  // 搜索结果卡片
  .result-card {
    margin-top: 20px;
  }
  // 搜索结果表格
  .result-table {
    margin-top: 15px;
  }
</style>
