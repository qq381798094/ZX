<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          :disabled="props.disabled"
          v-model="categoryStore.firstCategoryId"
          @change="firstCategorySelected"
        >
          <el-option
            v-for="item in categoryStore.firstCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="props.disabled"
          v-model="categoryStore.secondCategoryId"
          @change="secondCategorySelected"
        >
          <el-option
            v-for="item in categoryStore.secondCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="props.disabled"
          v-model="categoryStore.thirdCategoryId"
        >
          <el-option
            v-for="item in categoryStore.thirdCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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

  /** 获取父组件传来的值 */
  const props = defineProps<{
    disabled: boolean
  }>()

  /** 组件挂载后调用 */
  onMounted(() => {
    // 获取一级分类的数据
    getFirstCategoryListData()
  })

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()

  /** el-select 相关 数据&&方法 */
  // 一级 select： @change 方法
  const firstCategorySelected = () => {
    // 清空二级分类和三级分类的 id 和三级分类的数据
    categoryStore.clearSecondCategoryId()
    categoryStore.clearThirdCategoryList()
    categoryStore.clearThirdCategoryId()
    getSecondCategoryListData()
  }
  // 二级 select：@change
  const secondCategorySelected = () => {
    // 清空三级分类的 id
    categoryStore.clearThirdCategoryId()
    getThirdCategoryListData()
  }

  /** 请求数据方法 */
  // 获取一级分类菜单数据
  const getFirstCategoryListData = () => {
    categoryStore.getFirstCategoryList()
  }
  // 获取二级分类菜单数据
  const getSecondCategoryListData = () => {
    categoryStore.getSecondCategoryList()
  }
  // 获取三级分类菜单数据
  const getThirdCategoryListData = () => {
    categoryStore.getThirdCategoryList()
  }
</script>
<script lang="ts">
  export default {
    name: 'CategoryComponent',
  }
</script>

<style scoped></style>
