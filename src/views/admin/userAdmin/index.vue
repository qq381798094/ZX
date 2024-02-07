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
      <el-button
        @click="handleDelUsersData"
        type="danger"
        :disabled="delUserList.length > 0 ? false : true"
      >
        批量删除
      </el-button>
      <!-- 表格 -->
      <el-table :data="userList" class="table-box" border @selection-change="handleSelectionChange">
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
            <el-button @click="handleDistributeJob(row)" :icon="User" type="primary" size="small">
              分配角色
            </el-button>
            <el-button @click="handleEditUserInfo(row)" :icon="Edit" type="warning" size="small">
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除用户${row.username}吗？`"
              width="260px"
              @confirm="handleDeleteUser(row)"
            >
              <template #reference>
                <el-button :icon="Delete" type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
    <!-- 分配用户岗位抽屉 -->
    <el-drawer v-model="distributeJobDrawer">
      <template #header>
        <h4>分配角色用户 (职位)</h4>
      </template>
      <template #default>
        <el-form label-width="80">
          <el-form-item label="用户姓名">
            <el-input v-model="userInfoParams.name" disabled />
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="distributeCheckAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group v-model="hasJobList" @change="handleCheckedJobsChange">
              <el-checkbox v-for="job in allJobList" :key="job.id" :label="job">
                {{ job.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="drawerCancel">取消</el-button>
        <el-button @click="jobDrawerConfirm" type="primary">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, reactive, onMounted, nextTick, computed } from 'vue'
  /** 接口引入 */
  import {
    requestUserListByPageAPI,
    requestAddOrUpdateUserAPI,
    requestJobsByUserAPI,
    requestAssignJobByUserAPI,
    requestDelUserByIdAPI,
    requestDelUsersByIdListAPI,
  } from '@/api/acl/user'
  /** 接口类型引入 */
  import type { UserListItem, RoleItem, AssignJobsParams } from '@/api/acl/user/type'
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
  const delUserList = ref<UserListItem[]>([])

  /** 表格相关 */
  // 当选择项发生变化时会触发该事件
  const handleSelectionChange = (val: UserListItem[]) => {
    delUserList.value = val
  }

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
  // 【批量删除】 @click
  const handleDelUsersData = async () => {
    let delParams: number[] = delUserList.value.map((item) => item.id!)
    // 获取请求数据
    try {
      await deleteUsers(delParams)
      ElMessage.success('操作成功')
      await fetchUserList(userList.value.length > 0 ? pageNo.value : pageNo.value - 1)
    } catch (e) {
      ElMessage.error('操作取消或发生异常')
    }
  }

  /** 【表格内】操作表格数据相关 */
  // 【分配角色】 @click
  const handleDistributeJob = async (item: UserListItem) => {
    // 开抽屉
    distributeJobDrawer.value = true
    Object.assign(userInfoParams, item)
    // 获取职业数据
    try {
      const { assignRoles, allRolesList } = await fetchJobList(item.id!)
      allJobList.value = allRolesList
      hasJobList.value = assignRoles
    } catch (e) {
      ElMessage.error('获取数据失败')
    }
  }
  // 【编辑|更新】 @click
  const handleEditUserInfo = (item: UserListItem) => {
    // 开抽屉、存原有数据参数、清表单验证
    nextTick(() => {
      drawerFormRef.value!.clearValidate()
    })
    userFormDrawer.value = true
    Object.assign(userInfoParams, item)
  }
  // 【删除】 @click
  const handleDeleteUser = async (item: UserListItem) => {
    const { id } = item
    try {
      await deleteUser(id!)
      ElMessage.success('操作成功')
      fetchUserList(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } catch (e) {
      ElMessage.error('操作失败')
    }
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
  const distributeJobDrawer = ref<boolean>(false)

  /** 角色分配抽屉相关 */
  const allJobList = ref<RoleItem[]>([])
  const hasJobList = ref<RoleItem[]>([])
  const distributeCheckAll = ref<boolean>(false)
  const isIndeterminate = computed(() => {
    if (hasJobList.value.length > 0 && hasJobList.value.length < allJobList.value.length) {
      return true
    } else {
      return false
    }
  })
  // checkbox all-check -> @change
  const handleCheckAllChange = (val: boolean) => {
    hasJobList.value = val ? allJobList.value : []
  }
  // checkbox-group -> @change
  const handleCheckedJobsChange = (values: RoleItem[]) => {
    distributeCheckAll.value = values.length === allJobList.value.length
  }
  // 抽屉确定 button -> @click
  const jobDrawerConfirm = async () => {
    // 整理已选择的岗位参数
    let params: AssignJobsParams = {
      userId: userInfoParams.id!,
      roleIdList: hasJobList.value.map((item) => item.id) as number[],
    }
    // 发请求
    try {
      await assignJobsByUser(params)
      ElMessage.success('操作成功')
      await fetchUserList(pageNo.value)
      distributeJobDrawer.value = false
    } catch (e) {
      ElMessage.error('修改失败，请重试')
    }
  }

  /** 表单抽屉【内部】相关 */
  const drawerFormRef = ref<FormInstance>()
  // 表单校验相关
  const validateUserName = (_rule: any, value: string, callback: any) => {
    // 长度至少 5 位
    if (value.trim().length >= 5) {
      callback()
    } else {
      callback(new Error('用户名至少5位'))
    }
  }
  const validateName = (_rule: any, value: string, callback: any) => {
    // 长度至少5位
    if (value.trim().length >= 5) {
      callback()
    } else {
      callback(new Error('昵称长度至少要5位'))
    }
  }
  const validatePassword = (_rule: any, value: string, callback: any) => {
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
  // 表单操作相关
  const drawerCancel = () => {
    userFormDrawer.value = false
    distributeJobDrawer.value = false
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
      window.location.reload()
    } catch (e) {
      ElMessage.error('操作失败，请检查数据是否符合标准')
    }
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
  // 获取当前用户的岗位数据
  const fetchJobList = async (adminId: number) => {
    const result = await requestJobsByUserAPI(adminId)
    const { code, data } = result
    if (code === 200) {
      return data
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 添加 | 更新用户信息
  const addOrUpdateUserInfo = async (data: UserListItem) => {
    const result = await requestAddOrUpdateUserAPI(data)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 添加 | 更新用户的岗位信息
  const assignJobsByUser = async (data: AssignJobsParams) => {
    const result = await requestAssignJobByUserAPI(data)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 删除用户【一个】
  const deleteUser = async (id: number) => {
    const result = await requestDelUserByIdAPI(id)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 删除用户【多个】
  const deleteUsers = async (idList: number[]) => {
    const result = await requestDelUsersByIdListAPI(idList)
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
