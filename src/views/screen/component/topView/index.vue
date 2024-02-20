<template>
  <div class="top-container">
    <!-- 左侧 -->
    <div class="left">
      <span class="l-btn" @click="handleToHome">首页</span>
    </div>
    <!-- 中间 -->
    <div class="center">
      <div class="c-box">智慧旅游可视化大数据平台</div>
    </div>
    <!-- 右侧 -->
    <div class="right">
      <span class="r-btn">统计报告</span>
      <span class="cur-time">当前时间：{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  /** 时间插件 */
  import moment from 'moment'

  // 定时器变量
  let timer = ref(0)

  onMounted(() => {
    timer.value = setInterval(() => {
      currentTime.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer.value)
  })

  /** 路由实例化 */
  const $router = useRouter()

  // 获得当前时间
  const currentTime = ref<string>(moment().format('YYYY年MM月DD日 hh:mm:ss'))

  // 【首页】 ->  @click
  const handleToHome = () => {
    $router.push('/home')
  }
</script>
<script lang="ts">
  export default {
    name: 'ScreenTopView',
  }
</script>

<style scoped lang="scss">
  .top-container {
    width: 100%;
    height: 40px;
    display: flex;

    .left {
      flex: 1;
      background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
      background-size: cover;
      position: relative;

      .l-btn {
        width: 150px;
        height: 40px;
        background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
        background-size: 100% 100%;
        font-size: 20px;
        text-align: center;
        line-height: 40px;
        color: #29fcff;
        position: absolute;
        right: 0;
        cursor: pointer;
      }
    }

    .center {
      flex: 2;

      .c-box {
        width: 100%;
        height: 74px;
        background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 74px;
        color: #29fcff;
        font-size: 30px;
      }
    }

    .right {
      flex: 1;
      background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
      background-size: 100% 100%;
      position: relative;

      .r-btn {
        width: 150px;
        height: 40px;
        background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        font-size: 20px;
        line-height: 40px;
        text-align: center;
        color: #29fcff;
      }

      .cur-time {
        color: #29fcff;
        position: absolute;
        top: 25%;
        right: 30px;
        font-size: 16px;
      }
    }
  }
</style>
