<template>
  <el-card class="card-box">
    <el-table :data="skuList" class="table-box" border>
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="80" />
      <!-- 名称 -->
      <el-table-column label="名称" prop="skuName" width="160" show-overflow-tooltip />
      <!-- 描述 -->
      <el-table-column label="描述" prop="skuDesc" width="200" show-overflow-tooltip />
      <!-- 默认图片 -->
      <el-table-column label="默认图片" width="200" align="center">
        <template #default="{ row }">
          <img class="default-img" :src="row.skuDefaultImg" />
        </template>
      </el-table-column>
      <!-- 重量 -->
      <el-table-column label="重量" prop="weight" width="120" align="center" />
      <!-- 价格 -->
      <el-table-column label="价格" prop="price" width="120" align="center" />
      <!-- 操作 -->
      <el-table-column label="操作" align="center" fixed="right">
        <template #default>
          <el-button :icon="Bottom" type="info" size="small" />
          <el-button :icon="Edit" type="primary" size="small" />
          <el-button :icon="InfoFilled" type="info" size="small" />
          <el-button :icon="Delete" type="danger" size="small" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="totalData"
      @current-change="fetchSkuListData"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** 接口引入 */
  import { requestSkuDataByPageAPI } from '@/api/product/sku'
  /** 接口类型引入 */
  import { SkuListResponseData, SkuListDataRecordsItem } from '@/api/product/sku/type'
  /** EL 组件相关引入 */
  import { ElMessage } from 'element-plus'
  import { Bottom, Edit, InfoFilled, Delete } from '@element-plus/icons-vue'

  /** 组件初次挂载完毕执行 */
  onMounted(async () => {
    try {
      // 获取数据
      await fetchSkuListData()
    } catch (e) {
      ElMessage.error('数据初始化失败')
    }
  })

  /**  SKU 列表数据相关 */
  const skuList = ref<SkuListDataRecordsItem[]>([])

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(10)
  const totalData = ref<number>(100)
  const handleSizeChange = () => {
    fetchSkuListData()
  }

  /** 数据请求相关 */
  // 获取 SKU 列表数据
  const fetchSkuListData = async (pager = 1) => {
    pageNo.value = pager
    const result: SkuListResponseData = await requestSkuDataByPageAPI(pageNo.value, pageSize.value)
    if (result.code === 200) {
      const { records, total } = result.data
      // 存储数据
      skuList.value = records
      totalData.value = total
      return result.data
    } else {
      return Promise.reject(new Error('数据请求失败'))
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'SKU',
  }
</script>

<style scoped lang="scss">
  .card-box {
    // width: 100%;
  }
  .table-box {
    width: 100%;
    margin-bottom: 20px;
  }
  .default-img {
    width: 100px;
    height: 100px;
  }
</style>
