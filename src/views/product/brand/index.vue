<template>
  <el-card class="box-card">
    <!-- 顶部添加品牌按钮 -->
    <el-button type="primary" size="default" :icon="Plus">添加品牌</el-button>
    <!-- 表格：展示已有品牌数据 -->
    <el-table :data="brandList" style="margin: 20px 0" border>
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="tmName" label="品牌名称" align="center" />
      <el-table-column label="品牌 Logo" align="center">
        <template #="{ row }">
          <img class="brand-img" :src="row.logoUrl" alt="图片加载出错" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作" align="center">
        <template #="{ row, $index }">
          <el-button type="warning" :icon="Edit" size="small" />
          <el-button type="danger" :icon="Delete" size="small" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageLimit"
      :page-sizes="[3, 5, 7, 9]"
      background
      layout="prev, pager, next, jumper, -> ,sizes, total"
      :total="totalData"
    />
  </el-card>
</template>

<script setup lang="ts">
  /** EL 组件引入 */
  import { Delete, Edit, Plus } from '@element-plus/icons-vue'
  /** 接口引入 */
  import { requestGetHasBrandByPageAPI } from '@/api/product/brand'
  /** 类型引入 */
  import {
    TRecordsItem,
    IGetBrandResponseByPageData,
  } from '@/api/product/brand/type'
  /** API 引入 */
  import { ref, onMounted } from 'vue'

  /** 组件挂载后调用 */
  onMounted(() => {
    // 获得已有的品牌数据
    getHasBrandData()
  })

  /** 分页器组件数据&&方法 */
  // 当前页码
  const pageNo = ref<number>(1)
  // 每页显示数据的条数
  const pageLimit = ref<number>(3)
  // 数据总条数
  const totalData = ref<number>(0)

  /** 数据请求方法 */
  // 请求已有的品牌数据【需要 page && limit 】
  const brandList = ref<TRecordsItem[]>([]) // 存储列表数据
  const getHasBrandData = async () => {
    const result: IGetBrandResponseByPageData =
      await requestGetHasBrandByPageAPI({
        page: pageNo.value,
        limit: pageLimit.value,
      })
    if (result.code === 200) {
      // 存储数据
      brandList.value = result.data.records
      totalData.value = result.data.total
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'Brand',
  }
</script>

<style scoped lang="scss">
  // 品牌列表图片
  .brand-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
</style>
