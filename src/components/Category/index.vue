<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.firstCategoryId">
          <el-option
            v-for="item in categoryStore.firstCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select>
          <el-option label="item.label" value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select>
          <el-option label="item.label" value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { onMounted } from 'vue'
  /** 引入仓库 */
  import useCategoryStore from '@/store/modules/category'

  /** 组件挂载后调用 */
  onMounted(() => {
    // 获取一级分类的数据
    getFirstCategoryListData()
  })

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()

  /** 请求数据方法 */
  const getFirstCategoryListData = () => {
    // 调用仓库的方法进行数据请求
    categoryStore.getFirstCategoryList()
  }
</script>
<script lang="ts">
  export default {
    name: 'CategoryComponent',
  }
</script>

<style scoped></style>
