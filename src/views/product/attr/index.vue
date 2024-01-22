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
      <el-table :data="attributeList" border stripe class="table-box">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="100px"
        />
        <el-table-column
          label="属性名称"
          align="center"
          prop="attrName"
          width="140px"
        />
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <!-- 属性值 -->
            <el-tag
              class="tag-box"
              v-for="tag in row.attrValueList"
              :key="tag.id"
            >
              {{ tag.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template #="{ row }">
            <!-- 编辑 -->
            <el-button type="warning" :icon="Edit" size="small" />
            <!-- 删除 -->
            <el-button type="danger" :icon="Delete" size="small" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { ref, watch } from 'vue'
  /** EL 组件引入 */
  import { Plus, Edit, Delete } from '@element-plus/icons-vue'
  /** 接口引入 */
  import { requestGetAttrInfoByCategoryIdData } from '@/api/product/attr'
  /** 接口类型引入 */
  import type {
    TAttrResponseData,
    IAttrResponseDataItem,
  } from '@/api/product/attr/type'
  /** 仓库引入 */
  import useCategoryStore from '@/store/modules/category'

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()

  /** 该 watch 监听仓库中的 category3Id */
  watch(
    () => categoryStore.thirdCategoryId,
    () => {
      // 清空表格数组
      attributeList.value = []
      // 3Id 没有值，不做事
      if (!categoryStore.thirdCategoryId) return
      // 有值触发数据请求
      fetchAttributeListData()
    },
  )

  /** 数据请求方法合集 */
  // 获取属性和属性值的数据
  const attributeList = ref<IAttrResponseDataItem[]>([])
  const fetchAttributeListData = async () => {
    // 拿到 3 个 id
    const { firstCategoryId, secondCategoryId, thirdCategoryId } = categoryStore
    const result: TAttrResponseData = await requestGetAttrInfoByCategoryIdData(
      firstCategoryId as number,
      secondCategoryId as number,
      thirdCategoryId as number,
    )
    if (result.code === 200) {
      attributeList.value = result.data
    }
  }
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
  // 表格
  .table-box {
    margin-top: 20px;
  }
  // 标签
  .tag-box {
    margin: 0 5px;
  }
</style>
