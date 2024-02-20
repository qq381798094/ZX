<template>
  <el-button type="primary" size="small" :icon="Refresh" circle @click="refreshClick"></el-button>
  <el-button type="primary" size="small" :icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover
    :visible="popoverVisible"
    placement="bottom"
    trigger="hover"
    title="主题设置"
    :width="300"
  >
    <!-- 表单 -->
    <el-form class="theme-form" label-width="80">
      <el-form-item label="主题颜色">
        <el-color-picker @change="handleColorPicker" size="small" v-model="themeColor" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="handleTheme"
          v-model="darkModelSwitch"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="popoverVisible = false">关闭</el-button>
      </el-form-item>
    </el-form>
    <!-- 包裹的按钮 -->
    <template #reference>
      <el-button
        type="primary"
        size="small"
        :icon="Setting"
        circle
        @click="popoverVisible = true"
      ></el-button>
    </template>
  </el-popover>
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
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  /** 仓库引入 */
  import useLayoutStore from '@/store/modules/layout'
  import useUserStore from '@/store/modules/user'
  /** EL组件 */
  import { ElNotification } from 'element-plus'
  import { FullScreen, Moon, Refresh, Setting, Sunny } from '@element-plus/icons-vue'

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
    // 1. 清空仓库的用户信息数据以及本地 TOKEN
    await userStore.loginOut()
    // 2. 跳转到 login 页面, 并携带当前页面
    await $router.replace({ path: '/login', query: { redirect: $route.path } })
    // 3. 弹框
    ElNotification({
      type: 'success',
      message: '成功登出账号',
      title: '温馨提示',
    })
  }

  /** 【主题颜色】气泡弹框&&表单相关 */
  const popoverVisible = ref<boolean>(false)
  const themeColor = ref<string>('409EFF')
  const darkModelSwitch = ref<boolean>(false)
  // switch -> @change
  const handleTheme = () => {
    document.documentElement.className = darkModelSwitch.value ? 'dark' : ''
  }
  // color-picker -> @change
  const handleColorPicker = () => {
    document.documentElement.style.setProperty('--el-color-primary', themeColor.value)
  }
</script>
<script lang="ts">
  export default {
    name: 'Setting',
  }
</script>

<style scoped lang="scss">
  .theme-form {
    margin: 30px 0;
  }
</style>
