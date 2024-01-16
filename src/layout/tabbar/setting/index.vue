<template>
  <el-button
    type="primary"
    size="small"
    :icon="Refresh"
    circle
    @click="refreshClick"
  ></el-button>
  <el-button
    type="primary"
    size="small"
    :icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button type="primary" size="small" :icon="Setting" circle></el-button>
  <!-- 用户信息 -->
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { useRouter, useRoute } from 'vue-router'
  /** 仓库引入 */
  import useLayoutStore from '@/store/modules/layout'
  import useUserStore from '@/store/modules/user'
  /** EL组件 */
  import { ElNotification } from 'element-plus'
  import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue'
  /** 工具引入 */
  import { REMOVE_TOKEN } from '@/utils/token'

  /** 实例化 vue-router 方法 */
  let $router = useRouter()
  let $route = useRoute()

  /** 实例化仓库 */
  // layout 仓库实例
  let layoutStore = useLayoutStore()
  // user 仓库实例
  let userStore = useUserStore()

  /** 功能按钮点击事件 */
  // 全屏点击事件
  const fullScreen = () => {
    let full = document.fullscreenElement
    if (!full) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  // 当前首页数据刷新点击事件
  const refreshClick = () => {
    // 调用 layout 仓库的方法
    layoutStore.refreshRetreat()
  }
  // 退出登录点击事件
  const loginOut = async () => {
    // 1. 清空仓库的用户信息数据
    userStore.loginOut()
    // 2. 清空本地 TOKEN
    REMOVE_TOKEN()
    // 3. 跳转到 login 页面, 并携带当前页面
    await $router.replace({ path: '/login', query: { redirect: $route.path } })
    // 4. 弹框
    ElNotification({
      type: 'success',
      message: '成功登出账号',
      title: '温馨提示提示',
    })
  }
</script>
<script lang="ts">
  export default {
    name: 'Setting',
  }
</script>

<style scoped></style>
