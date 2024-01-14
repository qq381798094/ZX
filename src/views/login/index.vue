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
            <el-button
              :disabled="loading"
              :loading="loading"
              class="login-btn"
              @click="loginClick"
              type="primary"
              size="default"
            >
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
  import { reactive, ref } from 'vue'
  /** 仓库引入 */
  import useUserStore from '@/store/modules/user'
  /** 路由引入 */
  import { useRouter } from 'vue-router'
  /** 组件引入 */
  import { ElNotification } from 'element-plus'
  import { User, Lock } from '@element-plus/icons-vue'

  // 路由实例化
  const $router = useRouter()

  // 仓库实例化
  let userSotre = useUserStore()

  /** 收集账号与密码的数据 */
  let loginForm = reactive({
    username: '',
    password: '',
  })

  // 控制登录按钮的加载动画
  const loading = ref(false)
  /** 登录按钮点击事件 */
  const loginClick = async () => {
    // 开启登录按钮的加载动画
    loading.value = true
    // 1. 通知仓库发送登录请求
    // 2. 成功 -> 跳转到首页
    // 3. 失败 -> 弹出相应错误信息
    try {
      await userSotre.loginStatus(loginForm)
      $router.push('/')
      ElNotification({
        type: 'success',
        message: '登录成功',
      })
      // 关闭按钮加载动画
      loading.value = false
    } catch (error) {
      ElNotification({
        type: 'error',
        message: (error as Error).message,
      })
      // 关闭按钮加载动画
      loading.value = false
    }
  }
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
