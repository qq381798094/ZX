<template>
  <div class="logo-component" v-if="setting.logoIsHidden">
    <img :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
  /** 引入标题和 logo 的配置文件 */
  import setting from '@/setting'
</script>
<script lang="ts">
  export default {
    name: 'Logo',
  }
</script>

<style scoped lang="scss">
  .logo-component {
    display: flex;
    align-items: center;
    width: 100%;
    height: $base-menu-logo-height;
    color: #fff;
    padding: 10px;

    > img {
      width: 40px;
      height: 40px;
    }

    > p {
      font-size: $base-menu-logo-title-fontSize;
      margin-left: 10px;
    }
  }
</style>
