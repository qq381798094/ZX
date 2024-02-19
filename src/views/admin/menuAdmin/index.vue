<template>
  <div>
    <el-table :data="menuList" row-key="id" border>
      <el-table-column label="名称" prop="name" />
      <el-table-column label="权限值" prop="code" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" :disabled="row.level === 4 ? true : false">
            {{ row.level >= 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button type="warning" size="small" :disabled="row.level === 1 ? true : false">
            编辑
          </el-button>
          <el-button type="danger" size="small" :disabled="row.level === 1 ? true : false">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** 接口引入 */
  import { requestGetMenuList } from '@/api/acl/menu'
  /** 接口类型引入 */
  import type { MenuListDataItem } from '@/api/acl/menu/type'
  /** EL 组件引入 */
  import { ElMessage } from 'element-plus'

  /** 数据存储相关 */
  const menuList = ref<MenuListDataItem[]>([]) // 存储菜单列表

  /** 组件挂载后执行 */
  onMounted(async () => {
    try {
      menuList.value = await fetchMenuList()
    } catch (e) {
      ElMessage.error('初始化数据失败')
    }
  })

  /** 数据请求相关 */
  // 获取菜单列表数据
  const fetchMenuList = async () => {
    const result = await requestGetMenuList()
    const { code, data } = result
    if (code === 200) {
      return data
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
