<template>
  <!-- form 卡片 -->
  <el-card class="form-card">
    <el-form class="form-box" inline>
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 列表展示 卡片 -->
  <el-card class="show-card">
    <el-button type="primary">添加</el-button>
    <el-button type="danger">批量删除</el-button>
    <!-- 表格 -->
    <el-table class="table-box" border>
      <el-table-column type="selection" width="70" align="center" />
      <el-table-column label="#" width="80" align="center" />
      <el-table-column label="id" width="80" align="center" />
      <el-table-column label="用户名字" width="110" align="center" />
      <el-table-column label="用户名称" width="110" align="center" />
      <el-table-column label="用户角色" />
      <el-table-column label="创建时间" width="110" align="center" />
      <el-table-column label="更新时间" width="110" align="center" />
      <el-table-column label="操作" width="270" align="center">
        <template #default>
          <el-button :icon="User" type="primary" size="small">分配角色</el-button>
          <el-button :icon="Edit" type="warning" size="small">编辑</el-button>
          <el-button :icon="Delete" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      background
      layout="prev, pager, next, jumper,->,sizes, total"
      :total="totalData"
    />
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { ref } from 'vue'
  /** EL 组件引入 */
  import { User, Edit, Delete } from '@element-plus/icons-vue'

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(5)
  const totalData = ref<number>(20)
</script>

<style scoped lang="scss">
  .form-card {
    height: 75px;
    margin-bottom: 25px;
  }
  .form-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .show-card {
    padding: 5px 10px;
  }

  .table-box {
    margin: 15px 0;
  }
</style>
