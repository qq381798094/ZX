<template>
  <el-button type="primary" size="small" :icon="Refresh" circle></el-button>
  <el-button type="primary" size="small" :icon="FullScreen" circle></el-button>
  <el-button type="primary" size="small" :icon="Setting" circle></el-button>
  <!-- 用户信息 -->
  <img
    src="../../../../public/logo.png"
    style="width: 24px; height: 24px; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      万木春
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue'
</script>
<script lang="ts">
  export default {
    name: 'Setting',
  }
</script>

<style scoped></style>
