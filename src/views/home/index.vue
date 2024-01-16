<template>
  <div>
    <h1>home</h1>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { onMounted } from 'vue'
  /** 仓库 */
  import useUserStore from '@/store/modules/user'
  /** EL 组件 */
  import { ElNotification } from 'element-plus'

  /** 实例化仓库 */
  // 用户仓库
  let userStore = useUserStore()

  onMounted(async () => {
    // 判断获取用户信息接口是否成功
    try {
      await userStore.getUserInfo()
      // 后面补充【请求成功】
    } catch (error) {
      ElNotification({
        type: 'error',
        message: (error as Error).message,
      })
    }
  })
</script>

<style scoped></style>
