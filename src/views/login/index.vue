<template>
  <div class="login-container">
    <el-row>
      <el-col :span="14" :xs="0"></el-col>
      <el-col :span="10" :xs="24">
        <el-form class="login-form">
          <h1>Hello</h1>
          <h2>欢迎来到甄选</h2>
          <el-form-item>
            <el-input :prefix-icon="User" v-model="loginForm.username" />
          </el-form-item>
          <el-form-item>
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" size="default">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { reactive } from 'vue'
  /** 组件引入 */
  import { User, Lock } from '@element-plus/icons-vue'

  /** 收集账号与密码的数据 */
  let loginForm = reactive({
    username: '',
    password: '',
  })
</script>

<style scoped lang="scss">
  .login-container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login-form {
      width: 80%;
      top: 30vh;
      position: relative;
      background: url('@/assets/images/login_form.png') no-repeat;
      background-size: cover;
      padding: 40px;

      h1 {
        color: #fff;
        font-size: 40px;
      }

      h2 {
        color: #fff;
        font-size: 20px;
        margin: 20px 0;
      }

      .login-btn {
        width: 100%;
      }
    }
  }
</style>
