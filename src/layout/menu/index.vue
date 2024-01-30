<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由的情况 -->
    <template v-if="!item.children && !(item.meta as RouteMeta).hidden">
      <el-menu-item :index="item.path">
        <el-icon>
          <component :is="(item.meta as RouteMeta).icon" />
        </el-icon>
        <template #title>
          <span>{{ (item.meta as RouteMeta).title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且只有一个子路由的情况 -->
    <template
      v-if="
        item.children && item.children?.length === 1 && !(item.children[0].meta as RouteMeta).hidden
      "
    >
      <el-menu-item :index="item.children[0].path">
        <el-icon>
          <component :is="(item.children[0].meta as RouteMeta).icon" />
        </el-icon>
        <template #title>
          <span>{{ (item.children[0].meta as RouteMeta).title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且有两个以上子路由的情况 -->
    <template v-if="item.children && item.children.length > 1">
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon>
            <component :is="(item.meta as RouteMeta).icon" />
          </el-icon>
          <span>{{ (item.meta as RouteMeta).title }}</span>
        </template>
        <Menu :menuList="item.children" />
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
  /** 引入 类型约束 */
  import { RouteMeta, RouteRecordRaw } from 'vue-router'
  /** 获取父组件传递过来的值 */
  defineProps<{
    menuList: RouteRecordRaw[]
  }>()
</script>
<script lang="ts">
  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Menu',
  }
</script>

<style scoped></style>
