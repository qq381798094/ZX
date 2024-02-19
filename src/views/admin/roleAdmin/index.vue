<template>
  <div>
    <!-- 搜索卡片 -->
    <el-card class="card-form">
      <el-form class="form-class" inline>
        <el-form-item label="角色名称">
          <el-input
            @blur="handleSearchRoleList"
            v-model="searchValue"
            placeholder="角色名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleSearchRoleList"
            type="primary"
            :disabled="searchValue.length > 0 ? false : true"
          >
            搜索
          </el-button>
          <el-button @click="handleResetComponent" type="primary" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 展示卡片 -->
    <el-card class="card-display">
      <!-- 添加角色 -->
      <el-button @click="handleRoleInfo" :icon="Plus" type="primary">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="roleList" class="table-box" border stripe>
        <el-table-column label="#" width="100" type="index" align="center" />
        <el-table-column prop="id" label="id" width="120" align="center" />
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="220"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="220"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="220"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button @click="handlePowerDistribute(row)" :icon="User" type="primary" size="small">
              权限分配
            </el-button>
            <el-button @click="handleRoleInfo(row)" :icon="Edit" type="warning" size="small">
              编辑
            </el-button>
            <el-popconfirm
              :title="`您确定要删除${row.roleName}吗？`"
              @confirm="handleDeleteRole(row)"
              width="220"
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
        :page-sizes="[5, 10, 15, 20]"
        background
        layout="prev, pager, next, jumper,->,sizes, total"
        :total="totalData"
        @current-change="fetchRoleList"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- 【添加|更新角色】对话框 -->
    <el-dialog
      v-model="handleRoleDialogVisible"
      :title="roleInfoParams.id ? '修改角色名称' : '添加角色名称'"
    >
      <el-form ref="roleFormRef" :model="roleInfoParams" :rules="rules">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="roleInfoParams.roleName" placeholder="请填写角色名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleRoleDialogVisible = false">取消</el-button>
        <el-button @click="handleDialogConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog>
    <!-- 【分配权限】抽屉 -->
    <el-drawer v-model="powerDrawerVisible">
      <template #header>
        <h6>分配权限</h6>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
          ref="treeRef"
          :data="permissionMenuList"
          :props="permissionProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultChecked"
        />
      </template>
      <template #footer>
        <el-button @click="powerDrawerVisible = false">取消</el-button>
        <el-button @click="handlePermissionDrawerConfirm" type="primary">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted, reactive, nextTick } from 'vue'
  /** 仓库引入 */
  import useLayoutStore from '@/store/modules/layout'
  /** 接口引入 */
  import {
    requestRoleListByPageAPI,
    requestAddOrUpdateRoleInfoAPI,
    requestMenuListByIdAPI,
    requestDistributePermissionAPI,
    requestDeleteRoleByIdAPI,
  } from '@/api/acl/role'
  /** 接口类型引入 */
  import type { RoleListItem, RoleMenuListDataItem } from '@/api/acl/role/type'
  /** EL 组件引入 */
  import { Plus, User, Edit, Delete } from '@element-plus/icons-vue'
  import { ElMessage, ElTree, FormInstance, FormRules } from 'element-plus'

  /** 仓库实例化 */
  const layoutStore = useLayoutStore()

  /** 页面挂载后执行 */
  onMounted(() => {
    // 初始化数据
    try {
      fetchRoleList()
    } catch (e) {
      ElMessage.error('数据初始化失败')
    }
  })

  /** 表格数据存储相关 */
  const roleList = ref<RoleListItem[]>([])
  const roleInfoParams = reactive<RoleListItem>({
    roleName: '',
  })
  const permissionMenuList = ref<RoleMenuListDataItem[]>([]) // 权限菜单列表

  /** 搜索框相关 */
  const searchValue = ref<string>('')
  const handleSearchRoleList = () => {
    try {
      fetchRoleList()
    } catch (e) {
      ElMessage.error('获取数据失败，请重试')
    }
  }
  const handleResetComponent = () => {
    layoutStore.refreshRetreat()
  }

  /** 操作表格数据相关 */
  // 【权限分配】按钮 -> @click
  const handlePowerDistribute = async (item: RoleListItem) => {
    try {
      // 拿到数据
      const { id } = item
      permissionMenuList.value = await fetchPermissionMenuList(id!)
      Object.assign(roleInfoParams, item)
      // 设置默认勾选的数据
      defaultChecked.value = filterArray(permissionMenuList.value, [])
    } catch (e) {
      ElMessage.error('数据获取出错，请重试')
    }
    // 展示抽屉
    powerDrawerVisible.value = true
  }
  // 【新增|更新角色】按钮 -> @click
  const handleRoleInfo = (item: RoleListItem) => {
    const { id } = item
    // 清空数据 | 校验结果
    Object.assign(roleInfoParams, {
      id: undefined,
      createTime: undefined,
      updateTime: undefined,
      roleName: '',
      remark: undefined,
    })
    nextTick(() => {
      roleFormRef.value!.clearValidate()
    })
    if (id) {
      // 修改
      Object.assign(roleInfoParams, item)
    } else {
      // 新增
    }
    // 打开对话框
    handleRoleDialogVisible.value = true
  }
  // 【删除角色】按钮 -> @click
  const handleDeleteRole = async (item: RoleListItem) => {
    const { id } = item
    try {
      await deleteRoleById(id!)
      ElMessage.success('成功删除当前角色')
      fetchRoleList(roleList.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } catch (e) {
      ElMessage.error('操作请求失败，请重试')
    }
  }

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(10)
  const totalData = ref<number>(30)
  const handleSizeChange = () => {
    try {
      fetchRoleList()
    } catch (e) {
      ElMessage.error('获取数据失败，请重试')
    }
  }

  /** 【更新|添加角色】对话框相关 */
  const handleRoleDialogVisible = ref<boolean>(false)
  // 【确定】button -> @click
  const handleDialogConfirm = async () => {
    try {
      await roleFormRef.value!.validate()
      // 排除相同角色名情况
      if (roleList.value.some((item) => item.roleName === roleInfoParams.roleName)) {
        ElMessage.error('不能重复添加已有角色')
        return
      }
      // 发请求
      await changeAddOrUpdateRoleInfo(roleInfoParams)
      ElMessage.success(roleInfoParams.id ? '成功修改角色信息' : '成功新增岗位')
      await fetchRoleList(pageNo.value)
      handleRoleDialogVisible.value = false
    } catch (e) {
      ElMessage.error('操作失败，请重试')
    }
  }
  // 表单校验
  const roleFormRef = ref<FormInstance>()
  const validatorRoleName = (_rule: any, value: string, callback: any) => {
    if (value.trim().length >= 2) {
      callback()
    } else {
      callback(new Error('角色名称至少要2位'))
    }
  }
  const rules = reactive<FormRules<typeof roleInfoParams>>({
    roleName: [{ required: true, validator: validatorRoleName, trigger: 'blur' }],
  })

  /** 【分配权限】抽屉相关 */
  const powerDrawerVisible = ref<boolean>(false)
  // 确认 button -> @click
  const handlePermissionDrawerConfirm = async () => {
    const roleId = roleInfoParams.id
    // 选中节点
    let permissionIds = treeRef.value!.getCheckedKeys()
    // 半选节点【可忽略】
    // let halfCheckedNode = treeRef.value!.getHalfCheckedKeys()
    // permissionIds
    // let permissionIds = checkedNode
    try {
      await changeRoleToPermissionMenu(roleId!, permissionIds as number[])
      ElMessage.success('操作成功')
      powerDrawerVisible.value = false
      window.location.reload()
    } catch (e) {
      ElMessage.error('请求失效')
    }
  }
  // ==== tree 组件相关 ====
  const treeRef = ref<InstanceType<typeof ElTree>>()
  // 默认勾选数据
  const defaultChecked = ref<number[]>([])
  // id name 键值对
  const permissionProps = {
    children: 'children',
    label: 'name',
  }

  /** 工具方法相关 */
  // 筛选出默认已默认勾选的数据
  const filterArray = (dataList: RoleMenuListDataItem[], initData: number[]) => {
    dataList.forEach((item) => {
      if (item.select && item.level === 4) {
        initData.push(item.id)
      }
      if (item.children && item.children.length > 0) {
        filterArray(item.children, initData)
      }
    })
    return initData
  }

  /** 请求方法相关 */
  // 获取角色分页列表
  const fetchRoleList = async (pager = 1) => {
    // 修改当前页码
    pageNo.value = pager
    // 发请求
    const result = await requestRoleListByPageAPI(pageNo.value, pageSize.value, searchValue.value)
    const { code, data } = result
    if (code === 200) {
      const { records, total } = data
      totalData.value = total
      roleList.value = records
      return data
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 【角色分配】获取树形菜单
  const fetchPermissionMenuList = async (roleId: number) => {
    const result = await requestMenuListByIdAPI(roleId)
    const { code, data } = result
    if (code === 200) {
      return data
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 【角色分配】给当前角色分配权限菜单
  const changeRoleToPermissionMenu = async (roleId: number, permissionIds: number[]) => {
    const result = await requestDistributePermissionAPI(roleId, permissionIds)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 【新增|修改】角色
  const changeAddOrUpdateRoleInfo = async (data: RoleListItem) => {
    const result = await requestAddOrUpdateRoleInfoAPI(data)
    console.log(result)
  }
  // 【删除】角色
  const deleteRoleById = async (id: number) => {
    const result = await requestDeleteRoleByIdAPI(id)
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
    name: 'RoleManage',
  }
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
