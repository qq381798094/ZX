<template>
  <div class="tab-bar-container">
    <!-- 左侧静态 -->
    <div class="tab-bar-left">
      <Breadcrumb />
    </div>
    <!-- 右侧静态 -->
    <div class="tab-bar-right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
  /** 组件 */
  import Breadcrumb from './breadcrumb/index.vue'
  import Setting from './setting/index.vue'
</script>
<script lang="ts">
  export default {
    name: 'TabBar',
  }
</script>

<style scoped lang="scss">
  .tab-bar-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tab-bar-left {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }

    .tab-bar-right {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
  }
</style>
