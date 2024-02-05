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
    <el-table :data="userList" class="table-box" border>
      <el-table-column type="selection" width="70" align="center" />
      <el-table-column label="#" type="index" width="80" align="center" />
      <el-table-column label="id" prop="id" width="80" align="center" />
      <el-table-column
        label="用户名字"
        prop="name"
        width="110"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="用户名称"
        prop="username"
        width="110"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip />
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="110"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        width="110"
        align="center"
        show-overflow-tooltip
      />
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
      :page-sizes="[3, 5, 7, 9]"
      background
      layout="prev, pager, next, jumper,->,sizes, total"
      :total="totalData"
      @current-change="fetchUserList"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** 接口引入 */
  import { requestUserListByPageAPI } from '@/api/acl/user'
  /** 接口类型引入 */
  import type { UserListItem } from '@/api/acl/user/type'
  /** EL 组件引入 */
  import { User, Edit, Delete } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'

  /** 组件挂载成功后触发 */
  onMounted(() => {
    try {
      fetchUserList()
    } catch (e) {
      ElMessage.error('数据获取失败')
    }
  })

  /** 用户管理数据存储相关 */
  const userList = ref<UserListItem[]>([])

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(5)
  const totalData = ref<number>(20)
  const handleSizeChange = () => {
    fetchUserList()
  }

  /** 数据请求相关 */
  // 获取用户列表数据
  const fetchUserList = async (pager = 1) => {
    // 收集当前页码
    pageNo.value = pager
    // 发送请求
    const result = await requestUserListByPageAPI(pageNo.value, pageSize.value)
    const { code, data } = result
    if (code === 200) {
      const { total, records } = data
      userList.value = records
      totalData.value = total
      return data
    } else {
      return Promise.reject(new Error('数据获取失败'))
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'UserManage',
  }
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
