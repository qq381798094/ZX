<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-slider">
      <Logo />
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          router
          class="el-menu"
          background-color="#001529"
          text-color="#FFFFFF"
        >
          <!-- 动态菜单 -->
          <Menu :menuList="menuStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout-top-nav"></div>
    <!-- 内容展示 -->
    <div class="layout-main">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
  /** 引入组件 */
  import Logo from './logo/index.vue'
  import Menu from './menu/index.vue'
  import Main from './main/index.vue'
  /** 引入仓库 */
  import useMenuStore from '@/store/modules/menu'

  /** 实例化引用菜单仓库 */
  let menuStore = useMenuStore()
</script>

<style scoped lang="scss">
  .layout-container {
    width: 100%;
    height: 100vh;

    // 左侧菜单
    .layout-slider {
      width: $base-menu-width;
      height: 100vh;
      background: $base-menu-background;

      .scrollbar {
        width: 100%;
        height: calc(100vh - $base-menu-logo-height);
        color: #fff;

        .el-menu {
          border-right: none;
        }
      }
    }

    // 顶部导航
    .layout-top-nav {
      width: calc(100% - $base-menu-width);
      height: $base-top-nav-height;
      position: fixed;
      top: 0;
      left: $base-menu-width;
    }

    // 内容展示
    .layout-main {
      width: calc(100% - $base-menu-width);
      height: calc(100vh - $base-top-nav-height);
      position: absolute;
      top: $base-top-nav-height;
      left: $base-menu-width;
      padding: 20px;
      overflow: auto;
    }
  }
</style>
