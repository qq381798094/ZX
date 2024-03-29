<template>
  <div class="login-container">
    <el-row>
      <el-col :span="14" :xs="0"></el-col>
      <el-col :span="10" :xs="24">
        <el-form class="login-form" :model="loginForm" :rules="rules" :ref="loginFormRefs">
          <h1>Hello</h1>
          <h2>欢迎来到甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username" />
          </el-form-item>
          <el-form-item prop="password">
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
  import { useRouter, useRoute } from 'vue-router'
  /** 组件引入 */
  import { ElNotification } from 'element-plus'
  import { User, Lock } from '@element-plus/icons-vue'
  /** 工具引入 */
  import { getTime } from '@/utils/time'

  // 路由实例化
  const $router = useRouter()
  const $route = useRoute()

  // 仓库实例化
  let userStore = useUserStore()

  /** 收集账号与密码的数据 */
  let loginForm = reactive({
    username: 'admin',
    password: 'atguigu123',
  })

  /** 表单校验的配置 */
  // 表单 ref 获取
  const loginFormRefs = ref()
  // 自定义 username 校验规则
  const validatorUserName = (_rule: any, value: any, callback: any) => {
    if (/^\w{5,10}$/.test(value)) {
      callback()
    } else {
      callback(new Error('账号长度需要在5-10位之间'))
    }
  }
  // 自定义 password 校验规则
  const validatorPassword = (_rule: any, value: any, callback: any) => {
    if (value.length >= 5) {
      callback()
    } else {
      callback(new Error('密码长度至少为5位'))
    }
  }
  // 规则配置
  const rules = {
    username: [{ validator: validatorUserName, trigger: 'change' }],
    password: [{ validator: validatorPassword, trigger: 'change' }],
  }

  // 控制登录按钮的加载动画
  const loading = ref(false)
  /** 登录按钮点击事件 */
  const loginClick = async () => {
    // 开启登录按钮的加载动画
    loading.value = true
    // 检查表单验证是否通过
    await loginFormRefs.value?.validate()

    // 1. 通知仓库发送登录请求
    // 2. 成功 -> 跳转到首页
    // 3. 失败 -> 弹出相应错误信息
    try {
      await userStore.loginStatus(loginForm)
      // 跳转到首页或者是其他页面
      $router.push(($route.query.redirect as string) || '/')
      ElNotification({
        type: 'success',
        message: '欢迎回来',
        title: `Hi~${getTime()}好`,
      })
      // 关闭按钮加载动画
      loading.value = false
    } catch (error) {
      ElNotification({
        type: 'error',
        message: (error as Error).message,
        title: '警告',
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
