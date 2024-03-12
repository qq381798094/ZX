<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="" />
    <div class="btn">
      <el-button @click="backToHome" type="primary">点击返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  let $router = useRouter()

  const backToHome = () => {
    $router.push('/home')
  }
</script>

<style scoped lang="scss">
  .box {
    width: 100vw;
    height: 100vh;
    display: flex;
    background: skyblue;
    justify-content: center;
    position: relative;

    > img {
      margin-left: 300px;
      width: 800px;
      height: 400px;
    }

    .btn {
      position: absolute;
      left: 45%;
      bottom: 200px;
    }
  }
</style>
