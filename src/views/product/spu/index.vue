<template>
  <div>
    <!-- 三级分类结构 -->
    <CategoryCard :disabled="changeSpuScene" />
    <!-- 搜索结果展示平台卡片 -->
    <el-card class="card-box">
      <!-- 添加 SPU 按钮 -->
      <el-button
        type="primary"
        :icon="Plus"
        :disabled="categoryStore.thirdCategoryId ? false : true"
      >
        添加 SPU
      </el-button>
      <!-- 表格结构 -->
      <el-table :data="spuList" class="table-box" border>
        <el-table-column label="序号" width="100" type="index" align="center" />
        <el-table-column
          show-overflow-tooltip
          label="SPU 名称"
          prop="spuName"
          width="200"
          align="center"
        />
        <el-table-column
          label="SPU 描述"
          show-overflow-tooltip
          prop="description"
        />
        <el-table-column label="操作" width="220" align="center">
          <template #="{ row, $index }">
            <el-button
              size="small"
              type="primary"
              :icon="Plus"
              title="添加 SPU"
            />
            <el-button
              size="small"
              type="warning"
              :icon="Edit"
              title="修改 SPU"
            />
            <el-button
              size="small"
              type="info"
              :icon="InfoFilled"
              title="查看 SPU 列表"
            />
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              title="删除当前 SPU"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="fetchSpuListDataByPage"
        :page-sizes="[3, 5, 7, 9]"
        background
        layout="prev, pager, next, jumper, -> ,sizes, total"
        :total="totalData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { ref, watch } from 'vue'
  /** EL 组件引入 */
  import { Plus, Edit, InfoFilled, Delete } from '@element-plus/icons-vue'
  /** 接口引入 */
  import { requestSpuDataByPage } from '@/api/product/spu'
  /** 接口类型约束引入 */
  import type {
    TGetSpuResponseData,
    IRecordsItem,
  } from '@/api/product/spu/type'
  /** 仓库引入 */
  import useCategoryStore from '@/store/modules/category'

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()

  /** 该 watch 监听仓库中的 category3Id */
  watch(
    () => categoryStore.thirdCategoryId,
    () => {
      // 清空数组
      spuList.value = []
      // 若 category3Id 没有值，则直接返回
      if (!categoryStore.thirdCategoryId) return
      // 有值则触发请求
      fetchSpuListDataByPage()
    },
  )

  /** 场景切换变量聚集地 */
  // 控制添加 || 展示 SPU 页面平台的切换 -> false ： 展示 SPU 数据页面 || true ： 添加或修改 SPU 数据页面
  const changeSpuScene = ref<boolean>()

  /**======展示 SPU 数据的页面平台====== */
  /* 分页器组件部分 数据 && 方法 */
  const pageNo = ref<number>(1) // 分页器默认页码
  const pageSize = ref<number>(3) // 每页展示多少张数据
  const totalData = ref<number>(50) // 数据总量
  // @size-change -> pageSize 改变时触发
  const handleSizeChange = () => {
    fetchSpuListDataByPage()
  }

  /**======添加 SPU 数据的页面平台====== */

  /**======数据请求方法合集====== */
  // 获取 SPU 的数据
  const spuList = ref<IRecordsItem[]>([])
  const fetchSpuListDataByPage = async (pager = 1) => {
    // 给页面赋默认值
    pageNo.value = pager
    const result: TGetSpuResponseData = await requestSpuDataByPage(
      pageNo.value,
      pageSize.value,
      categoryStore.thirdCategoryId,
    )
    if (result.code === 200) {
      spuList.value = result.data.records
      totalData.value = result.data.total
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'SPU',
  }
</script>

<style scoped lang="scss">
  // 卡片样式
  .card-box {
    margin: 20px 0;
  }
  // 表格样式
  .table-box {
    margin: 20px 0;
  }
</style>
