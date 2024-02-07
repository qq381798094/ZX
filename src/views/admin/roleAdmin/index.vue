<template>
  <div>
    <!-- 搜索卡片 -->
    <el-card class="card-form">
      <el-form class="form-class" inline>
        <el-form-item label="角色名称">
          <el-input placeholder="角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button type="primary" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 展示卡片 -->
    <el-card class="card-display">
      <!-- 添加角色 -->
      <el-button :icon="Plus" type="primary">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="[{}, {}, {}]" class="table-box" border stripe>
        <el-table-column label="#" width="100" type="index" align="center" />
        <el-table-column label="id" width="120" align="center" />
        <el-table-column label="角色名称" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="创建时间" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="更新时间" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center">
          <template #default>
            <el-button :icon="User" type="primary" size="small">权限分配</el-button>
            <el-button :icon="Edit" type="warning" size="small">编辑</el-button>
            <el-button :icon="Delete" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        background
        layout="prev, pager, next, jumper,->,sizes, total"
        :total="totalData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref } from 'vue'
  /** EL 组件引入 */
  import { Plus, User, Edit, Delete } from '@element-plus/icons-vue'

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(10)
  const totalData = ref<number>(30)
</script>

<style scoped lang="scss">
  .card-form {
    height: 75px;
    margin-bottom: 25px;
  }
  .card-display {
    padding: 5px 10px;
  }
  .form-class {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .table-box {
    margin: 15px 0;
  }
</style>
