<template>
  <div>
    <el-card>
      <div class="box">
        <img class="avatar-img" :src="userStore.avatar" alt="" />
        <div class="user-info">
          <span class="user-name">{{ getTime() + '好，' + userStore.username }}</span>
          <span class="user-location">甄选运营平台</span>
        </div>
      </div>
    </el-card>
    <!-- SVG 图片 -->
    <div class="welcome-box">
      <svg-icon name="welcome" width="500px" height="300px" />
    </div>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { onMounted } from 'vue'
  /** 仓库 */
  import useUserStore from '@/store/modules/user'
  /** EL 组件 */
  import { ElNotification } from 'element-plus'
  /** 工具引入 */
  import { getTime } from '@/utils/time'

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
<script lang="ts">
  export default {
    name: 'Home',
  }
</script>

<style scoped lang="scss">
  .box {
    display: flex;
  }
  .avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .user-info {
    margin: 15px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .user-name {
      font-size: 22px;
      font-weight: bold;
    }

    .user-location {
      font-size: 15px;
      font-style: italic;
    }
  }
  .welcome-box {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
