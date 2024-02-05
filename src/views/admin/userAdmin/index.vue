<template>
  <div>
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
      <el-button @click="handleAddUserData" type="primary">添加</el-button>
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
          <template #default="{ row }">
            <el-button :icon="User" type="primary" size="small">分配角色</el-button>
            <el-button @click="handleEditUserInfo(row)" :icon="Edit" type="warning" size="small">
              编辑
            </el-button>
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
    <!-- 新增用户抽屉 -->
    <el-drawer v-model="userFormDrawer">
      <template #header>
        <h4>{{ userInfoParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form ref="drawerFormRef" :model="userInfoParams" :rules="rules">
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="userInfoParams.username" placeholder="请您输入用户姓名" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model="userInfoParams.name" placeholder="请您输入用户昵称" />
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userInfoParams.id">
            <el-input
              v-model="userInfoParams.password"
              placeholder="请您输入用户密码"
              type="password"
              show-password
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="drawerCancel">取消</el-button>
        <el-button @click="drawerConfirm" type="primary">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, reactive, onMounted, nextTick } from 'vue'
  /** 接口引入 */
  import { requestUserListByPageAPI, requestAddOrUpdateUserAPI } from '@/api/acl/user'
  /** 接口类型引入 */
  import type { UserListItem } from '@/api/acl/user/type'
  /** EL 组件引入 */
  import { User, Edit, Delete } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormRules, FormInstance } from 'element-plus'

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
  const userInfoParams = reactive<UserListItem>({
    name: '',
    password: '',
    username: '',
  })

  /** 【表格外】操作表格数据相关 */
  // 添加用户按钮 @click
  const handleAddUserData = () => {
    // 清空参数、表单验证消息、打开抽屉
    Object.assign(userInfoParams, {
      id: undefined,
      name: '',
      password: '',
      username: '',
    })
    userFormDrawer.value = true
    nextTick(() => {
      drawerFormRef.value!.clearValidate()
    })
  }

  /** 【表格内】操作表格数据相关 */
  // 【编辑】 @click
  const handleEditUserInfo = (item: UserListItem) => {
    // 开抽屉、存原有数据参数、清表单验证
    nextTick(() => {
      drawerFormRef.value!.clearValidate()
    })
    userFormDrawer.value = true
    Object.assign(userInfoParams, item)
  }

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(5)
  const totalData = ref<number>(20)
  const handleSizeChange = () => {
    fetchUserList()
  }

  /** 抽屉相关 */
  const userFormDrawer = ref<boolean>(false)
  const drawerCancel = () => {
    userFormDrawer.value = false
  }
  const drawerConfirm = async () => {
    try {
      // 检验是否通过表单校验
      await drawerFormRef.value!.validate()
      // 发送请求
      await addOrUpdateUserInfo(userInfoParams)
      ElMessage.success(userInfoParams.id ? '修改成功' : '成功创建')
      // 关掉抽屉
      userFormDrawer.value = false
      // 重新加载数据
      await fetchUserList(userInfoParams.id ? pageNo.value : 1)
    } catch (e) {
      ElMessage.error('操作失败，请检查数据是否符合标准')
    }
  }

  /** 抽屉【内部】表单相关 */
  const drawerFormRef = ref<FormInstance>()
  // 表单校验相关
  const validateUserName = (rule: any, value: string, callback: any) => {
    // 长度至少 5 位
    if (value.trim().length >= 5) {
      callback()
    } else {
      callback(new Error('用户名至少5位'))
    }
  }
  const validateName = (rule: any, value: string, callback: any) => {
    // 长度至少5位
    if (value.trim().length >= 5) {
      callback()
    } else {
      callback(new Error('昵称长度至少要5位'))
    }
  }
  const validatePassword = (rule: any, value: string, callback: any) => {
    if (value.trim().length >= 6) {
      callback()
    } else {
      callback(new Error('密码长度至少要6位'))
    }
  }
  const rules = reactive<FormRules<typeof userInfoParams>>({
    username: [{ validator: validateUserName, trigger: 'blur', required: true }],
    name: [{ validator: validateName, trigger: 'blur', required: true }],
    password: [{ validator: validatePassword, trigger: 'blur', required: true }],
  })

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
  const addOrUpdateUserInfo = async (data: UserListItem) => {
    const result = await requestAddOrUpdateUserAPI(data)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
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

/** 还有些细活，今天没精力了。明天继续 */
