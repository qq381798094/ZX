<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-slider"></div>
    <!-- 顶部导航 -->
    <div class="layout-top-nav"></div>
    <!-- 内容展示 -->
    <div class="layout-main"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .layout-container {
    width: 100%;
    height: 100vh;

    // 左侧菜单
    .layout-slider {
      width: $base-menu-width;
      height: 100vh;
      background: $base-menu-background;
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
