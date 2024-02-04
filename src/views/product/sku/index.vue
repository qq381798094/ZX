<template>
  <el-card class="card-box">
    <el-table class="table-box" border>
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="80" />
      <!-- 名称 -->
      <el-table-column label="名称" width="160" show-overflow-tooltip />
      <!-- 描述 -->
      <el-table-column label="描述" width="200" show-overflow-tooltip />
      <!-- 默认图片 -->
      <el-table-column label="默认图片" width="200" align="center" />
      <!-- 重量 -->
      <el-table-column label="重量" width="120" align="center" />
      <!-- 价格 -->
      <el-table-column label="价格" width="120" align="center" />
      <!-- 操作 -->
      <el-table-column label="操作" align="center" fixed="right" />
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { ref } from 'vue'

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(10)
</script>

<style scoped lang="scss">
  .card-box {
    // width: 100%;
  }
  .table-box {
    width: 100%;
    margin-bottom: 20px;
  }
</style>
