<template>
  <div>
    <el-table :data="menuList" row-key="id" border>
      <el-table-column label="名称" prop="name" />
      <el-table-column label="权限值" prop="code" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            @click="handleAddMenu(row)"
            type="primary"
            size="small"
            :disabled="row.level === 4 ? true : false"
          >
            {{ row.level >= 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            @click="handleUpdateMenu(row)"
            type="warning"
            size="small"
            :disabled="row.level === 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm
            width="220"
            :title="`你确定要删除${row.name}吗？`"
            @confirm="handleDeleteMenuItem(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" :disabled="row.level === 1 ? true : false">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 【添加|编辑 菜单】对话框 -->
    <el-dialog
      v-model="handleMenuDialogVisible"
      :title="menuParams.id ? '更新菜单' : '添加菜单'"
      width="35%"
    >
      <!-- 表单 -->
      <el-form label-width="60">
        <el-form-item label="名称">
          <el-input v-model="menuParams.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="权限值">
          <el-input v-model="menuParams.code" placeholder="请输入权限值" />
        </el-form-item>
      </el-form>
      <!-- 底部操作按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleMenuDialogVisible = false">取消</el-button>
          <el-button @click="MenuDialogConfirm" type="primary">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted, reactive } from 'vue'
  /** 接口引入 */
  import {
    requestGetMenuListAPI,
    requestAddOrUpdateMenuAPI,
    requestDeleteMenuItemByIdAPI,
  } from '@/api/acl/menu'
  /** 接口类型引入 */
  import type { MenuListDataItem, MenuOptionParams } from '@/api/acl/menu/type'
  /** EL 组件引入 */
  import { ElMessage } from 'element-plus'

  /** 数据存储相关 */
  const menuList = ref<MenuListDataItem[]>([]) // 存储菜单列表
  // 菜单操作参数
  const menuParams = reactive<MenuOptionParams>({
    code: '',
    level: undefined,
    name: '',
    pid: undefined,
    id: undefined,
  })

  /** 组件挂载后执行 */
  onMounted(async () => {
    try {
      await fetchMenuList()
    } catch (e) {
      ElMessage.error('初始化数据失败')
    }
  })

  /** 表格操作按钮相关 */
  // 【添加菜单】按钮 -> @click
  const handleAddMenu = (item: MenuListDataItem) => {
    const { level, id } = item
    // 初始化收集参数对象
    Object.assign(menuParams, {
      code: '',
      level: level + 1,
      name: '',
      pid: id!,
      id: undefined,
    })
    // 打开对应对话框
    handleMenuDialogVisible.value = true
  }
  // 【编辑菜单】按钮 -> @click
  const handleUpdateMenu = (item: MenuListDataItem) => {
    const { code, level, name, id, pid } = item
    // 初始化收集参数对象
    Object.assign(menuParams, {
      code,
      level: level + 1,
      name,
      pid,
      id,
    })
    // 打开对应对话框
    handleMenuDialogVisible.value = true
  }
  // 【删除菜单】按钮 -> @click
  const handleDeleteMenuItem = async (item: MenuListDataItem) => {
    try {
      await deleteMenuItemById(item.id!)
      ElMessage.success('成功删除当前菜单')
      await fetchMenuList()
    } catch (e) {
      ElMessage.error('操作有误，请重试')
    }
  }

  /** 【添加|编辑 菜单】对话框相关 */
  const handleMenuDialogVisible = ref<boolean>(false)
  // 确定按钮 -> @click
  const MenuDialogConfirm = async () => {
    // 非法通过拦截
    if (menuParams.name === '' || menuParams.code === '') {
      ElMessage.error('不可提交空字符串')
      return
    }
    // 接口请求
    try {
      await changeMenuListData(menuParams)
      ElMessage.success(menuParams.id ? '修改成功' : '添加成功')
      await fetchMenuList()
      handleMenuDialogVisible.value = false
    } catch (e) {
      ElMessage.success('操作失败，请重试')
    }
  }

  /** 数据请求相关 */
  // 获取菜单列表数据
  const fetchMenuList = async () => {
    const result = await requestGetMenuListAPI()
    const { code, data } = result
    if (code === 200) {
      menuList.value = data
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 新增或编辑菜单数据
  const changeMenuListData = async (data: MenuOptionParams) => {
    const result = await requestAddOrUpdateMenuAPI(data)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 删除菜单数据
  const deleteMenuItemById = async (id: number) => {
    const result = await requestDeleteMenuItemByIdAPI(id)
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
    name: 'MenuManage',
  }
</script>

<style scoped lang="scss"></style>
